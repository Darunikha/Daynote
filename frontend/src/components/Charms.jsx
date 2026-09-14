/**
 * Scrapbook charm illustrations — washi tape, paper clips, pressed flowers
 * and the like — used as optional decorative stickers on a journal card.
 *
 * Style notes: these are meant to read as real stationery/stickers, not UI
 * icons. Two techniques do most of the work —
 *   1. a soft drop-shadow (`charmShadow`) so each piece looks physically
 *      placed on the page rather than printed flat onto it, and
 *   2. a thin cream "die-cut" outline (`paintOrder: 'stroke'` + a light
 *      stroke) on sticker-like shapes (hearts, stars, flowers…) so they read
 *      as a cut sticker rather than a solid icon glyph.
 * Paper pieces (tape, tags, notes, stamps) skip the die-cut edge — they're
 * paper, not stickers — and get a few faint hand-drawn fibre lines instead.
 *
 * Purely decorative, so hidden from assistive technology.
 */

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

/** Shared soft "sitting on paper" shadow, reused (identically) across charms. */
const ShadowDefs = ({ id = 'charmShadow', dy = 1.3, blur = 1 }) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feDropShadow dx="0" dy={dy} stdDeviation={blur} floodColor="#5C4033" floodOpacity="0.35" />
  </filter>
);

export const PaperClipCharm = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 34 46" fill="none" className={className}>
    <defs>
      <linearGradient id="gradClip" x1="0" y1="0" x2="34" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#EDF0F2" />
        <stop offset="0.55" stopColor="#B9C0C6" />
        <stop offset="1" stopColor="#848C94" />
      </linearGradient>
      <ShadowDefs id="shadow-clip" />
    </defs>
    <g filter="url(#shadow-clip)">
      <path
        d="M9 17V33.5a7 7 0 0 0 14 0V12a4.5 4.5 0 0 0-9 0v20a2 2 0 0 0 4 0V15"
        stroke="url(#gradClip)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M8 18v15.2a8 8 0 0 0 16 0V12.3"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  </svg>
);

export const WashiTapeCharm = ({ className = '', color = '#DBA9B3', colorDark = '#C48A96' }) => (
  <svg {...base} viewBox="0 0 74 30" fill="none" className={className}>
    <defs>
      <linearGradient id="gradTape" x1="0" y1="0" x2="0" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </linearGradient>
      <ShadowDefs id="shadow-tape" dy={1.5} />
    </defs>
    <path
      filter="url(#shadow-tape)"
      d="M2 6 5 3 9 5.5 13 2 17 5 21 2.5 25 5.5 29 2 33 5 37 2.5 41 5 45 2 49 5.5 53 2 57 5 61 2.5 65 5 69 2 72 6
         70 10 72 15 70 19 72 24 68 27 64 24.5 60 27 56 24.5 52 27 48 24 44 27 40 24.5 36 27 32 24 28 27 24 24.5
         20 27 16 24 12 27 8 24.5 4 27 2 22 4 17 1 12 4 8 1 3Z"
      fill="url(#gradTape)"
      opacity=".9"
    />
    <path
      d="M8 4v22M18 3v24M28 3v24M38 3v24M48 3v24M58 3v24"
      stroke="#fff"
      strokeOpacity=".32"
      strokeWidth="1.8"
    />
    <g opacity=".22" stroke="#5C4033" strokeWidth="0.6" strokeLinecap="round">
      <path d="M6 11 12 9" />
      <path d="M22 20 29 22" />
      <path d="M42 9 48 7" />
      <path d="M57 21 64 19" />
    </g>
  </svg>
);

export const TornPaperCharm = ({ className = '', color = '#F3E9D6', edge = '#D8C7A3' }) => (
  <svg {...base} viewBox="0 0 52 42" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-torn" />
    </defs>
    <path
      filter="url(#shadow-torn)"
      d="M3 7 8 3 14 6 20 2 27 6 33 3 39 7 46 4 48 11 45 15 47 20 44 25 47 30 43 34 46 38 39 36 33 39 26 36
         20 39 13 36 6 38 3 33 6 28 2 23 5 18 2 13 5 9 3 7Z"
      fill={color}
      stroke={edge}
      strokeWidth="0.9"
    />
    <g opacity=".3" stroke="#8A766A" strokeWidth="0.7" strokeLinecap="round">
      <path d="M10 13 21 11" />
      <path d="M15 23 28 25" />
      <path d="M30 15 41 17" />
      <path d="M12 31 23 30" />
    </g>
  </svg>
);

