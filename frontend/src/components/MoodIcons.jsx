/**
 * Illustrated mood stickers — one small character per mood, drawn the way a
 * scrapbook sticker would be. Each is its own object with its own little
 * expression and props (a teacup for calm, a nightcap for tired…), so the
 * mood reads at a glance even at small sizes, and none of them is just a
 * recoloured face. They share the die-cut language of the decoration
 * charms: a thin cream edge plus a soft drop shadow, so each one still
 * feels placed on the page rather than printed flat onto it.
 *
 * Keep the exported names stable — utils/moods.js maps each mood to its
 * component. To swap in a real hand-drawn asset later, replace the SVG body
 * of the matching component and leave the name and `className` prop alone.
 *
 * Purely decorative, so hidden from assistive technology — the visible
 * label text next to each one carries the meaning.
 */

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

const INK = '#6B4B3E';
const BLUSH = '#E8967D';
const EDGE = { stroke: '#FFFBF7', strokeWidth: 1.4, style: { paintOrder: 'stroke' } };

const ShadowDefs = ({ id }) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#5C4033" floodOpacity="0.3" />
  </filter>
);

/** A small four-point sparkle, centred on (x, y). */
const Sparkle = ({ x, y, size = 3, fill = '#F6D889' }) => (
  <path
    transform={`translate(${x} ${y}) scale(${size / 3})`}
    d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"
    fill={fill}
  />
);

/** Cheeks, used across several characters. */
const Cheeks = ({ y = 25, lx = 14, rx = 30, opacity = 0.45 }) => (
  <>
    <ellipse cx={lx} cy={y} rx="2.4" ry="1.6" fill={BLUSH} opacity={opacity} />
    <ellipse cx={rx} cy={y} rx="2.4" ry="1.6" fill={BLUSH} opacity={opacity} />
  </>
);

/** Happy — a beaming little sun with rosy cheeks, a bow and a sparkle. */
export const HappyMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradHappy" cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#FFF6DA" />
        <stop offset="1" stopColor="#F7D58C" />
      </radialGradient>
      <ShadowDefs id="shadow-happy" />
    </defs>
    <g filter="url(#shadow-happy)">
      <path
        d="M22 5v3M22 36v3M5 22h3M36 22h3M9.5 9.5l2.1 2.1M32.4 32.4l2.1 2.1M9.5 34.5l2.1-2.1M32.4 11.6l2.1-2.1"
        stroke="#F2CB7A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="22" r="10.5" fill="url(#gradHappy)" {...EDGE} />
      <path d="M16.5 20.5q1.6-2 3.2 0M24.3 20.5q1.6-2 3.2 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M17.5 24.5q4.5 4.2 9 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Cheeks y={24} lx={14.5} rx={29.5} />
      {/* little bow tucked on top */}
      <path d="M18 12.5q2-2.6 4-.4q2-2.2 4 .4q-2 2.6-4 .4q-2 2.2-4-.4Z" fill="#F3A6B4" {...EDGE} />
      <Sparkle x={38} y={8} size={3.5} />
    </g>
  </svg>
);

/** Calm — a steaming teacup, the quiet "pause and breathe" object. */
export const CalmMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradCalm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D6E6C8" />
        <stop offset="1" stopColor="#A3B895" />
      </linearGradient>
      <ShadowDefs id="shadow-calm" />
    </defs>
    <g filter="url(#shadow-calm)">
      {/* steam */}
      <path d="M16 13q-2-2.5 0-5M22 12q-2-2.5 0-5M28 13q-2-2.5 0-5" stroke="#B9AFA7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* saucer */}
      <ellipse cx="22" cy="34" rx="14" ry="3.2" fill="#E5D3C0" {...EDGE} />
      {/* cup */}
      <path d="M10 18H34V27C34 31.5 30 34.5 22 34.5C14 34.5 10 31.5 10 27Z" fill="url(#gradCalm)" {...EDGE} />
      {/* handle */}
      <path d="M34 21.5h3.5a3.5 3.5 0 0 1 0 7H34" stroke="#A3B895" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* content: closed content eyes */}
      <path d="M15.5 25.5q2 1.8 4 0M24.5 25.5q2 1.8 4 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <Cheeks y={27} lx={13.8} rx={30.8} opacity={0.35} />
      <path d="M19 22.5q1.2 1.4 0 2.8" stroke="#FFFBF7" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".8" />
    </g>
  </svg>
);

