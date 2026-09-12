/**
 * Small hand-drawn "scrapbook charm" illustrations — paper clips, washi tape,
 * pressed flowers and the like — used as an optional decorative accent on a
 * journal card. Purely decorative, so hidden from assistive technology.
 * Shapes lean slightly imperfect/asymmetric on purpose, in the same spirit
 * as the botanical sprigs already used elsewhere in Daynote.
 */

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

export const PaperClipCharm = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 34 46" fill="none" className={className}>
    <path
      d="M9 17V33.5a7 7 0 0 0 14 0V12a4.5 4.5 0 0 0-9 0v20a2 2 0 0 0 4 0V15"
      stroke="#A99B8E"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export const WashiTapeCharm = ({ className = '', color = '#D9A6B0' }) => (
  <svg {...base} viewBox="0 0 64 26" fill="none" className={className}>
    <path
      d="M3 4 61 2c1.4 4 1.4 16 0 22L3 22c-1.3-6-1.3-14 0-18Z"
      fill={color}
      opacity=".55"
    />
    <path
      d="M8 3 8 22M18 2.5 18 23M28 2 28 23.5M38 2 38 23.5M48 2 48 23"
      stroke="#fff"
      strokeOpacity=".35"
      strokeWidth="2"
    />
  </svg>
);

export const TinyFlowerCharm = ({ className = '', color = '#D9A6B0', center = '#E8C87C' }) => (
  <svg {...base} viewBox="0 0 32 32" fill="none" className={className}>
    <g fill={color} opacity=".8">
      <ellipse cx="16" cy="9" rx="4.4" ry="6.6" />
      <ellipse cx="16" cy="9" rx="4.4" ry="6.6" transform="rotate(72 16 16)" />
      <ellipse cx="16" cy="9" rx="4.4" ry="6.6" transform="rotate(144 16 16)" />
      <ellipse cx="16" cy="9" rx="4.4" ry="6.6" transform="rotate(216 16 16)" />
      <ellipse cx="16" cy="9" rx="4.4" ry="6.6" transform="rotate(288 16 16)" />
    </g>
    <circle cx="16" cy="16" r="3.4" fill={center} />
  </svg>
);

export const HeartCharm = ({ className = '', color = '#D98E96' }) => (
  <svg {...base} viewBox="0 0 28 24" fill="none" className={className}>
    <path
      d="M14 22C6 16.5 2 12.4 2 7.8 2 4 4.8 1.5 8 1.5c2.2 0 4.1 1.2 5.2 3 1-1.9 3.1-3 5.3-3 3.2 0 5.9 2.6 5.9 6.3 0 4.6-4 8.6-11.4 14.2Z"
      fill={color}
      opacity=".78"
    />
  </svg>
);

export const StarCharm = ({ className = '', color = '#E0B155' }) => (
  <svg {...base} viewBox="0 0 26 26" fill="none" className={className}>
    <path
      d="M13 1c.7 5 2.3 9 6.6 9.6-4.3.9-5.9 4.4-6.6 9.4-.8-5-2.3-8.5-6.6-9.4C10.7 10 12.3 6 13 1Z"
      fill={color}
      opacity=".85"
    />
    <circle cx="22" cy="4" r="1.3" fill={color} opacity=".6" />
  </svg>
);

export const ButterflyCharm = ({ className = '', color = '#9FB0C4' }) => (
  <svg {...base} viewBox="0 0 40 30" fill="none" className={className}>
    <path d="M20 6v18" stroke="#8A766A" strokeWidth="1.4" strokeLinecap="round" />
    <path
      d="M19 8c-2-6-9-8-13-5-3 2-3 8 1 10 4 2 10-1 12-5Z"
      fill={color}
      opacity=".75"
    />
    <path
      d="M21 8c2-6 9-8 13-5 3 2 3 8-1 10-4 2-10-1-12-5Z"
      fill={color}
      opacity=".75"
    />
    <path
      d="M19.5 15c-1.6-3.6-6.6-4.6-9.3-2.6-2 1.5-2 5.4 1 6.8 3 1.4 7-.7 8.3-4.2Z"
      fill={color}
      opacity=".55"
    />
    <path
      d="M20.5 15c1.6-3.6 6.6-4.6 9.3-2.6 2 1.5 2 5.4-1 6.8-3 1.4-7-.7-8.3-4.2Z"
      fill={color}
      opacity=".55"
    />
  </svg>
);