export const TinyFlowerCharm = ({ className = '', color = '#E39BAE', colorDark = '#C97992', center = '#F4C563' }) => (
  <svg {...base} viewBox="0 0 40 40" fill="none" className={className}>
    <defs>
      <radialGradient id="gradPetal" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </radialGradient>
      <radialGradient id="gradCenter" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#FCE3A0" />
        <stop offset="1" stopColor={center} />
      </radialGradient>
      <ShadowDefs id="shadow-flower" />
    </defs>
    <g filter="url(#shadow-flower)">
      <g fill="url(#gradPetal)" stroke="#FFFBF7" strokeWidth="1.3" style={{ paintOrder: 'stroke' }}>
        <ellipse cx="20" cy="10" rx="6.5" ry="9.5" />
        <ellipse cx="20" cy="10" rx="6.5" ry="9.5" transform="rotate(72 20 20)" />
        <ellipse cx="20" cy="10" rx="6.5" ry="9.5" transform="rotate(144 20 20)" />
        <ellipse cx="20" cy="10" rx="6.5" ry="9.5" transform="rotate(216 20 20)" />
        <ellipse cx="20" cy="10" rx="6.5" ry="9.5" transform="rotate(288 20 20)" />
      </g>
      <circle cx="20" cy="20" r="5" fill="url(#gradCenter)" stroke="#FFFBF7" strokeWidth="1" style={{ paintOrder: 'stroke' }} />
      <circle cx="18.2" cy="18.2" r="1.3" fill="#fff" opacity=".55" />
    </g>
  </svg>
);

export const PressedFlowerCharm = ({ className = '', color = '#C9A9C4' }) => (
  <svg {...base} viewBox="0 0 40 40" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-pressedflower" dy={0.8} blur={0.7} />
    </defs>
    <g filter="url(#shadow-pressedflower)" opacity=".88">
      <g fill={color} opacity=".55">
        <ellipse cx="20" cy="9" rx="5.5" ry="8.5" />
        <ellipse cx="20" cy="9" rx="5.5" ry="8.5" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="9" rx="5.5" ry="8.5" transform="rotate(120 20 20)" />
        <ellipse cx="20" cy="9" rx="5.5" ry="8.5" transform="rotate(180 20 20)" />
        <ellipse cx="20" cy="9" rx="5.5" ry="8.5" transform="rotate(240 20 20)" />
        <ellipse cx="20" cy="9" rx="5.5" ry="8.5" transform="rotate(300 20 20)" />
      </g>
      <g stroke="#8A6B7E" strokeWidth="0.5" opacity=".5">
        <path d="M20 20 20 3" />
        <path d="M20 20 33 12" />
        <path d="M20 20 33 28" />
        <path d="M20 20 20 37" />
        <path d="M20 20 7 28" />
        <path d="M20 20 7 12" />
      </g>
      <circle cx="20" cy="20" r="3.2" fill="#B99A6B" opacity=".65" />
    </g>
  </svg>
);

export const HeartCharm = ({ className = '', color = '#E491A0', colorDark = '#C96B7E' }) => (
  <svg {...base} viewBox="0 0 30 26" fill="none" className={className}>
    <defs>
      <linearGradient id="gradHeart" x1="0" y1="0" x2="0" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </linearGradient>
      <ShadowDefs id="shadow-heart" />
    </defs>
    <path
      filter="url(#shadow-heart)"
      d="M15 24C6 18 2 13.5 2 8.6 2 4.6 5 1.8 8.4 1.8c2.4 0 4.4 1.3 5.6 3.2 1.2-2 3.3-3.2 5.7-3.2C23 1.8 26 4.7 26 8.7c0 4.9-4.3 9.3-11 15.3Z"
      fill="url(#gradHeart)"
      stroke="#FFFBF7"
      strokeWidth="1.4"
      style={{ paintOrder: 'stroke' }}
    />
    <path d="M9 6.5c-2 .2-3.4 1.7-3.4 3.6" stroke="#fff" strokeOpacity=".55" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </svg>
);

