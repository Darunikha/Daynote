import { Link } from 'react-router-dom';
import { Lock, HeartPulse, Search, Feather, Moon, Sun } from 'lucide-react';
import Logo from '../components/Logo';
import { SprigLeft, Branch, TapedNote } from '../components/Botanical';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  {
    icon: Lock,
    title: 'Private & Secure',
    body: 'Your entries are tied to your account and no one else can read them.',
  },
  {
    icon: HeartPulse,
    title: 'Mood Tracking',
    body: 'Notice how your weeks actually feel, one gentle note at a time.',
  },
  {
    icon: Search,
    title: 'Search Your Memories',
    body: 'Find that one afternoon you wrote about, months later.',
  },
  {
    icon: Feather,
    title: 'Beautifully Simple',
    body: 'A calm page, a cursor, and nothing else asking for your attention.',
  },
];

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo to="/" />
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))]"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
          <SprigLeft className="pointer-events-none absolute -left-6 top-16 hidden h-64 w-40 text-[rgb(var(--olive))] opacity-40 lg:block" />
          <Branch className="pointer-events-none absolute right-0 top-8 hidden h-28 w-52 text-[rgb(var(--accent))] opacity-50 lg:block" />

          <div className="mx-auto max-w-2xl text-center">
            <p className="muted mb-5 font-hand text-xl">A little space for your thoughts</p>

            <h1 className="mb-5 font-serif text-4xl leading-tight sm:text-5xl md:text-[3.4rem]">
              Your thoughts deserve a place.
            </h1>

            <p className="muted mx-auto mb-9 max-w-lg text-base leading-relaxed sm:text-lg">
              A quiet little space to write, reflect, and remember.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className="btn btn-primary w-full px-7 py-3 sm:w-auto">
                Start Journaling
              </Link>
              <Link to="/login" className="btn btn-ghost w-full px-7 py-3 sm:w-auto">
                Login
              </Link>
            </div>
          </div>

          {/* A small taped note, like something pressed into a notebook */}
          <div className="mt-14 flex justify-center">
            <TapedNote className="max-w-xs" rotate="-1.5deg">
              Small steps,
              <br />
              big dreams.
            </TapedNote>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="card card-hover p-6">
                <span
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgb(var(--accent-soft))', color: 'rgb(var(--brandy))' }}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h2 className="mb-2 font-serif text-lg">{title}</h2>
                <p className="muted text-sm leading-relaxed">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="mx-auto max-w-2xl px-5 pb-24 text-center sm:px-8">
          <h2 className="mb-3 font-serif text-2xl sm:text-3xl">Same app, so many feelings.</h2>
          <p className="muted mb-7 leading-relaxed">
            Write a line or write a page. Daynote keeps it safe, and quietly shows you the shape of
            your months.
          </p>
          <Link to="/register" className="btn btn-olive px-7 py-3">
            Write your first entry
          </Link>
        </section>
      </main>

      <footer className="border-t py-8 text-center">
        <p className="muted text-xs">
          Daynote — a little space for your thoughts.
        </p>
      </footer>
    </div>
  );
}
