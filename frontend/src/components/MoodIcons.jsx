/**
 * Cute illustrated mood characters — soft rounded little faces rather than
 * emoji or line icons, matching the same "sticker" language as the
 * scrapbook decoration charms (a die-cut cream outline + a soft drop
 * shadow, so each one still feels hand-placed rather than printed flat).
 *
 * Purely decorative, so hidden from assistive technology — the visible
 * label text next to each one carries the meaning.
 */

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

const ShadowDefs = ({ id }) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#5C4033" floodOpacity="0.32" />
  </filter>
);

/** The soft, slightly imperfect round "face" shape shared by most moods. */
const BLOB = 'M22 5C32 5 40 12 40 21C40 30 32 37 22 37C12 37 4 30 4 21C4 12 12 5 22 5Z';

export const HappyMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradHappy" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#F6DCA8" />
        <stop offset="1" stopColor="#D9AD66" />
      </radialGradient>
      <ShadowDefs id="shadow-happy" />
    </defs>
    <g filter="url(#shadow-happy)">
      <path d={BLOB} fill="url(#gradHappy)" stroke="#FFFBF7" strokeWidth="1.6" style={{ paintOrder: 'stroke' }} />
      <g opacity=".85">
        <circle cx="28" cy="2" r="2.3" fill="#F0AFC0" />
        <circle cx="30.6" cy="4.4" r="2.3" fill="#F0AFC0" />
        <circle cx="25.4" cy="4.4" r="2.3" fill="#F0AFC0" />
        <circle cx="28" cy="6.6" r="2.3" fill="#F0AFC0" />
        <circle cx="28" cy="4.4" r="1.6" fill="#F6D889" />
      </g>
      <ellipse cx="14" cy="24" rx="3" ry="2" fill="#E8967D" opacity=".4" />
      <ellipse cx="30" cy="24" rx="3" ry="2" fill="#E8967D" opacity=".4" />
      <path d="M13 19c1.2-1.6 3.6-1.6 4.8 0" stroke="#6B4B3E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M26.2 19c1.2-1.6 3.6-1.6 4.8 0" stroke="#6B4B3E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M15 26c3 3.4 11 3.4 14 0" stroke="#6B4B3E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const CalmMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradCalm" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#C3D0B6" />
        <stop offset="1" stopColor="#8A9A7B" />
      </radialGradient>
      <ShadowDefs id="shadow-calm" />
    </defs>
    <g filter="url(#shadow-calm)">
      <path d={BLOB} fill="url(#gradCalm)" stroke="#FFFBF7" strokeWidth="1.6" style={{ paintOrder: 'stroke' }} />
      <path d="M32 4c2.4 2.6 1.6 6-.6 8" stroke="#5E6E50" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".8" />
      <ellipse cx="33.4" cy="7.6" rx="2.6" ry="1.5" fill="#A9BC97" transform="rotate(35 33.4 7.6)" />
      <path d="M13 20h5" stroke="#43503A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M26 20h5" stroke="#43503A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 26c2.5 2 7.5 2 10 0" stroke="#43503A" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M3 20c-1.6.2-2.6 1-2.8 1.8" stroke="#8A9A7B" strokeWidth="1.1" strokeLinecap="round" opacity=".45" fill="none" />
      <path d="M41 20c1.6.2 2.6 1 2.8 1.8" stroke="#8A9A7B" strokeWidth="1.1" strokeLinecap="round" opacity=".45" fill="none" />
    </g>
  </svg>
);

