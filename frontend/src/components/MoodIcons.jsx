/**
 * Illustrated mood stickers — one small hand-drawn object per mood, the way
 * a scrapbook sticker would be, rather than a face. Each mood is its own
 * thing (a sun, a sprout, a rain cloud…) so it reads at a glance even when
 * displayed small, and they share the same die-cut language as the
 * decoration charms: a thin cream edge plus a soft drop shadow, so each one
 * still feels placed on the page rather than printed flat onto it.
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

const ShadowDefs = ({ id }) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#5C4033" floodOpacity="0.3" />
  </filter>
);

const EDGE = { stroke: '#FFFBF7', strokeWidth: 1.4, style: { paintOrder: 'stroke' } };

/** A small four-point sparkle, centred on (x, y). */
const Sparkle = ({ x, y, size = 3, fill = '#F6D889' }) => (
  <path
    transform={`translate(${x} ${y}) scale(${size / 3})`}
    d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"
    fill={fill}
  />
);

/** Happy — a warm little sun with soft rays and a sparkle. */
export const HappyMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradHappy" cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#FCEBBE" />
        <stop offset="1" stopColor="#EDBD6A" />
      </radialGradient>
      <ShadowDefs id="shadow-happy" />
    </defs>
    <g filter="url(#shadow-happy)">
      <path
        d="M22 3v5M22 36v5M3 22h5M36 22h5M8.2 8.2l3.5 3.5M32.3 32.3l3.5 3.5M8.2 35.8l3.5-3.5M32.3 11.7l3.5-3.5"
        stroke="#E9B865"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="22" r="10.5" fill="url(#gradHappy)" {...EDGE} />
      <Sparkle x={36} y={8} size={4} />
    </g>
  </svg>
);

/** Calm — a small sprout in a pot, the kind of quiet thing you'd tape in. */
export const CalmMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradCalm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B9CBA8" />
        <stop offset="1" stopColor="#8A9A7B" />
      </linearGradient>
      <ShadowDefs id="shadow-calm" />
    </defs>
    <g filter="url(#shadow-calm)">
      <path d="M22 31V17" stroke="#7D8C6C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 19C18 19 13.5 16.5 13.5 11.5C18 11.5 22 14.5 22 19Z" fill="url(#gradCalm)" {...EDGE} />
      <path d="M22 17C23 12.5 26.5 9.5 31 9.5C30.5 14 27 17 22 17Z" fill="url(#gradCalm)" {...EDGE} />
      <path d="M13 31H31L29 39H15Z" fill="#E2B49A" {...EDGE} />
      <path d="M12 30.5H32V32.5H12Z" fill="#D39B80" {...EDGE} />
    </g>
  </svg>
);

/** Loved — a soft pink heart with a little highlight and sparkles. */
export const LovedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradLoved" cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor="#F8D3D8" />
        <stop offset="1" stopColor="#E09AA6" />
      </radialGradient>
      <ShadowDefs id="shadow-loved" />
    </defs>
    <g filter="url(#shadow-loved)">
      <path
        d="M22 36C10 28 6 22 6 16C6 10.5 10 7 15 7C18.5 7 21 9 22 11.5C23 9 25.5 7 29 7C34 7 38 10.5 38 16C38 22 34 28 22 36Z"
        fill="url(#gradLoved)"
        {...EDGE}
      />
      <path d="M11.5 14.5C12 12.5 13.5 11.5 15 11.5" stroke="#FFFBF7" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".8" />
      <Sparkle x={37} y={6} size={3.5} fill="#F3C9D0" />
      <Sparkle x={6} y={40} size={2.5} fill="#F3C9D0" />
    </g>
  </svg>
);

/** Excited — a peachy star with a couple of bright sparkles around it. */
export const ExcitedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradExcited" cx="40%" cy="35%" r="75%">
        <stop offset="0" stopColor="#F9CFB0" />
        <stop offset="1" stopColor="#E8A07E" />
      </radialGradient>
      <ShadowDefs id="shadow-excited" />
    </defs>
    <g filter="url(#shadow-excited)">
      <path
        d="M22 7L25.8 16.7L36.3 17.4L28.2 24L30.8 34.1L22 28.5L13.2 34.1L15.8 24L7.7 17.4L18.2 16.7Z"
        fill="url(#gradExcited)"
        {...EDGE}
        strokeLinejoin="round"
      />
      <Sparkle x={38} y={8} size={4} />
      <Sparkle x={6} y={9} size={3} />
      <Sparkle x={38} y={38} size={2.5} />
    </g>
  </svg>
);