/** Loved — a plump pink heart with a tiny hug-bow and a glint. */
export const LovedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradLoved" cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor="#FCDDE2" />
        <stop offset="1" stopColor="#E28FA0" />
      </radialGradient>
      <ShadowDefs id="shadow-loved" />
    </defs>
    <g filter="url(#shadow-loved)">
      <path
        d="M22 37C9.5 29 5 22.5 5 16C5 10 9.5 6.5 14.5 6.5C18 6.5 20.8 8.5 22 11C23.2 8.5 26 6.5 29.5 6.5C34.5 6.5 39 10 39 16C39 22.5 34.5 29 22 37Z"
        fill="url(#gradLoved)"
        {...EDGE}
      />
      <path d="M11 14.5q1.2-2.2 3.2-2.4" stroke="#FFFBF7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* tiny bow at the top-right, like a gift tag */}
      <path d="M31 9.5q2-3.4 4.2 0q2.2-3.4 0 0q2.2 3.4-.2 0q-2.2 3.4-4 0Z" fill="#F7C7D0" {...EDGE} />
      <Sparkle x={7} y={38} size={3} fill="#F3C9D0" />
      <Sparkle x={38} y={36} size={2.4} fill="#F3C9D0" />
    </g>
  </svg>
);

/** Excited — a bouncing star with arms up and a wide open-mouth grin. */
export const ExcitedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradExcited" cx="40%" cy="35%" r="75%">
        <stop offset="0" stopColor="#FFD9BF" />
        <stop offset="1" stopColor="#EC9F79" />
      </radialGradient>
      <ShadowDefs id="shadow-excited" />
    </defs>
    <g filter="url(#shadow-excited)">
      {/* little motion marks: it's bouncing */}
      <path d="M5 13l-2.5-1.5M4.5 18.5H1.5M39 13l2.5-1.5M39.5 18.5h3" stroke="#E8A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M22 7.5L25.6 16.6L35.6 17.2L27.7 23.4L30.4 33.6L22 27.8L13.6 33.6L16.3 23.4L8.4 17.2L18.4 16.6Z"
        fill="url(#gradExcited)"
        {...EDGE}
        strokeLinejoin="round"
      />
      {/* open-mouth grin */}
      <path d="M18.5 22.5h7q-.4 4-3.5 4t-3.5-4Z" fill="#8C4F3E" />
      <path d="M20.2 25.2q1.8 1.2 3.6 0" stroke="#F4A2A2" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M15.8 19.8q1-1.4 2.2 0M26 19.8q1-1.4 2.2 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* confetti */}
      <circle cx="37" cy="36" r="1.4" fill="#F6D889" />
      <circle cx="6" cy="36" r="1.2" fill="#E8A3B8" />
      <Sparkle x={38} y={6} size={3.5} />
    </g>
  </svg>
);

/** Neutral — a calm, flat river pebble with a small sprout. Just there. */
export const NeutralMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradNeutral" cx="38%" cy="30%" r="80%">
        <stop offset="0" stopColor="#EEEAE4" />
        <stop offset="1" stopColor="#B9AEA3" />
      </radialGradient>
      <ShadowDefs id="shadow-neutral" />
    </defs>
    <g filter="url(#shadow-neutral)">
      <path d="M22 17.5q-.6-4.5 1.8-7.5q2.4 3 1.8 7.5" fill="#A9C79A" {...EDGE} />
      <path
        d="M7 33C6.5 27.5 10.5 22 17 21.2C21 20.7 25.5 20.6 30 21.8C36.5 23.5 38.5 28.5 37 33C35.5 37.5 11 38.5 7 33Z"
        fill="url(#gradNeutral)"
        {...EDGE}
      />
      {/* flat, steady mouth and simple dot eyes */}
      <circle cx="17.5" cy="28" r="1.3" fill={INK} />
      <circle cx="26.5" cy="28" r="1.3" fill={INK} />
      <path d="M19.5 31.5h5" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <Cheeks y={31} lx={13.5} rx={30.5} opacity={0.3} />
    </g>
  </svg>
);

/** Sad — a little rain cloud looking down, with a droopy umbrella tilt and drops. */
export const SadMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradSad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D5E0EF" />
        <stop offset="1" stopColor="#97B0CE" />
      </linearGradient>
      <ShadowDefs id="shadow-sad" />
    </defs>
    <g filter="url(#shadow-sad)">
      <path
        d="M10 31A6.5 6.5 0 0 1 9 18.5A8.5 8.5 0 0 1 23 12.5A9.5 9.5 0 0 1 36 19A6.5 6.5 0 0 1 35 31Z"
        fill="url(#gradSad)"
        {...EDGE}
      />
      {/* droopy eyes and a small frown */}
      <path d="M15.5 17.6q1.4 1 2.8 0M25.5 17.6q1.4 1 2.8 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M19.5 21.8q2.5-1.6 5 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* a single tear and falling drops */}
      <path d="M14.8 19.8q1 2.2 0 3.2q-1-1-0-3.2Z" fill="#8FB0D8" />
      <path d="M14 30Q15.4 33.4 14 35.4Q12.6 33.4 14 30Z" fill="#8FB0D8" />
      <path d="M24 31Q25.4 34.4 24 36.4Q22.6 34.4 24 31Z" fill="#8FB0D8" />
      <path d="M33 30Q34.4 33.4 33 35.4Q31.6 33.4 33 30Z" fill="#8FB0D8" />
    </g>
  </svg>
);

