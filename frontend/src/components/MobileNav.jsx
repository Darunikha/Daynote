import { NavLink } from 'react-router-dom';
import { Home, BookOpen, PenLine, CalendarDays, Menu } from 'lucide-react';

/**
 * Mobile navigation: a compact bottom bar with the most-used destinations plus
 * a prominent "write" button in the middle. The remaining pages live behind
 * the drawer opened by the "More" button.
 */
const ITEMS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/journal/new', label: 'Write', icon: PenLine, primary: true },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function MobileNav({ onOpenMenu }) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      style={{
        backgroundColor: 'rgb(var(--surface))',
        borderColor: 'rgb(var(--border))',
        boxShadow: '0 -8px 24px -20px rgba(107,75,90,.5)',
      }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between">
        {ITEMS.map(({ to, label, icon: Icon, primary }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/dashboard'}
              className="flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium transition-colors"
            >
              {({ isActive }) =>
                primary ? (
                  <>
                    <span
                      className="-mt-4 flex h-11 w-11 items-center justify-center rounded-full shadow-paper"
                      style={{ backgroundColor: 'rgb(var(--accent))', color: '#4A3038' }}
                    >
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span style={{ color: 'rgb(var(--text-muted))' }}>{label}</span>
                  </>
                ) : (
                  <>
                    <span
                      className="flex h-8 w-12 items-center justify-center rounded-full transition-colors"
                      style={{
                        backgroundColor: isActive ? 'rgb(var(--accent) / 0.35)' : 'transparent',
                        color: isActive ? 'rgb(var(--brandy))' : 'rgb(var(--text-muted))',
                      }}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span
                      style={{ color: isActive ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}
                    >
                      {label}
                    </span>
                  </>
                )
              }
            </NavLink>
          </li>
        ))}

        <li className="flex-1">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium"
          >
            <span
              className="flex h-8 w-12 items-center justify-center rounded-full"
              style={{ color: 'rgb(var(--text-muted))' }}
            >
              <Menu size={18} aria-hidden="true" />
            </span>
            <span style={{ color: 'rgb(var(--text-muted))' }}>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
