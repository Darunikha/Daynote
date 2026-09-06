import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Palette, ShieldCheck, LogOut, Sun, Moon, Trash2 } from 'lucide-react';
import { Spinner } from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import userService from '../services/userService';
import { getErrorMessage } from '../services/api';
import { formatDate } from '../utils/format';

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="card p-5 sm:p-6">
    <div className="mb-5 flex items-start gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgb(var(--accent-soft))', color: 'rgb(var(--brandy))' }}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-serif text-lg leading-tight">{title}</h2>
        {description && <p className="muted mt-0.5 text-sm">{description}</p>}
      </div>
    </div>
    {children}
  </section>
);

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (profile.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(profile);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwords.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await userService.updatePassword(passwords);
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const message = getErrorMessage(err);
      setPasswordError(message);
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out. See you soon.');
    navigate('/login', { replace: true });
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await userService.deleteAccount();
      logout();
      toast.success('Your account has been deleted');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="muted mt-1 text-sm">Make Daynote feel like yours.</p>
      </header>

      {/* Identity card */}
      <div className="card flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-serif text-xl font-semibold"
          style={{ backgroundColor: 'rgb(var(--accent) / 0.45)', color: 'rgb(var(--heading))' }}
          aria-hidden="true"
        >
          {user?.name?.[0]?.toUpperCase() || 'D'}
        </span>
        <div className="min-w-0">
          <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
            {user?.name}
          </p>
          <p className="muted truncate text-sm">{user?.email}</p>
          {user?.createdAt && (
            <p className="muted mt-0.5 text-xs">Writing here since {formatDate(user.createdAt)}</p>
          )}
        </div>
      </div>

      {/* Profile */}
      <Section icon={User} title="Profile" description="Your name and a line about you.">
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="input"
              maxLength={60}
            />
          </div>

          <div>
            <label htmlFor="bio" className="label">
              About you
            </label>
            <input
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Just a girl with a lot of thoughts"
              className="input"
              maxLength={160}
            />
          </div>

          <div>
            <label htmlFor="email-readonly" className="label">
              Email
            </label>
            <input
              id="email-readonly"
              value={user?.email || ''}
              readOnly
              disabled
              className="input opacity-60"
            />
            <p className="muted mt-1.5 text-xs">Your email cannot be changed here.</p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={savingProfile}>
            {savingProfile && <Spinner size={15} />}
            Save changes
          </button>
        </form>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance" description="Light for daytime, dark for late nights.">
        <div
          className="grid gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Colour theme"
        >
          {[
            { value: 'light', label: 'Light', icon: Sun, hint: 'Warm cream paper' },
            { value: 'dark', label: 'Dark', icon: Moon, hint: 'Soft warm night' },
          ].map(({ value, label, icon: Icon, hint }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(value)}
                className="flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200"
                style={{
                  borderColor: active ? 'rgb(var(--accent))' : 'rgb(var(--border))',
                  backgroundColor: active ? 'rgb(var(--accent) / 0.15)' : 'transparent',
                }}
              >
                <Icon size={18} aria-hidden="true" style={{ color: 'rgb(var(--brandy))' }} />
                <span>
                  <span className="block text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>
                    {label}
                  </span>
                  <span className="muted block text-xs">{hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Security */}
      <Section
        icon={ShieldCheck}
        title="Privacy & Security"
        description="Change your password. Entries are only ever visible to you."
      >
        <form onSubmit={savePassword} className="space-y-4">
          {[
            { id: 'currentPassword', label: 'Current password', autoComplete: 'current-password' },
            { id: 'newPassword', label: 'New password', autoComplete: 'new-password' },
            { id: 'confirmPassword', label: 'Confirm new password', autoComplete: 'new-password' },
          ].map(({ id, label, autoComplete }) => (
            <div key={id}>
              <label htmlFor={id} className="label">
                {label}
              </label>
              <input
                id={id}
                type="password"
                autoComplete={autoComplete}
                value={passwords[id]}
                onChange={(e) => {
                  setPasswords((p) => ({ ...p, [id]: e.target.value }));
                  setPasswordError('');
                }}
                className="input"
              />
            </div>
          ))}

          {passwordError && (
            <p role="alert" className="text-xs" style={{ color: 'rgb(var(--brandy))' }}>
              {passwordError}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={savingPassword}>
            {savingPassword && <Spinner size={15} />}
            Update password
          </button>
        </form>
      </Section>

      {/* Account */}
      <Section icon={LogOut} title="Account" description="Sign out or close your account.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleLogout} className="btn btn-ghost">
            <LogOut size={15} aria-hidden="true" />
            Log Out
          </button>
          <button type="button" onClick={() => setConfirmDelete(true)} className="btn btn-danger">
            <Trash2 size={15} aria-hidden="true" />
            Delete account
          </button>
        </div>
      </Section>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete your account?"
        message="This removes your account and every entry you have written. It cannot be undone."
        confirmLabel="Delete everything"
        onConfirm={deleteAccount}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