export const StarCharm = ({ className = '', color = '#F0C46B', colorDark = '#DA9F45' }) => (
  <svg {...base} viewBox="0 0 30 30" fill="none" className={className}>
    <defs>
      <linearGradient id="gradStar" x1="0" y1="0" x2="0" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </linearGradient>
      <ShadowDefs id="shadow-star" />
    </defs>
    <g filter="url(#shadow-star)">
      <path
        d="M15 1c1 6.4 3 10.6 8.2 12-5.2 1.1-7.2 5.3-8.2 11.7-1-6.4-3-10.6-8.2-11.7C11.8 11.6 14 7.4 15 1Z"
        fill="url(#gradStar)"
        stroke="#FFFBF7"
        strokeWidth="1.2"
        style={{ paintOrder: 'stroke' }}
      />
      <circle cx="25" cy="5" r="1.6" fill={color} />
      <circle cx="4" cy="22" r="1.1" fill={color} opacity=".8" />
      <path d="M11 8c1-2 2-3 3-3" stroke="#fff" strokeOpacity=".6" strokeWidth="1" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const ButterflyCharm = ({ className = '', color = '#9FB0C4', colorDark = '#7C93AC', accent = '#E7C7D3' }) => (
  <svg {...base} viewBox="0 0 44 34" fill="none" className={className}>
    <defs>
      <linearGradient id="gradWing" x1="0" y1="0" x2="0" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </linearGradient>
      <ShadowDefs id="shadow-butterfly" />
    </defs>
    <g filter="url(#shadow-butterfly)">
      <path d="M22 9c1-2 2-4 3-5" stroke="#5C4033" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M22 9c-1-2-2-4-3-5" stroke="#5C4033" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M22 8v20" stroke="#8A766A" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M20 9c-2-7-11-9-16-5-3.5 2.7-3 10 2 12 5 2 12-1 14-7Z"
        fill="url(#gradWing)"
        stroke="#FFFBF7"
        strokeWidth="1.2"
        style={{ paintOrder: 'stroke' }}
      />
      <path
        d="M24 9c2-7 11-9 16-5 3.5 2.7 3 10-2 12-5 2-12-1-14-7Z"
        fill="url(#gradWing)"
        stroke="#FFFBF7"
        strokeWidth="1.2"
        style={{ paintOrder: 'stroke' }}
      />
      <path
        d="M19.5 17c-1.8-4-7.5-5-10.5-2.5-2.3 2-2 6.3 1.3 7.8 3.4 1.6 7.8-.5 9.2-5.3Z"
        fill={accent}
        opacity=".85"
        stroke="#FFFBF7"
        strokeWidth="1"
        style={{ paintOrder: 'stroke' }}
      />
      <path
        d="M24.5 17c1.8-4 7.5-5 10.5-2.5 2.3 2 2 6.3-1.3 7.8-3.4 1.6-7.8-.5-9.2-5.3Z"
        fill={accent}
        opacity=".85"
        stroke="#FFFBF7"
        strokeWidth="1"
        style={{ paintOrder: 'stroke' }}
      />
      <circle cx="22" cy="9" r="1.4" fill="#5C4033" />
    </g>
  </svg>
);

export const PostageStampCharm = ({ className = '', edge = '#C7B08A', scene = '#8CA37C', sky = '#F6EFDD' }) => (
  <svg {...base} viewBox="0 0 44 52" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-stamp" dy={1.5} />
    </defs>
    <g filter="url(#shadow-stamp)">
      <rect x="3" y="3" width="38" height="46" rx="2" fill={sky} stroke={edge} strokeWidth="2.2" strokeDasharray="3 3.6" />
      <circle cx="22" cy="19" r="5" fill="#F0C46B" />
      <path d="M6 34 14 24 20 30 27 20 38 34Z" fill={scene} opacity=".85" />
      <path d="M6 34h32v10H6Z" fill={scene} opacity=".6" />
      <circle cx="34" cy="12" r="7" fill="none" stroke="#8A766A" strokeWidth="1" opacity=".5" strokeDasharray="1.5 1.5" />
      <path d="M30 12h8M34 8v8" stroke="#8A766A" strokeWidth="0.8" opacity=".5" />
    </g>
  </svg>
);

export const TinyTagCharm = ({ className = '', color = '#C9A876', paper = '#F3E9D6' }) => (
  <svg {...base} viewBox="0 0 34 46" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-tag" dy={1.4} />
    </defs>
    <path d="M17 3c-3 3-6 5-6 8" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".7" />
    <g filter="url(#shadow-tag)">
      <path d="M17 8 4 20v20a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V20L17 8Z" fill={paper} stroke={color} strokeWidth="1.8" />
      <circle cx="17" cy="18" r="2.6" fill="none" stroke={color} strokeWidth="1.6" />
    </g>
    <g stroke="#8A766A" strokeWidth="1.2" strokeLinecap="round" opacity=".5">
      <path d="M9 30q3-2 6 0t6 0" />
      <path d="M9 36q3-2 6 0t6 0" />
    </g>
  </svg>
);

export const NoteCharm = ({ className = '', paper = '#FBF7EF', fold = '#E9DEC4' }) => (
  <svg {...base} viewBox="0 0 42 42" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-note" dy={1.4} />
    </defs>
    <g filter="url(#shadow-note)">
      <path d="M4 3h26l8 8v28H4Z" fill={paper} stroke="#D8C7A3" strokeWidth="1.4" />
      <path d="M30 3v8h8Z" fill={fold} stroke="#D8C7A3" strokeWidth="1" />
    </g>
    <g stroke="#8A766A" strokeWidth="1.3" strokeLinecap="round" opacity=".55">
      <path d="M10 18q4-2 8 0t8-1" />
      <path d="M10 24q5-2 10 0" />
      <path d="M10 30q3-1.5 6 0" />
    </g>
  </svg>
);

export const PressedLeafCharm = ({ className = '', color = '#93A87F', colorDark = '#71865C' }) => (
  <svg {...base} viewBox="0 0 30 48" fill="none" className={className}>
    <defs>
      <linearGradient id="gradLeaf" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </linearGradient>
      <ShadowDefs id="shadow-leaf" />
    </defs>
    <path
      filter="url(#shadow-leaf)"
      d="M15 2C24 13 26 27 15 46 4 27 6 13 15 2Z"
      fill="url(#gradLeaf)"
      stroke="#FFFBF7"
      strokeWidth="1.3"
      style={{ paintOrder: 'stroke' }}
    />
    <path d="M15 7v34" stroke="#4E5E3D" strokeWidth="1" opacity=".55" />
    <g stroke="#4E5E3D" strokeWidth="0.8" opacity=".5">
      <path d="M15 15 8 11" />
      <path d="M15 22 6 19" />
      <path d="M15 29 7 27" />
      <path d="M15 15l7-4" />
      <path d="M15 22l9-3" />
      <path d="M15 29l8-2" />
    </g>
  </svg>
);

export const TinyBowCharm = ({ className = '', color = '#D6899F', colorDark = '#B96A82' }) => (
  <svg {...base} viewBox="0 0 44 32" fill="none" className={className}>
    <defs>
      <linearGradient id="gradBow" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </linearGradient>
      <ShadowDefs id="shadow-bow" />
    </defs>
    <g filter="url(#shadow-bow)">
      <path
        d="M20 16C16 6 6 5 3 9c-3 4 0 12 8 12 5.5 0 8.5-2 9-5Z"
        fill="url(#gradBow)"
        stroke="#FFFBF7"
        strokeWidth="1.3"
        style={{ paintOrder: 'stroke' }}
      />
      <path
        d="M24 16c4-10 14-11 17-7 3 4 0 12-8 12-5.5 0-8.5-2-9-5Z"
        fill="url(#gradBow)"
        stroke="#FFFBF7"
        strokeWidth="1.3"
        style={{ paintOrder: 'stroke' }}
      />
      <circle cx="22" cy="16" r="4.6" fill={colorDark} stroke="#FFFBF7" strokeWidth="1.3" style={{ paintOrder: 'stroke' }} />
      <path d="M22 20 18 30l3 1 1-6 1 6 3-1Z" fill="url(#gradBow)" opacity=".9" />
    </g>
  </svg>
);

export const DoodleCharm = ({ className = '', color = '#B4645A', accent = '#E0B155' }) => (
  <svg {...base} viewBox="0 0 46 30" fill="none" className={className}>
    <path
      d="M3 20c3-11 9-15 12-10 2 3-1 9-4 8-2-.7-1-4.5 2-5.6 5.5-2.2 12 1 13 6.6 1-6.6 7-11 12-8.8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity=".8"
    />
    <circle cx="40" cy="6" r="1.6" fill={accent} />
    <circle cx="5" cy="6" r="1.2" fill={accent} opacity=".8" />
    <path d="M20 4l1.4 1.4M18.6 4l1.4-1.4" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const DividerCharm = ({ className = '', color = '#B4899B' }) => (
  <svg {...base} viewBox="0 0 60 16" fill="none" className={className}>
    <path
      d="M2 8c4-6 8 6 12 0s8-6 12 0 8-6 12 0 8-6 12 0 8-6 8 0"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
      opacity=".75"
    />
    <circle cx="2" cy="8" r="1.6" fill={color} />
    <circle cx="58" cy="8" r="1.6" fill={color} />
  </svg>
);

export const ChecklistCharm = ({ className = '', paper = '#FBF7EF', ink = '#6B4B5A', check = '#8A9A7B' }) => (
  <svg {...base} viewBox="0 0 38 46" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-checklist" dy={1.4} />
    </defs>
    <g filter="url(#shadow-checklist)">
      <rect x="3" y="3" width="32" height="40" rx="2.5" fill={paper} stroke="#D8C7A3" strokeWidth="1.4" transform="rotate(-3 19 23)" />
    </g>
    <g transform="rotate(-3 19 23)">
      <rect x="8" y="11" width="6" height="6" rx="1.4" fill="none" stroke={check} strokeWidth="1.6" />
      <path d="M9.3 14.2l1.6 1.6 3-3.4" stroke={check} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M17 14h11" stroke={ink} strokeWidth="1.4" strokeLinecap="round" opacity=".6" />

      <rect x="8" y="22" width="6" height="6" rx="1.4" fill="none" stroke={check} strokeWidth="1.6" />
      <path d="M9.3 25.2l1.6 1.6 3-3.4" stroke={check} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M17 25h9" stroke={ink} strokeWidth="1.4" strokeLinecap="round" opacity=".6" />

      <rect x="8" y="33" width="6" height="6" rx="1.4" fill="none" stroke={ink} strokeWidth="1.6" opacity=".5" />
      <path d="M17 36h7" stroke={ink} strokeWidth="1.4" strokeLinecap="round" opacity=".4" />
    </g>
  </svg>
);

export const PinCharm = ({ className = '', color = '#C4685D', colorDark = '#9E4C42' }) => (
  <svg {...base} viewBox="0 0 26 30" fill="none" className={className}>
    <defs>
      <radialGradient id="gradPin" cx="35%" cy="30%" r="70%">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={colorDark} />
      </radialGradient>
      <ShadowDefs id="shadow-pin" dy={1.6} />
    </defs>
    <ellipse cx="13" cy="26" rx="4" ry="1.6" fill="#000" opacity=".12" />
    <g filter="url(#shadow-pin)">
      <path d="M13 18v8" stroke={colorDark} strokeWidth="2" strokeLinecap="round" />
      <circle cx="13" cy="11" r="9" fill="url(#gradPin)" />
      <ellipse cx="9.5" cy="7.5" rx="3" ry="2" fill="#fff" opacity=".4" />
    </g>
  </svg>
);

export const PhotoCornerCharm = ({ className = '', color = '#EADFC8', edge = '#B9A57C' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <ShadowDefs id="shadow-photocorner" dy={0.9} blur={0.7} />
    </defs>
    <g filter="url(#shadow-photocorner)">
      <path d="M0 0h44L0 44V0Z" fill={color} />
      <path d="M0 0 35 0 0 35Z" fill="#fff" opacity=".18" />
    </g>
    <path d="M0 4 4 0M0 12 12 0M0 20 20 0" stroke={edge} strokeWidth="1" opacity=".4" />
  </svg>
);
