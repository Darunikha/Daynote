import { FONTS } from './entryStyle';

/**
 * Freeform, editable sticky notes a user can drop anywhere on the journal
 * page — distinct from the corner-fixed decoration charms. Each design is a
 * different bit of scrapbook stationery (grid paper, a cloud-shaped note, a
 * washi-taped note…), not a plain rectangle.
 *
 * Keep in sync with backend/models/Journal.js.
 */
export const STICKY_NOTE_DESIGNS = [
  { value: 'pastel', label: 'Pastel' },
  { value: 'floral', label: 'Floral' },
  { value: 'grid', label: 'Grid' },
  { value: 'lined', label: 'Lined' },
  { value: 'scalloped', label: 'Scalloped' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'heart', label: 'Heart' },
  { value: 'animal', label: 'Animal' },
  { value: 'taped', label: 'Taped' },
];

export const STICKY_NOTE_FONTS = FONTS;

export const STICKY_NOTE_SIZES = [
  { value: 'sm', label: 'S', px: 12 },
  { value: 'md', label: 'M', px: 14 },
  { value: 'lg', label: 'L', px: 17 },
];

export const STICKY_NOTE_ALIGN = ['left', 'center', 'right'];

/** Soft pastel palette a plain "pastel" note cycles through. */
export const PASTEL_COLORS = ['#FBEAEE', '#FFF3D9', '#E8F0E3', '#E6EEF6', '#F3E9F6', '#FDEFE3'];

export const MAX_STICKY_NOTES = 10;

/** Paper background per design — a swatch of real stationery, not a flat card. */
export const getNoteBackgroundStyle = (design, color) => {
  switch (design) {
    case 'grid':
      return {
        backgroundColor: '#FBF8F0',
        backgroundImage:
          'linear-gradient(rgba(180,160,120,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(180,160,120,0.18) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      };
    case 'lined':
      return {
        backgroundColor: '#FAF7F0',
        backgroundImage: 'linear-gradient(rgba(150,130,110,0.22) 1px, transparent 1px)',
        backgroundSize: '100% 20px',
      };
    case 'floral':
      return {
        backgroundColor: '#FCF4F3',
        backgroundImage:
          'radial-gradient(rgba(219,169,179,0.28) 1.6px, transparent 1.6px)',
        backgroundSize: '16px 16px',
      };
    case 'scalloped':
      return {
        backgroundColor: '#FBEFEF',
        backgroundImage: 'radial-gradient(rgba(219,169,179,0.24) 1.4px, transparent 1.4px)',
        backgroundSize: '14px 14px',
      };
    case 'cloud':
      return { backgroundColor: '#EAF1FA' };
    case 'heart':
      return { backgroundColor: '#FBE7EC' };
    case 'animal':
      return { backgroundColor: '#F5EFE1' };
    case 'taped':
      return { backgroundColor: '#FBF7EF' };
    case 'pastel':
    default:
      return {
        backgroundColor: color || PASTEL_COLORS[0],
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.55) 50%, transparent 50%), linear-gradient(90deg, rgba(255,255,255,0.55) 50%, transparent 50%)',
        backgroundSize: '16px 16px',
        backgroundBlendMode: 'multiply',
      };
  }
};

/**
 * Builds a die-cut "pinking shears" outline for a w x h rectangle: every edge
 * is subdivided into equal bumps that bow outward, using relative quadratic
 * beziers so the direction of each bump (up/right/down/left) is explicit
 * rather than relying on SVG arc sweep-flag guesswork.
 */
const buildScallopPath = (w, h, segment = Math.max(8, Math.min(w, h) / 7)) => {
  const nx = Math.max(2, Math.round(w / segment));
  const ny = Math.max(2, Math.round(h / segment));
  const dx = w / nx;
  const dy = h / ny;
  // Bumps notch inward (toward the box interior) since the element's own
  // paint stops exactly at its edge — an outward-bulging control point would
  // land outside anything the browser has drawn and simply be invisible.
  let d = 'M0 0 ';
  for (let i = 0; i < nx; i += 1) d += `q ${dx / 2} ${dy / 2} ${dx} 0 `;
  for (let i = 0; i < ny; i += 1) d += `q ${-dx / 2} ${dy / 2} 0 ${dy} `;
  for (let i = 0; i < nx; i += 1) d += `q ${-dx / 2} ${-dy / 2} ${-dx} 0 `;
  for (let i = 0; i < ny; i += 1) d += `q ${dx / 2} ${-dy / 2} 0 ${-dy} `;
  return `${d}Z`;
};

/** A full circle as a relative-arc path fragment, always wound the same way so overlapping circles union cleanly under the default nonzero fill rule. */
const circleFragment = (cx, cy, r) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 `;

/** A fluffy cloud/sheep silhouette built from a cluster of overlapping circles, scaled to fit a w x h box (drawn at a 172 x 152 reference size). */
const buildCloudPath = (w, h) => {
  const sx = w / 172;
  const sy = h / 152;
  const s = Math.min(sx, sy);
  return [
    [40, 92, 40],
    [86, 74, 50],
    [132, 92, 40],
    [62, 112, 38],
    [110, 112, 38],
  ]
    .map(([cx, cy, r]) => circleFragment(cx * sx, cy * sy, r * s))
    .join('');
};

/** Silhouette per design — irregular, hand-cut edges rather than a plain rectangle. */
export const getNoteShapeStyle = (design, w = 172, h = 152) => {
  if (design === 'cloud') return { clipPath: `path("${buildCloudPath(w, h)}")` };
  if (design === 'scalloped') return { clipPath: `path("${buildScallopPath(w, h)}")` };
  if (design === 'heart') {
    return {
      clipPath:
        'path("M84 150C20 105 0 70 0 42 0 16 20 0 42 0 60 0 76 10 84 26 92 10 108 0 126 0 148 0 168 16 168 42 168 70 148 105 84 150Z")',
    };
  }
  return { borderRadius: '9px 16px 11px 18px' };
};

let counter = 0;
const nextId = () => {
  counter += 1;
  return `note-${Date.now()}-${counter}`;
};

/**
 * Well-spaced starting spots, biased toward the margins and lower half of
 * the page so a freshly added note doesn't land on top of the title or
 * date row, and doesn't pile onto other notes either.
 */
const PLACEMENTS = [
  { x: 86, y: 34 },
  { x: 14, y: 36 },
  { x: 88, y: 68 },
  { x: 12, y: 70 },
  { x: 50, y: 88 },
  { x: 70, y: 88 },
  { x: 30, y: 88 },
  { x: 90, y: 50 },
  { x: 10, y: 52 },
  { x: 50, y: 30 },
];

/** A freshly placed note — a little off-center and gently tilted, never perfectly straight. */
export const createStickyNote = (design = 'pastel', index = 0) => {
  const spot = PLACEMENTS[index % PLACEMENTS.length];
  return {
    id: nextId(),
    design,
    color: design === 'pastel' ? PASTEL_COLORS[index % PASTEL_COLORS.length] : '',
    text: '',
    x: spot.x,
    y: spot.y,
    rotation: Math.round((Math.random() - 0.5) * 12),
    font: 'handwritten',
    fontSize: 'md',
    align: 'left',
  };
};
