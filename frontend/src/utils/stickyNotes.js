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
      return { backgroundColor: '#FCF4F3' };
    case 'scalloped':
      return { backgroundColor: '#FBEFEF' };
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
      return { backgroundColor: color || PASTEL_COLORS[0] };
  }
};

/** Silhouette per design — irregular, hand-cut edges rather than a plain rectangle. */
export const getNoteShapeStyle = (design) => {
  if (design === 'cloud') return { borderRadius: '46% 54% 62% 38% / 55% 42% 58% 45%' };
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