/** Neutral — one plain, drifting cloud. Nothing dramatic, just there. */
export const NeutralMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradNeutral" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E4E9EF" />
        <stop offset="1" stopColor="#BFCAD6" />
      </linearGradient>
      <ShadowDefs id="shadow-neutral" />
    </defs>
    <g filter="url(#shadow-neutral)">
      <path
        d="M11 31C7.5 31 6 28 6.8 25.5C7.6 23 10.5 22.5 11.8 23.8C12.5 19.5 16 17 20 17.8C21.2 14.5 25.5 13.5 28.2 15.8C31 14.8 34 16.5 34.5 19.5C37.5 19.8 38.5 23.5 36.5 25.5C35.8 26.3 34.8 26.6 33.8 26.6V31Z"
        fill="url(#gradNeutral)"
        {...EDGE}
      />
      <path d="M14 27H30" stroke="#A9B6C4" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
    </g>
  </svg>
);

/** Sad — a little rain cloud with three soft drops falling from it. */
export const SadMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradSad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C4D2E6" />
        <stop offset="1" stopColor="#8FA8C8" />
      </linearGradient>
      <ShadowDefs id="shadow-sad" />
    </defs>
    <g filter="url(#shadow-sad)">
      <path
        d="M11 25C7.5 25 6 22 6.8 19.5C7.6 17 10.5 16.5 11.8 17.8C12.5 13.5 16 11 20 11.8C21.2 8.5 25.5 7.5 28.2 9.8C31 8.8 34 10.5 34.5 13.5C37.5 13.8 38.5 17.5 36.5 19.5C35.8 20.3 34.8 20.6 33.8 20.6H11Z"
        fill="url(#gradSad)"
        {...EDGE}
      />
      <path d="M13 30.5Q14.5 33.5 13 35.5Q11.5 33.5 13 30.5Z" fill="#8FA8C8" />
      <path d="M22 31.5Q23.5 34.5 22 36.5Q20.5 34.5 22 31.5Z" fill="#8FA8C8" />
      <path d="M31 30.5Q32.5 33.5 31 35.5Q29.5 33.5 31 30.5Z" fill="#8FA8C8" />
    </g>
  </svg>
);

/** Angry — a small flame with a bright inner flicker. Heat, not a face. */
export const AngryMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradAngry" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F0A58A" />
        <stop offset="1" stopColor="#C4664F" />
      </linearGradient>
      <ShadowDefs id="shadow-angry" />
    </defs>
    <g filter="url(#shadow-angry)">
      <path
        d="M22 5C26 12 34 16 33 27C32.3 33.5 27.5 38 22 38C16.5 38 11 34 11 27C11 21 14.5 18.5 16.5 13C18.5 17 20 19 22 19C22 14 20 10 22 5Z"
        fill="url(#gradAngry)"
        {...EDGE}
      />
      <path d="M22 30C20.5 27.5 18 26.5 18 23.5C20 24.5 21 25 22 26C23 25 24 24 25 22C25.5 25 24 27.5 22 30Z" fill="#F8D89A" />
    </g>
  </svg>
);

/** Anxious — a curled, trembling leaf with little shiver lines beside it. */
export const AnxiousMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <linearGradient id="gradAnxious" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#D8CCE6" />
        <stop offset="1" stopColor="#B0A0C4" />
      </linearGradient>
      <ShadowDefs id="shadow-anxious" />
    </defs>
    <g filter="url(#shadow-anxious)">
      <path
        d="M14 35C9.5 25 13 13.5 27 9.5C29.5 20 25.5 31 14 35Z"
        fill="url(#gradAnxious)"
        {...EDGE}
      />
      <path d="M14 35C18.5 27 22 19 27 9.5" stroke="#9887B0" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M33 15q1.5-1.6 3 0t3 0M34 22q1.5-1.6 3 0t3 0M33 29q1.5-1.6 3 0t3 0" stroke="#A796C2" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

/** Tired — a sleepy crescent moon with a small "z" drifting off it. */
export const TiredMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <defs>
      <radialGradient id="gradTired" cx="30%" cy="30%" r="80%">
        <stop offset="0" stopColor="#D7CEEA" />
        <stop offset="1" stopColor="#A196BA" />
      </radialGradient>
      <ShadowDefs id="shadow-tired" />
    </defs>
    <g filter="url(#shadow-tired)">
      <path d="M26 6A15 15 0 1 0 38 27A12 12 0 0 1 26 6Z" fill="url(#gradTired)" {...EDGE} />
      <path d="M31 8h4l-4 4h4" stroke="#8E82A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M37 14h3l-3 3h3" stroke="#8E82A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  </svg>
);
