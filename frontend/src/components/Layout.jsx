import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X, Moon, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

/**
 * App shell: persistent sidebar on desktop, bottom bar plus a slide-in drawer
 * on mobile. Page content renders through <Outlet />.
 */
export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  // Close the drawer and scroll to the top whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:px-4 focus:py-2"
        style={{ backgroundColor: 'rgb(var(--surface))' }}
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r lg:block"
        style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
      >
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="absolute inset-0 animate-fade-in bg-[rgb(31,29,29)]/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 w-[86%] max-w-xs animate-slide-in-right border-r shadow-paper-lg"
            style={{ backgroundColor: 'rgb(var(--surface))' }}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="muted absolute right-4 top-6 z-10 rounded-full p-1.5 transition-colors hover:bg-[rgb(var(--surface-alt))]"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:hidden"
        style={{
          backgroundColor: 'rgb(var(--surface) / 0.92)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgb(var(--border))',
        }}
      >
        <Logo />
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="muted rounded-full p-2 transition-colors hover:bg-[rgb(var(--surface-alt))]"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* On desktop the theme toggle lives in the sidebar footer, so it can
          never overlap page content such as the editor's Save button. */}

      <main id="main" className="pb-28 lg:pb-10 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>

      <MobileNav onOpenMenu={() => setDrawerOpen(true)} />
    </div>
  );
}
