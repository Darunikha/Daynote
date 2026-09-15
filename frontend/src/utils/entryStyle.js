/**
 * Whole-entry customization: font, layout, photo frame, heading treatment
 * and divider. Each is a single choice for the entry (not per-character
 * rich text), so a personalised page stays as simple to build as picking a
 * paper style — no drag-and-drop, no canvas, just a few tasteful presets.
 *
 * Keep in sync with backend/models/Journal.js.
 */

export const FONTS = [
  { value: 'clean', label: 'Clean', className: 'font-sans' },
  { value: 'serif', label: 'Elegant Serif', className: 'font-serif' },
  { value: 'handwritten', label: 'Handwritten', className: 'font-hand' },
  { value: 'typewriter', label: 'Typewriter', className: 'font-typewriter' },
];

export const LAYOUTS = [
  { value: 'classic', label: 'Classic Journal', description: 'Title, then your words.' },
  { value: 'scrapbook', label: 'Scrapbook', description: 'Photo tucked beside the text.' },
  { value: 'photo-focused', label: 'Photo Focused', description: 'A big photo leads the page.' },
  { value: 'minimal', label: 'Simple', description: 'Just the writing, nothing else.' },
];

export const PHOTO_STYLES = [
  { value: 'plain', label: 'Simple' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'taped', label: 'Taped' },
  { value: 'framed', label: 'Framed' },
];

export const HEADING_STYLES = [
  { value: 'classic', label: 'Classic' },
  { value: 'handwritten', label: 'Handwritten' },
  { value: 'boxed', label: 'Highlighted' },
  { value: 'underline', label: 'Underlined' },
];

export const DIVIDERS = [
  { value: 'none', label: 'None' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'floral', label: 'Floral' },
  { value: 'scallop', label: 'Scallop' },
];

const mapOf = (list) => Object.fromEntries(list.map((o) => [o.value, o]));
const FONT_MAP = mapOf(FONTS);
const LAYOUT_MAP = mapOf(LAYOUTS);
const PHOTO_STYLE_MAP = mapOf(PHOTO_STYLES);
const HEADING_STYLE_MAP = mapOf(HEADING_STYLES);
const DIVIDER_MAP = mapOf(DIVIDERS);

export const getFont = (value) => FONT_MAP[value] || FONT_MAP.clean;
export const getLayout = (value) => LAYOUT_MAP[value] || LAYOUT_MAP.classic;
export const getPhotoStyle = (value) => PHOTO_STYLE_MAP[value] || PHOTO_STYLE_MAP.plain;
export const getHeadingStyle = (value) => HEADING_STYLE_MAP[value] || HEADING_STYLE_MAP.classic;
export const getDividerStyle = (value) => DIVIDER_MAP[value] || DIVIDER_MAP.none;
