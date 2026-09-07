import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { Spinner } from '../components/Loading';
import { Branch } from '../components/Botanical';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { resetPassword } = useAuth();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await resetPassword(token, form);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.message);
      if (/invalid|expired/i.test(result.message)) {
        setLinkInvalid(true);
      } else {
        setErrors({ confirmPassword: result.message });
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <Branch className="pointer-events-none absolute right-0 top-10 hidden h-32 w-56 text-[rgb(var(--accent))] opacity-40 lg:block" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <Logo to="/" size="lg" />
          <p className="muted mt-3 font-hand text-lg">A fresh page, a fresh password.</p>
        </div>

        <div className="card p-7 sm:p-8">
          {linkInvalid ? (
            <>
              <h1 className="mb-1 font-serif text-2xl">This link has expired</h1>
              <p className="muted mb-6 text-sm leading-relaxed">
                Reset links only last an hour. Request a new one and we'll get you back in.
              </p>
              <Link to="/forgot-password" className="btn btn-primary w-full py-3">
                Request a new link
              </Link>
            </>
          ) : (
            <>
              <h1 className="mb-1 font-serif text-2xl">Set a new password</h1>
              <p className="muted mb-6 text-sm">Choose something you'll remember this time.</p>

              <form onSubmit={submit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="password" className="label">
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(var(--text-muted))' }}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={change}
                      placeholder="At least 6 characters"
                      className="input pl-10 pr-11"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="muted absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:text-[rgb(var(--heading))]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" role="alert" className="mt-1.5 text-xs" style={{ color: 'rgb(var(--brandy))' }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(var(--text-muted))' }}
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={change}
                      placeholder="Type it once more"
                      className="input pl-10"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p id="confirm-error" role="alert" className="mt-1.5 text-xs" style={{ color: 'rgb(var(--brandy))' }}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-full py-3" disabled={submitting}>
                  {submitting && <Spinner size={16} />}
                  {submitting ? 'Saving…' : 'Reset password'}
                </button>
              </form>
            </>
          )}

          <p className="muted mt-6 text-center text-sm">
            <Link to="/login" className="font-medium underline-offset-4 hover:underline" style={{ color: 'rgb(var(--brandy))' }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
