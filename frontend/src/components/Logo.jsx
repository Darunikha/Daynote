import { Link } from 'react-router-dom';

/** Daynote wordmark with its small sprig. */
export default function Logo({ to = '/dashboard', size = 'md', className = '' }) {
  const text = size === 'lg' ? 'text-2xl' : 'text-xl';
  const icon = size === 'lg' ? 26 : 22;

  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M23 7c0 8-5 13.5-11 14C12.4 13.5 17 8.4 23 7z"
          fill="rgb(var(--olive))"
          opacity=".85"
        />
        <path
          d="M9 27c1-6 4-10.5 9-14.5"
          stroke="rgb(var(--brandy))"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="22" cy="22" r="3" fill="rgb(var(--accent))" />
      </svg>
      <span className={`font-serif font-semibold tracking-tight ${text}`} style={{ color: 'rgb(var(--heading))' }}>
        Daynote
      </span>
    </span>
  );

  return to ? (
    <Link to={to} aria-label="Daynote home" className="inline-flex">
      {inner}
    </Link>
  ) : (
    inner
  );
}