export const LovedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradLoved" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#F3CDD1" />
        <stop offset="1" stopColor="#D89AA0" />
      </radialGradient>
      <ShadowDefs id="shadow-loved" />
    </defs>
    <g filter="url(#shadow-loved)">
      <path
        d="M22 36C10 28 4 21 4 14.5 4 8.6 8.8 4 14.4 4c3.4 0 6.4 1.8 7.6 4.6C23.2 5.8 26.2 4 29.6 4 35.2 4 40 8.6 40 14.5 40 21 34 28 22 36Z"
        fill="url(#gradLoved)"
        stroke="#FFFBF7"
        strokeWidth="1.6"
        style={{ paintOrder: 'stroke' }}
      />
      <ellipse cx="13" cy="18" rx="2.6" ry="1.8" fill="#C96B7E" opacity=".4" />
      <ellipse cx="31" cy="18" rx="2.6" ry="1.8" fill="#C96B7E" opacity=".4" />
      <path d="M11 14c1.2-1.5 3.4-1.5 4.6 0" stroke="#6B3E48" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M27.4 14c1.2-1.5 3.4-1.5 4.6 0" stroke="#6B3E48" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14 20c3 2.6 12 2.6 15 0" stroke="#6B3E48" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path
        d="M35.6 1.6c1-1 2.6-1 2.6.8 0 1.2-1.3 1.9-2.6 2.8-1.3-.9-2.6-1.6-2.6-2.8 0-1.8 1.6-1.8 2.6-.8Z"
        fill="#EFAEB6"
      />
    </g>
  </svg>
);

export const ExcitedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradExcited" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#F2C3B7" />
        <stop offset="1" stopColor="#D48D80" />
      </radialGradient>
      <ShadowDefs id="shadow-excited" />
    </defs>
    <g filter="url(#shadow-excited)">
      <path d={BLOB} fill="url(#gradExcited)" stroke="#FFFBF7" strokeWidth="1.6" style={{ paintOrder: 'stroke' }} />
      <circle cx="15" cy="19" r="3.2" fill="#5C3A32" />
      <circle cx="29" cy="19" r="3.2" fill="#5C3A32" />
      <circle cx="13.8" cy="17.6" r="1" fill="#fff" />
      <circle cx="27.8" cy="17.6" r="1" fill="#fff" />
      <ellipse cx="22" cy="27.5" rx="4" ry="3.2" fill="#7A4638" />
      <path d="M6 7l1 2.4L9.4 10.4 7 11.4 6 13.8 5 11.4 2.6 10.4 5 9.4Z" fill="#F3D08B" />
      <path d="M38 26l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" fill="#F3D08B" />
    </g>
  </svg>
);

export const NeutralMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradNeutral" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#D8CFC7" />
        <stop offset="1" stopColor="#AFA096" />
      </radialGradient>
      <ShadowDefs id="shadow-neutral" />
    </defs>
    <g filter="url(#shadow-neutral)">
      <path d={BLOB} fill="url(#gradNeutral)" stroke="#FFFBF7" strokeWidth="1.6" style={{ paintOrder: 'stroke' }} />
      <circle cx="15" cy="20" r="1.8" fill="#5C4F47" />
      <circle cx="29" cy="20" r="1.8" fill="#5C4F47" />
      <path d="M15 27h14" stroke="#5C4F47" strokeWidth="1.7" strokeLinecap="round" />
    </g>
  </svg>
);

