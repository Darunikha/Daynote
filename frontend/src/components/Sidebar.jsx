import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  CalendarDays,
  HeartPulse,
  Star,
  Settings,
  LogOut,
  PenLine,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import Logo from './Logo';
import { SprigLeft } from './Botanical';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/journal', label: 'My Journal', icon: BookOpen },
  { to: '/memory-lane', label: 'Memory Lane', icon: Sparkles },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/mood', label: 'Mood Tracker', icon: HeartPulse },
  { to: '/favorites', label: 'Favorites', icon: Star },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'text-[rgb(var(--heading))]'
      : 'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--heading))]'
  }`;

const linkStyle = ({ isActive }) => ({
  backgroundColor: isActive ? 'rgb(var(--accent) / 0.35)' : 'transparent',
});

/** Persistent desktop sidebar. Mobile uses MobileNav instead. */
export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success('Signed out. See you soon.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="px-6 pb-6 pt-7">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} style={linkStyle} onClick={onNavigate}>
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  aria-hidden="true"
                  style={{ color: isActive ? 'rgb(var(--brandy))' : 'currentColor' }}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="px-0.5 pt-4">
          <NavLink
            to="/journal/new"
            onClick={onNavigate}
            className="btn btn-primary w-full !rounded-xl"
          >
            <PenLine size={16} aria-hidden="true" />
            New Entry
          </NavLink>
        </div>
      </nav>

      {/* Decorative sprig, hidden on short screens so it never crowds the nav */}
      <SprigLeft className="pointer-events-none mx-auto hidden h-32 w-20 shrink-0 opacity-70 2xl:block" />

      <div className="mt-4 border-t px-3 pb-5 pt-4">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-[rgb(var(--surface-alt))]"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-sm font-semibold"
            style={{ backgroundColor: 'rgb(var(--accent) / 0.45)', color: 'rgb(var(--heading))' }}
            aria-hidden="true"
          >
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>
              {user?.name}
            </span>
            <span className="muted block truncate text-xs">{user?.email}</span>
          </span>
        </NavLink>

        <div className="mt-1 flex items-center gap-1">
          <button
            type="button"
            onClick={handleLogout}
            className="muted flex flex-1 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[rgb(var(--surface-alt))] hover:text-[rgb(var(--brandy))]"
          >
            <LogOut size={17} aria-hidden="true" />
            Log Out
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="muted hidden rounded-xl p-2.5 transition-colors hover:bg-[rgb(var(--surface-alt))] hover:text-[rgb(var(--heading))] lg:block"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
}
