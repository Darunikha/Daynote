/**
 * Round, soft-glow mood faces — a solid-colour circle per mood with a
 * blurred halo behind it, thin warm-ink outlines, and a face whose
 * expression (eyes, brows, mouth) is distinct per mood. Matches the
 * reference: kawaii round emoji faces, not illustrated objects.
 *
 * Keep the exported names stable — utils/moods.js maps each mood to its
 * component, and nothing else needs to change when the art changes.
 *
 * Purely decorative, so hidden from assistive technology — the visible
 * label text next to each one carries the meaning.
 */

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

const INK = '#4A3A33';

const HaloBlur = ({ id }) => (
  <filter id={id} x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="2.6" />
  </filter>
);

/** The glowing backdrop + solid face circle shared by every mood. */
const Face = ({ haloId, halo, fill, children }) => (
  <>
    <defs>
      <HaloBlur id={haloId} />
    </defs>
    <circle cx="22" cy="22" r="19" fill={halo} opacity="0.55" filter={`url(#${haloId})`} />
    <circle cx="22" cy="22" r="16" fill={fill} stroke={INK} strokeWidth="1.5" />
    {children}
  </>
);

const Blush = ({ lx = 12.5, rx = 31.5, y = 25, fill = '#EDA3AE', opacity = 0.55 }) => (
  <>
    <ellipse cx={lx} cy={y} rx="2.6" ry="1.8" fill={fill} opacity={opacity} />
    <ellipse cx={rx} cy={y} rx="2.6" ry="1.8" fill={fill} opacity={opacity} />
  </>
);

const Sparkle = ({ x, y, size = 2.6, fill = '#FFFFFF' }) => (
  <path
    transform={`translate(${x} ${y}) scale(${size / 3})`}
    d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"
    fill={fill}
    opacity="0.9"
  />
);

/** Happy — bright, sparkly eyes and a big open smile. */
export const HappyMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-happy" halo="#F3A6B0" fill="#F7C3CB">
      <circle cx="16" cy="20" r="2.6" fill={INK} />
      <circle cx="28" cy="20" r="2.6" fill={INK} />
      <Sparkle x={16.9} y={18.9} size={1.6} />
      <Sparkle x={28.9} y={18.9} size={1.6} />
      <path d="M16 26.5h12q-.4 5-6 5t-6-5Z" fill="#B5544A" stroke={INK} strokeWidth="1.2" />
      <path d="M18.3 29.5q3.7 1.8 7.4 0" stroke="#F4A2A2" strokeWidth="1" strokeLinecap="round" fill="none" />
      <Blush />
      <path d="M31 11.5q1.6-2.4 3.6-.4q1.6-2.4 0 0q1.8 2.4-.2 0q-1.8 2.4-3.4.4Z" fill="#F6E4E8" />
    </Face>
  </svg>
);

/** Calm — closed, content curved eyes and a soft little smile. */
export const CalmMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-calm" halo="#B9CBA0" fill="#DCE7C4">
      <path d="M13.5 19.5q2.5 2.2 5 0M25.5 19.5q2.5 2.2 5 0" stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M17 26.5q5 3.6 10 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <Blush />
    </Face>
  </svg>
);

/** Loved — sparkly heart-struck eyes and a tiny heart. */
export const LovedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-loved" halo="#E8899C" fill="#F7CBD4">
      <path d="M13.2 20.2c0-1.6 1.3-2.4 2.3-1.7c1-.7 2.3.1 2.3 1.7c0 1.3-2.3 3-2.3 3s-2.3-1.7-2.3-3Z" fill={INK} />
      <path d="M25.2 20.2c0-1.6 1.3-2.4 2.3-1.7c1-.7 2.3.1 2.3 1.7c0 1.3-2.3 3-2.3 3s-2.3-1.7-2.3-3Z" fill={INK} />
      <path d="M17 27q5 3 10 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <Blush />
      <path
        d="M34 9c0-1.8 1.5-2.7 2.6-1.9c1.1-.8 2.6.1 2.6 1.9c0 1.5-2.6 3.4-2.6 3.4s-2.6-1.9-2.6-3.4Z"
        fill="#E8899C"
        stroke={INK}
        strokeWidth="1"
      />
    </Face>
  </svg>
);