export const PostageStampCharm = ({ className = '', color = '#C7B08A' }) => (
  <svg {...base} viewBox="0 0 40 46" fill="none" className={className}>
    <rect
      x="3"
      y="3"
      width="34"
      height="40"
      rx="2"
      fill="#FBF7EF"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="3 3.4"
    />
    <path
      d="M13 30c0-8 3-13 7-16 4 3 7 8 7 16"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
      opacity=".8"
    />
    <circle cx="20" cy="14" r="3" fill={color} opacity=".7" />
  </svg>
);

export const TinyTagCharm = ({ className = '', color = '#C9A876' }) => (
  <svg {...base} viewBox="0 0 30 40" fill="none" className={className}>
    <path
      d="M15 2 3 12v22a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V12L15 2Z"
      fill="#F3E9D6"
      stroke={color}
      strokeWidth="1.8"
    />
    <circle cx="15" cy="12" r="2.4" fill="none" stroke={color} strokeWidth="1.6" />
    <path d="M9 26h12M9 31h8" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity=".6" />
  </svg>
);

export const PressedLeafCharm = ({ className = '', color = '#8A9A7B' }) => (
  <svg {...base} viewBox="0 0 26 44" fill="none" className={className}>
    <path
      d="M13 2C21 12 23 24 13 42 3 24 5 12 13 2Z"
      fill={color}
      opacity=".55"
    />
    <path d="M13 6v32" stroke={color} strokeWidth="1.2" opacity=".7" />
    <path
      d="M13 14 7 10M13 20 6 17M13 26 7 24M13 14l6-4M13 20l7-3M13 26l6-2"
      stroke={color}
      strokeWidth="1"
      opacity=".55"
    />
  </svg>
);

export const TinyBowCharm = ({ className = '', color = '#C58AA0' }) => (
  <svg {...base} viewBox="0 0 34 24" fill="none" className={className}>
    <path
      d="M16 12C13 6 6 5 3 8c-2.6 2.7-.6 8 5 8 4 0 7-1.7 8-4Z"
      fill={color}
      opacity=".75"
    />
    <path
      d="M18 12c3-6 10-7 13-4 2.6 2.7.6 8-5 8-4 0-7-1.7-8-4Z"
      fill={color}
      opacity=".75"
    />
    <circle cx="17" cy="12" r="3" fill={color} />
  </svg>
);

export const DoodleCharm = ({ className = '', color = '#8B4636' }) => (
  <svg {...base} viewBox="0 0 40 26" fill="none" className={className}>
    <path
      d="M2 18c3-10 8-14 11-9 2 3-1 8-4 7-2-.6-1-4 2-5 5-2 11 1 12 6 1-6 6-10 11-8"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity=".7"
    />
  </svg>
);

export const PinCharm = ({ className = '', color = '#B4645A' }) => (
  <svg {...base} viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="20" rx="3" ry="1.4" fill="#000" opacity=".08" />
    <circle cx="12" cy="10" r="7" fill={color} opacity=".85" />
    <circle cx="9.5" cy="7.5" r="2" fill="#fff" opacity=".3" />
    <path d="M12 16v5" stroke={color} strokeWidth="2" strokeLinecap="round" opacity=".7" />
  </svg>
);

export const PhotoCornerCharm = ({ className = '', color = '#EADFC8' }) => (
  <svg {...base} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M0 0h40L0 40V0Z" fill={color} opacity=".8" />
    <path d="M0 0 32 0M0 0 0 32" stroke="#B9A57C" strokeWidth="1" opacity=".5" />
  </svg>
);