/** Angry — a flame with scrunched brows and a puff of steam. */
export const AngryMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradAngry" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F7B49A" />
        <stop offset="1" stopColor="#CC6B53" />
      </linearGradient>
      <ShadowDefs id="shadow-angry" />
    </defs>
    <g filter="url(#shadow-angry)">
      {/* steam puffs */}
      <circle cx="8" cy="12" r="2.4" fill="#E6D5CC" />
      <circle cx="36" cy="10" r="2" fill="#E6D5CC" />
      <path
        d="M22 5C26 12 34 16 33 27C32.3 33.5 27.5 38 22 38C16.5 38 11 34 11 27C11 21 14.5 18.5 16.5 13C18.5 17 20 19 22 19C22 14 20 10 22 5Z"
        fill="url(#gradAngry)"
        {...EDGE}
      />
      {/* scrunched brows, gritted mouth */}
      <path d="M16.5 22.5l3.2 1.4M27.5 22.5l-3.2 1.4" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.8" cy="25.8" r="1.2" fill={INK} />
      <circle cx="26.2" cy="25.8" r="1.2" fill={INK} />
      <path d="M19.5 30.2h5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  </svg>
);

/** Anxious — a nervous little bunny: one ear up, one ear drooping, worried brows and a sweat drop. */
export const AnxiousMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradAnxious" cx="40%" cy="30%" r="75%">
        <stop offset="0" stopColor="#F4EDF8" />
        <stop offset="1" stopColor="#C6B3D6" />
      </radialGradient>
      <ShadowDefs id="shadow-anxious" />
    </defs>
    <g filter="url(#shadow-anxious)">
      {/* ears: left stands up, right flops over */}
      <ellipse cx="16.5" cy="11.5" rx="3.6" ry="8.5" fill="url(#gradAnxious)" transform="rotate(-10 16.5 11.5)" {...EDGE} />
      <ellipse cx="16.5" cy="11.5" rx="1.6" ry="5.5" fill="#E9B9C9" transform="rotate(-10 16.5 11.5)" />
      <ellipse cx="29" cy="15" rx="3.4" ry="7.5" fill="url(#gradAnxious)" transform="rotate(38 29 15)" {...EDGE} />
      <ellipse cx="29" cy="15" rx="1.5" ry="5" fill="#E9B9C9" transform="rotate(38 29 15)" />
      {/* head */}
      <ellipse cx="22" cy="29" rx="11" ry="10" fill="url(#gradAnxious)" {...EDGE} />
      {/* worried brows, dot eyes, wobbly mouth */}
      <path d="M15.5 25l2.6-1M25.9 24l2.6 1" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="17" cy="27.6" r="1.2" fill={INK} />
      <circle cx="27" cy="27.6" r="1.2" fill={INK} />
      <path d="M19.5 32.4q1.25-1 2.5 0t2.5 0" stroke={INK} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <Cheeks y={31} lx={13.5} rx={30.5} opacity={0.4} />
      {/* sweat drop */}
      <path d="M35.5 21Q37 23.8 35.5 25.6Q34 23.8 35.5 21Z" fill="#9FD3E6" />
    </g>
  </svg>
);

/** Tired — a sleepy crescent moon in a nightcap, with a drifting "z". */
export const TiredMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradTired" cx="30%" cy="30%" r="80%">
        <stop offset="0" stopColor="#E4DCF3" />
        <stop offset="1" stopColor="#A597C0" />
      </radialGradient>
      <ShadowDefs id="shadow-tired" />
    </defs>
    <g filter="url(#shadow-tired)">
      {/* nightcap */}
      <path d="M23 5.5q4.5 1 3.5 8.5" stroke="#E9C0C8" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="5" r="1.8" fill="#F6E4E8" {...EDGE} />
      {/* crescent moon */}
      <path d="M26 9A15 15 0 1 0 38 28A12 12 0 0 1 26 9Z" fill="url(#gradTired)" {...EDGE} />
      {/* closed, sleepy eyes */}
      <path d="M17 25.5q1.8 1.8 3.6 0M25 25.5q1.8 1.8 3.6 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M21 30.5q1.6 1 3.2 0" stroke={INK} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <Cheeks y={28} lx={14.5} rx={28.5} opacity={0.3} />
      {/* drifting z's */}
      <path d="M33 6h3.5l-3.5 3.5h3.5" stroke="#8E82A8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M38 13h2.6l-2.6 2.6h2.6" stroke="#8E82A8" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  </svg>
);