/** Excited — star-sparkle eyes and a wide open grin, with confetti dots. */
export const ExcitedMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-excited" halo="#EDA978" fill="#FBD9AE">
      <Sparkle x={16} y={19.5} size={4.5} fill={INK} />
      <Sparkle x={28} y={19.5} size={4.5} fill={INK} />
      <path d="M16 25.5h12q-.5 5-6 5t-6-5Z" fill="#B5544A" stroke={INK} strokeWidth="1.2" />
      <path d="M18.3 28.5q3.7 1.8 7.4 0" stroke="#F4A2A2" strokeWidth="1" strokeLinecap="round" fill="none" />
      <Blush opacity={0.4} />
      <circle cx="9" cy="10" r="1.3" fill="#F6D889" />
      <circle cx="35" cy="9" r="1.1" fill="#EDA3AE" />
      <Sparkle x={36} y={16} size={2.2} fill="#F6D889" />
    </Face>
  </svg>
);

/** Neutral — simple dot eyes, a flat mouth, nothing dramatic. */
export const NeutralMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-neutral" halo="#C2BAAE" fill="#E8E2D7">
      <circle cx="16" cy="21" r="1.7" fill={INK} />
      <circle cx="28" cy="21" r="1.7" fill={INK} />
      <path d="M17 27.5h10" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <Blush opacity={0.3} />
    </Face>
  </svg>
);

/** Sad — droopy eyes, a falling tear, a downturned mouth. */
export const SadMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-sad" halo="#8FAFD4" fill="#CBDCEE">
      <path d="M13.5 20.5q2.5-1.6 5 0M25.5 20.5q2.5-1.6 5 0" stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="22.5" r="1.4" fill={INK} />
      <circle cx="28" cy="22.5" r="1.4" fill={INK} />
      <path d="M17 29.5q5-3 10 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M14.5 25Q16.3 28.4 14.5 30.4Q12.7 28.4 14.5 25Z" fill="#8FAFD4" stroke={INK} strokeWidth="1" />
      <Blush opacity={0.3} />
    </Face>
  </svg>
);

/** Angry — sharp slanted brows and a gritted-teeth mouth. */
export const AngryMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-angry" halo="#D9794F" fill="#F0B591">
      <path d="M13 19.5l5 2M31 19.5l-5 2" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="24" r="1.6" fill={INK} />
      <circle cx="27.5" cy="24" r="1.6" fill={INK} />
      <path d="M16 29h12v3.4H16Z" fill="#FFFBF7" stroke={INK} strokeWidth="1.2" />
      <path d="M19.5 29v3.4M22 29v3.4M24.5 29v3.4" stroke={INK} strokeWidth="1" />
      <Blush fill="#E07A5F" opacity={0.6} />
    </Face>
  </svg>
);

/** Anxious — small worried eyes, a flat wavering mouth, a single sweat drop. */
export const AnxiousMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-anxious" halo="#8FC2B8" fill="#CDE6DF">
      <path d="M13.5 19l3.5 1.6M30.5 19l-3.5 1.6" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16.5" cy="22.5" r="1.5" fill={INK} />
      <circle cx="27.5" cy="22.5" r="1.5" fill={INK} />
      <path d="M17 28.5q1.5-1.2 3 0t3 0t3 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M31 13Q32.6 16.4 31 18.4Q29.4 16.4 31 13Z" fill="#8FC2B8" stroke={INK} strokeWidth="1" />
      <Blush opacity={0.35} />
    </Face>
  </svg>
);

/** Tired — sleepy half-closed eyes, a little pucker mouth, drifting z's. */
export const TiredMoodIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" className={className}>
    <Face haloId="halo-tired" halo="#A692C4" fill="#DED2EE">
      <path d="M13.5 21q2.5-2.6 5 0v1.2q-2.5 1-5 0Z" fill={INK} />
      <path d="M25.5 21q2.5-2.6 5 0v1.2q-2.5 1-5 0Z" fill={INK} />
      <path d="M20.3 28.2q1.7 1.2 3.4 0q-1.7.6-3.4 0Z" fill="#B5544A" stroke={INK} strokeWidth="1" />
      <Blush opacity={0.4} />
      <path d="M31 8h3.2l-3.2 3.2h3.2" stroke="#8E7CAE" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M35.5 14h2.4l-2.4 2.4h2.4" stroke="#8E7CAE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Face>
  </svg>
);
