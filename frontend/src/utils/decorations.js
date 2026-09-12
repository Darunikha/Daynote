import {
  PaperClipCharm,
  WashiTapeCharm,
  TinyFlowerCharm,
  HeartCharm,
  StarCharm,
  ButterflyCharm,
  PostageStampCharm,
  TinyTagCharm,
  PressedLeafCharm,
  TinyBowCharm,
  DoodleCharm,
  PinCharm,
  PhotoCornerCharm,
} from '../components/Charms';

/**
 * Each charm sits just outside the card's own padding box — clipped to a
 * corner and mostly hanging above/below the edge — so it never overlaps the
 * title, date, or entry text underneath. `rotate` gives it the slightly
 * imperfect, hand-placed feel real washi tape or a pressed flower would have.
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
    width: 22,
    height: 30,
    rotate: -8,
    offset: { top: -10, left: 14 },
  },
  {
    value: 'washi-tape',
    label: 'Washi Tape',
    Charm: WashiTapeCharm,
    corner: 'top-right',
    width: 52,
    height: 21,
    rotate: 7,
    offset: { top: -9, right: 10 },
  },
  {
    value: 'tiny-flower',
    label: 'Tiny Flower',
    Charm: TinyFlowerCharm,
    corner: 'bottom-right',
    width: 26,
    height: 26,
    rotate: -6,
    offset: { bottom: -10, right: 12 },
  },
  {
    value: 'heart',
    label: 'Heart',
    Charm: HeartCharm,
    corner: 'top-right',
    width: 20,
    height: 18,
    rotate: 10,
    offset: { top: -8, right: 16 },
  },
  {
    value: 'star',
    label: 'Star',
    Charm: StarCharm,
    corner: 'top-left',
    width: 18,
    height: 18,
    rotate: -10,
    offset: { top: -8, left: 16 },
  },
  {
    value: 'butterfly',
    label: 'Butterfly',
    Charm: ButterflyCharm,
    corner: 'top-right',
    width: 32,
    height: 24,
    rotate: -6,
    offset: { top: -12, right: 10 },
  },
  {
    value: 'postage-stamp',
    label: 'Postage Stamp',
    Charm: PostageStampCharm,
    corner: 'top-right',
    width: 30,
    height: 34,
    rotate: 6,
    offset: { top: -14, right: 14 },
  },
  {
    value: 'tiny-tag',
    label: 'Tiny Tag',
    Charm: TinyTagCharm,
    corner: 'top-left',
    width: 22,
    height: 30,
    rotate: -9,
    offset: { top: -12, left: 16 },
  },
  {
    value: 'pressed-leaf',
    label: 'Pressed Leaf',
    Charm: PressedLeafCharm,
    corner: 'bottom-left',
    width: 20,
    height: 34,
    rotate: -16,
    offset: { bottom: -12, left: 14 },
  },
  {
    value: 'tiny-bow',
    label: 'Tiny Bow',
    Charm: TinyBowCharm,
    corner: 'top-left',
    width: 30,
    height: 21,
    rotate: 5,
    offset: { top: -8, left: 18 },
  },
  {
    value: 'doodle',
    label: 'Doodle',
    Charm: DoodleCharm,
    corner: 'bottom-right',
    width: 34,
    height: 22,
    rotate: -3,
    offset: { bottom: -8, right: 16 },
  },
  {
    value: 'pin',
    label: 'Pin',
    Charm: PinCharm,
    corner: 'top-right',
    width: 18,
    height: 18,
    rotate: 0,
    offset: { top: -6, right: 18 },
  },
  {
    value: 'photo-corner',
    label: 'Photo Corner',
    Charm: PhotoCornerCharm,
    corner: 'top-left',
    width: 24,
    height: 24,
    rotate: 0,
    offset: { top: 3, left: 3 },
  },
];

export const DECORATION_VALUES = DECORATIONS.map((d) => d.value);

const DECORATION_MAP = Object.fromEntries(DECORATIONS.map((d) => [d.value, d]));

export const getDecoration = (value) => DECORATION_MAP[value] || DECORATION_MAP.none;
