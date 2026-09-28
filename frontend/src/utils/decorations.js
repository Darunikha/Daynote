import {
  PaperClipCharm,
  WashiTapeCharm,
  TornPaperCharm,
  TinyFlowerCharm,
  PressedFlowerCharm,
  HeartCharm,
  StarCharm,
  ButterflyCharm,
  PostageStampCharm,
  TinyTagCharm,
  NoteCharm,
  PressedLeafCharm,
  TinyBowCharm,
  DoodleCharm,
  DividerCharm,
  ChecklistCharm,
  PinCharm,
  PhotoCornerCharm,
} from '../components/Charms';

/**
 * Each charm sits just outside the card's own padding box — clipped to a
 * corner and mostly hanging above/below the edge — so it never overlaps the
 * title, date, or entry text underneath. `rotate` gives it the slightly
 * imperfect, hand-placed feel real washi tape or a pressed flower would have.
 * Sizes are deliberately generous — these are meant to read as physical
 * stickers/paper pieces stuck onto the page, not small UI glyphs.
 *
 * Keep `value` list in sync with backend/models/Journal.js DECORATIONS.
 */
export const DECORATIONS = [
  { value: 'none', label: 'None', Charm: null },
  {
    value: 'paper-clip',
    label: 'Paper Clip',
    Charm: PaperClipCharm,
    corner: 'top-left',
    width: 52,
    height: 70,
    rotate: -11,
    offset: { top: -28, left: 20 },
  },
  {
    value: 'washi-tape',
    label: 'Washi Tape',
    Charm: WashiTapeCharm,
    corner: 'top-right',
    width: 132,
    height: 50,
    rotate: 7,
    offset: { top: -22, right: -6 },
  },
  {
    value: 'torn-paper',
    label: 'Torn Paper',
    Charm: TornPaperCharm,
    corner: 'bottom-left',
    width: 90,
    height: 70,
    rotate: 8,
    offset: { bottom: -28, left: 6 },
  },
  {
    value: 'tiny-flower',
    label: 'Flower',
    Charm: TinyFlowerCharm,
    corner: 'bottom-right',
    width: 62,
    height: 62,
    rotate: -8,
    offset: { bottom: -26, right: 18 },
  },
  {
    value: 'pressed-flower',
    label: 'Pressed Flower',
    Charm: PressedFlowerCharm,
    corner: 'bottom-left',
    width: 58,
    height: 58,
    rotate: 14,
    offset: { bottom: -22, left: 22 },
  },
  {
    value: 'heart',
    label: 'Heart',
    Charm: HeartCharm,
    corner: 'top-right',
    width: 48,
    height: 42,
    rotate: 12,
    offset: { top: -18, right: 24 },
  },
  {
    value: 'star',
    label: 'Star',
    Charm: StarCharm,
    corner: 'top-left',
    width: 44,
    height: 44,
    rotate: -14,
    offset: { top: -18, left: 24 },
  },
  {
    value: 'butterfly',
    label: 'Butterfly',
    Charm: ButterflyCharm,
    corner: 'top-right',
    width: 72,
    height: 55,
    rotate: -7,
    offset: { top: -26, right: 10 },
  },
  {
    value: 'postage-stamp',
    label: 'Postage Stamp',
    Charm: PostageStampCharm,
    corner: 'top-right',
    width: 58,
    height: 68,
    rotate: 7,
    offset: { top: -30, right: 20 },
  },
  {
    value: 'tiny-tag',
    label: 'Handwritten Tag',
    Charm: TinyTagCharm,
    corner: 'top-left',
    width: 48,
    height: 65,
    rotate: -10,
    offset: { top: -26, left: 24 },
  },
  {
    value: 'note',
    label: 'Handwritten Note',
    Charm: NoteCharm,
    corner: 'bottom-right',
    width: 68,
    height: 68,
    rotate: 4,
    offset: { bottom: -29, right: 16 },
  },
  {
    value: 'pressed-leaf',
    label: 'Pressed Leaf',
    Charm: PressedLeafCharm,
    corner: 'bottom-left',
    width: 44,
    height: 72,
    rotate: -18,
    offset: { bottom: -30, left: 24 },
  },
  {
    value: 'tiny-bow',
    label: 'Ribbon Bow',
    Charm: TinyBowCharm,
    corner: 'top-left',
    width: 68,
    height: 49,
    rotate: 6,
    offset: { top: -20, left: 26 },
  },
  {
    value: 'doodle',
    label: 'Doodle',
    Charm: DoodleCharm,
    corner: 'bottom-right',
    width: 72,
    height: 41,
    rotate: -4,
    offset: { bottom: -16, right: 22 },
  },
  {
    value: 'divider',
    label: 'Hand-drawn Divider',
    Charm: DividerCharm,
    corner: 'bottom-left',
    width: 92,
    height: 24,
    rotate: 2,
    offset: { bottom: -10, left: 8 },
  },
  {
    value: 'checklist',
    label: 'Checklist',
    Charm: ChecklistCharm,
    corner: 'top-right',
    width: 54,
    height: 68,
    rotate: 5,
    offset: { top: -28, right: 18 },
  },
  {
    value: 'pin',
    label: 'Push Pin',
    Charm: PinCharm,
    corner: 'top-right',
    width: 38,
    height: 45,
    rotate: 0,
    offset: { top: -14, right: 26 },
  },
  {
    value: 'photo-corner',
    label: 'Photo Corner',
    Charm: PhotoCornerCharm,
    corner: 'top-left',
    width: 44,
    height: 44,
    rotate: 0,
    offset: { top: 3, left: 3 },
  },
];

