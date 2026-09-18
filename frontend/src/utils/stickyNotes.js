import { FONTS } from './entryStyle';

/**
 * Freeform, editable sticky notes a user can drop anywhere on the journal
 * page — distinct from the corner-fixed decoration charms. Each design is a
 * distinct bit of illustrated scrapbook stationery — its own paper texture,
 * its own silhouette, and its own little cluster of charms — not a plain
 * tinted rectangle.
 *
 * Keep the `value`s in sync with backend/models/Journal.js.
 */
export const STICKY_NOTE_DESIGNS = [
  { value: 'scallop-floral', label: 'Floral Scallop' },
  { value: 'taped-note', label: 'Washi Note' },
  { value: 'gingham-mint', label: 'Mint Gingham' },
  { value: 'heart-floral', label: 'Floral Heart' },
  { value: 'gingham-lavender', label: 'Lavender Gingham' },
  { value: 'bear', label: 'Teddy Bear' },
  { value: 'lined-floral', label: 'Lined Floral' },
  { value: 'penguin', label: 'Penguin' },
  { value: 'heart-bouquet', label: 'Heart Bouquet' },
  { value: 'dotted-lavender', label: 'Dotted Lavender' },
  { value: 'grid-floral', label: 'Grid Floral' },
  { value: 'night-dot', label: 'Starry Night' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'gingham-bow', label: 'Bow Gingham' },
  { value: 'lined-star', label: 'Starry Lined' },
  { value: 'scallop-tulip', label: 'Tulip Scallop' },
];

export const STICKY_NOTE_FONTS = FONTS;

export const STICKY_NOTE_SIZES = [
  { value: 'sm', label: 'S', px: 12 },
  { value: 'md', label: 'M', px: 14 },
  { value: 'lg', label: 'L', px: 17 },
];

export const STICKY_NOTE_ALIGN = ['left', 'center', 'right'];

export const MAX_STICKY_NOTES = 10;

/** Text/ink color that reads well on a given design's background. */
export const getNoteInkColor = (design) => (design === 'night-dot' || design === 'penguin' ? '#F3EFE8' : '#4A3830');

// ---------------------------------------------------------------------------
// Paper textures — small tiling patterns layered onto a base color so each
// design reads as a real swatch of stationery instead of a flat tint.
// ---------------------------------------------------------------------------

const plain = (color) => ({ backgroundColor: color });

const gingham = (color) => ({
  backgroundColor: color,
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.55) 50%, transparent 50%), linear-gradient(90deg, rgba(255,255,255,0.55) 50%, transparent 50%)',
  backgroundSize: '15px 15px',
  backgroundBlendMode: 'multiply',
});

const dots = (color, dotColor) => ({
  backgroundColor: color,
  backgroundImage: `radial-gradient(${dotColor} 1.6px, transparent 1.6px)`,
  backgroundSize: '15px 15px',
});

const lines = (color, lineColor = 'rgba(150,130,110,0.22)') => ({
  backgroundColor: color,
  backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px)`,
  backgroundSize: '100% 20px',
});

const grid = (color) => ({
  backgroundColor: color,
  backgroundImage:
    'linear-gradient(rgba(180,160,120,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(180,160,120,0.18) 1px, transparent 1px)',
  backgroundSize: '14px 14px',
});

// ---------------------------------------------------------------------------
// Silhouettes — clip-path builders shared across designs that need a die-cut
// edge rather than a plain rounded rectangle.
// ---------------------------------------------------------------------------

/**
 * A "pinking shears" outline for a w x h box: every edge is subdivided into
 * equal bumps that notch inward, using relative quadratic beziers so the
 * direction of each bump is explicit rather than left to arc sweep-flags.
 * Bumps notch inward (not outward) because the element's own paint stops
 * exactly at its box edge — an outward control point lands on nothing.
 */
const buildScallopPath = (w, h, segment = Math.max(8, Math.min(w, h) / 7)) => {
  const nx = Math.max(2, Math.round(w / segment));
  const ny = Math.max(2, Math.round(h / segment));
  const dx = w / nx;
  const dy = h / ny;
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

const HEART_PATH =
  'path("M84 150C20 105 0 70 0 42 0 16 20 0 42 0 60 0 76 10 84 26 92 10 108 0 126 0 148 0 168 16 168 42 168 70 148 105 84 150Z")';

/** Silhouette per design — irregular, hand-cut edges rather than a plain rectangle. */
export const getNoteShapeStyle = (design, w = 172, h = 152) => {
  if (design === 'cloud') return { clipPath: `path("${buildCloudPath(w, h)}")` };
  if (design === 'scallop-floral' || design === 'scallop-tulip' || design === 'night-dot') {
    return { clipPath: `path("${buildScallopPath(w, h)}")` };
  }
  if (design === 'heart-floral' || design === 'heart-bouquet') return { clipPath: HEART_PATH };
  if (design === 'penguin') return { borderRadius: '50% 50% 46% 46% / 58% 58% 42% 42%' };
  return { borderRadius: '9px 16px 11px 18px' };
};

/** Whether a design's charm accents are allowed to spill past the note's own box (ears, paws) rather than being clipped to it. */
export const noteOverflowsBox = (design) => design === 'bear';

/** Paper background per design — a swatch of real stationery, not a flat card. */
export const getNoteBackgroundStyle = (design) => {
  switch (design) {
    case 'scallop-floral':
      return dots('#FBEAF0', 'rgba(214,137,159,0.28)');
    case 'taped-note':
      return plain('#FBF7EF');
    case 'gingham-mint':
      return gingham('#DCEEDD');
    case 'heart-floral':
      return plain('#FBE1E8');
    case 'gingham-lavender':
      return gingham('#EDE6F5');
    case 'bear':
      return plain('#E8CFAE');
    case 'lined-floral':
      return lines('#FAF7F0');
    case 'penguin':
      return plain('#494B52');
    case 'heart-bouquet':
      return plain('#FCE4EC');
    case 'dotted-lavender':
      return dots('#EFE7F6', 'rgba(160,130,190,0.24)');
    case 'grid-floral':
      return grid('#FBF8F0');
    case 'night-dot':
      return dots('#33333C', 'rgba(255,255,255,0.55)');
    case 'cloud':
      return plain('#E7F1FA');
    case 'gingham-bow':
      return gingham('#D9EEDD');
    case 'lined-star':
      return lines('#FAF7F0');
    case 'scallop-tulip':
      return plain('#DCE8D2');
    default:
      return plain('#FBEAEE');
  }
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
export const createStickyNote = (design = 'scallop-floral', index = 0) => {
  const spot = PLACEMENTS[index % PLACEMENTS.length];
  return {
    id: nextId(),
    design,
    color: '',
    text: '',
    x: spot.x,
    y: spot.y,
    rotation: Math.round((Math.random() - 0.5) * 12),
    font: 'handwritten',
    fontSize: 'md',
    align: 'left',
  };
};
