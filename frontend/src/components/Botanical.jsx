/**
 * Small hand-drawn botanical illustrations used sparingly as page decoration.
 * They are purely decorative, so they are hidden from assistive technology.
 */

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
};

export const SprigLeft = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 120 200" className={className}>
    <path
      d="M60 195C58 150 52 110 34 74M60 195c4-44 12-84 30-118"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity=".55"
    />
    <g opacity=".5">
      <ellipse cx="41" cy="96" rx="13" ry="7" transform="rotate(-32 41 96)" fill="currentColor" />
      <ellipse cx="79" cy="102" rx="13" ry="7" transform="rotate(32 79 102)" fill="currentColor" />
      <ellipse cx="47" cy="130" rx="11" ry="6" transform="rotate(-28 47 130)" fill="currentColor" />
      <ellipse cx="74" cy="136" rx="11" ry="6" transform="rotate(28 74 136)" fill="currentColor" />
      <ellipse cx="53" cy="162" rx="9" ry="5" transform="rotate(-24 53 162)" fill="currentColor" />
    </g>
    <circle cx="34" cy="70" r="6" fill="currentColor" opacity=".65" />
    <circle cx="90" cy="74" r="5" fill="currentColor" opacity=".5" />
    <circle cx="62" cy="52" r="7" fill="currentColor" opacity=".7" />
  </svg>
);

export const Branch = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 160 90" className={className}>
    <path
      d="M4 78C40 74 76 60 104 34"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity=".6"
    />
    <g opacity=".45" fill="currentColor">
      <ellipse cx="34" cy="66" rx="12" ry="6" transform="rotate(-18 34 66)" />
      <ellipse cx="58" cy="58" rx="12" ry="6" transform="rotate(-26 58 58)" />
      <ellipse cx="82" cy="46" rx="11" ry="5.5" transform="rotate(-34 82 46)" />
    </g>
    <circle cx="112" cy="26" r="7" fill="currentColor" opacity=".6" />
    <circle cx="128" cy="38" r="4.5" fill="currentColor" opacity=".45" />
  </svg>
);

export const Sprout = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 48 48" className={className}>
    <path d="M24 42V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    <path
      d="M24 26c-8 0-13-4-14-12 8-1 13 3 14 12zM24 22c7-1 11-5 12-12-7 0-11 4-12 12z"
      fill="currentColor"
      opacity=".55"
    />
  </svg>
);

export const Flower = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 40 40" className={className}>
    <g fill="currentColor" opacity=".55">
      <ellipse cx="20" cy="11" rx="5" ry="8" />
      <ellipse cx="20" cy="11" rx="5" ry="8" transform="rotate(72 20 20)" />
      <ellipse cx="20" cy="11" rx="5" ry="8" transform="rotate(144 20 20)" />
      <ellipse cx="20" cy="11" rx="5" ry="8" transform="rotate(216 20 20)" />
      <ellipse cx="20" cy="11" rx="5" ry="8" transform="rotate(288 20 20)" />
    </g>
    <circle cx="20" cy="20" r="4" fill="currentColor" opacity=".85" />
  </svg>
);

/** A tiny paper-tape "note" used as a decorative accent on the dashboard. */
export const TapedNote = ({ children, className = '', rotate = '-2deg' }) => (
  <div
    className={`relative select-none rounded-sm px-6 py-5 text-center shadow-paper ${className}`}
    style={{
      transform: `rotate(${rotate})`,
      backgroundColor: 'rgb(var(--surface-alt))',
      border: '1px solid rgb(var(--border))',
    }}
  >
    <span
      aria-hidden="true"
      className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rounded-sm opacity-70"
      style={{ backgroundColor: 'rgb(var(--accent) / 0.45)' }}
    />
    <p className="font-hand text-xl leading-snug" style={{ color: 'rgb(var(--heading))' }}>
      {children}
    </p>
  </div>
);