/** How many charms a single entry can wear at once, so a card stays readable. */
export const MAX_DECORATIONS = 6;

export const DECORATION_VALUES = DECORATIONS.map((d) => d.value);

const DECORATION_MAP = Object.fromEntries(DECORATIONS.map((d) => [d.value, d]));

export const getDecoration = (value) => DECORATION_MAP[value] || DECORATION_MAP.none;

// ---------------------------------------------------------------------------
// Freeform placement — a charm no longer has to sit in its default corner.
// Adding one still starts it near the corner it always used to hang from
// (so the page doesn't jump), but from there it can be dragged anywhere.
// ---------------------------------------------------------------------------

const CORNER_SPOTS = {
  'top-left': { x: 12, y: 8 },
  'top-right': { x: 88, y: 8 },
  'bottom-left': { x: 12, y: 90 },
  'bottom-right': { x: 88, y: 90 },
};
// Nudges applied when more than one charm starts in the same corner, so a
// freshly added charm doesn't land exactly on top of one already there.
const CORNER_JITTER = [0, 8, -8, 14, -14, 5];

/** A sensible starting spot for a newly added charm, based on its old fixed corner. */
export const defaultDecorationSpot = (type, index = 0) => {
  const meta = getDecoration(type);
  const base = CORNER_SPOTS[meta.corner] || { x: 50, y: 50 };
  const jitter = CORNER_JITTER[index % CORNER_JITTER.length];
  return {
    x: Math.min(94, Math.max(6, base.x + (meta.corner?.endsWith('left') ? jitter : -jitter))),
    y: Math.min(94, Math.max(6, base.y)),
  };
};

let placementCounter = 0;
const nextPlacementId = () => {
  placementCounter += 1;
  return `charm-${Date.now()}-${placementCounter}`;
};

/** A freshly added, freely-movable charm — starts near its usual corner. */
export const createDecorationPlacement = (type, index = 0) => {
  const meta = getDecoration(type);
  const spot = defaultDecorationSpot(type, index);
  return { id: nextPlacementId(), type, x: spot.x, y: spot.y, rotation: meta.rotate ?? 0 };
};