export const SadMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradSad" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#C3D2E1" />
        <stop offset="1" stopColor="#8CA0B8" />
      </radialGradient>
      <ShadowDefs id="shadow-sad" />
    </defs>
    <g filter="url(#shadow-sad)">
      <path
        d="M22 8C31 8 38 14 38 21C38 30 31 36 22 36C13 36 6 30 6 21C6 14 13 8 22 8Z"
        fill="url(#gradSad)"
        stroke="#FFFBF7"
        strokeWidth="1.6"
        style={{ paintOrder: 'stroke' }}
      />
      <g opacity=".75">
        <ellipse cx="14" cy="6.5" rx="3.2" ry="2.4" fill="#B7C4D4" />
        <ellipse cx="17.6" cy="5.4" rx="3.8" ry="2.8" fill="#B7C4D4" />
        <ellipse cx="21.2" cy="6.8" rx="3" ry="2.2" fill="#B7C4D4" />
        <rect x="12" y="6" width="11" height="3" rx="1.5" fill="#B7C4D4" />
      </g>
      <path d="M13 18c1.2 1 3.2 1 4.6 0" stroke="#3E4E5E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M25.4 18c1.4-1 3.4-1 4.6 0" stroke="#3E4E5E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="15" cy="21" r="1.6" fill="#3E4E5E" />
      <circle cx="28" cy="21" r="1.6" fill="#3E4E5E" />
      <path d="M15.5 25c0 1.4-1 2-2 2s-2-.6-2-2c0-1.2 2-3 2-3s2 1.8 2 3Z" fill="#7FA0C0" />
      <path d="M16 30c2.5-2 9.5-2 12 0" stroke="#3E4E5E" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const AngryMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradAngry" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#DDA89B" />
        <stop offset="1" stopColor="#A96B5F" />
      </radialGradient>
      <ShadowDefs id="shadow-angry" />
    </defs>
    <g filter="url(#shadow-angry)">
      <path d={BLOB} fill="url(#gradAngry)" stroke="#FFFBF7" strokeWidth="1.6" style={{ paintOrder: 'stroke' }} />
      <g opacity=".6" fill="#DDA89B">
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="35" cy="6" r="1.6" />
        <circle cx="7" cy="2.6" r="1.1" />
        <circle cx="37" cy="2.6" r="1.1" />
      </g>
      <path d="M11 17l6 2" stroke="#5C332B" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M33 17l-6 2" stroke="#5C332B" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="15" cy="22" r="1.8" fill="#5C332B" />
      <circle cx="29" cy="22" r="1.8" fill="#5C332B" />
      <path d="M16 29c2-1.6 10-1.6 12 0" stroke="#5C332B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const AnxiousMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradAnxious" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#D3C4DC" />
        <stop offset="1" stopColor="#9986A8" />
      </radialGradient>
      <ShadowDefs id="shadow-anxious" />
    </defs>
    <g filter="url(#shadow-anxious)">
      <path d={BLOB} fill="url(#gradAnxious)" stroke="#FFFBF7" strokeWidth="1.6" style={{ paintOrder: 'stroke' }} />
      <path
        d="M35 6c1.8 0 3.2 1.3 3.2 3 0 1.7-1.7 2.6-3.2 2"
        stroke="#6B5A78"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity=".55"
      />
      <circle cx="15" cy="19" r="3" fill="none" stroke="#4A3B57" strokeWidth="1.6" />
      <circle cx="29" cy="19" r="3" fill="none" stroke="#4A3B57" strokeWidth="1.6" />
      <circle cx="15" cy="19" r="1.1" fill="#4A3B57" />
      <circle cx="29" cy="19" r="1.1" fill="#4A3B57" />
      <path d="M11 14l4 1.4" stroke="#4A3B57" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M33 14l-4 1.4" stroke="#4A3B57" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 28c2-2 3-2 5 0s3 2 5 0 3-2 5 0" stroke="#4A3B57" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const TiredMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradTired" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#C9BDD0" />
        <stop offset="1" stopColor="#8D7E95" />
      </radialGradient>
      <ShadowDefs id="shadow-tired" />
    </defs>
    <g filter="url(#shadow-tired)">
      <path
        d="M20 8C29 8 36 14 36 21C36 30 29 36 20 36C11 36 4 30 4 21C4 14 11 8 20 8Z"
        fill="url(#gradTired)"
        stroke="#FFFBF7"
        strokeWidth="1.6"
        style={{ paintOrder: 'stroke' }}
      />
      <path d="M9 20c1.6 1.6 4.6 1.6 6 0" stroke="#463B52" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M23 20c1.6 1.6 4.6 1.6 6 0" stroke="#463B52" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <ellipse cx="18" cy="27" rx="2.6" ry="2" fill="#463B52" />
      <text x="28" y="10" fontSize="7" fontFamily="Georgia, serif" fill="#8D7E95" opacity=".85">
        z
      </text>
      <text x="33" y="6" fontSize="5" fontFamily="Georgia, serif" fill="#8D7E95" opacity=".7">
        z
      </text>
    </g>
  </svg>
);
