/**
 * Decorative page borders — delicate, hand-drawn-style frames around the
 * writing page itself (see components/PageBorderFrame.jsx for the SVG art).
 * The reference image was six ribbon-frame designs all in shades of red,
 * not one design per colour family, so every style here uses its own red
 * tone (crimson, rose, brick, wine, garnet, coral) rather than spreading
 * across the palette — distinguishable by shade and by design, all red.
 *
 * Keep the `value` list in sync with backend/models/Journal.js PAGE_BORDERS.
 */
export const PAGE_BORDERS = [
  { value: 'none', label: 'None / Plain' },
  { value: 'ribbon-bow', label: 'Ribbon & Bow', color: '#C0344A' },
  { value: 'scalloped-lace', label: 'Scalloped Lace', color: '#D9667A' },
  { value: 'floral-corner', label: 'Floral Corner', color: '#B23A4E' },
  { value: 'vintage-swirl', label: 'Vintage Swirl', color: '#8B3A3A' },
  { value: 'ornamental-frame', label: 'Ornamental Frame', color: '#A23B4A' },
  { value: 'rose-vine', label: 'Rose Vine', color: '#C0392B' },
];

export const PAGE_BORDER_VALUES = PAGE_BORDERS.map((b) => b.value);

const BORDER_MAP = Object.fromEntries(PAGE_BORDERS.map((b) => [b.value, b]));

export const getPageBorder = (value) => BORDER_MAP[value] || BORDER_MAP.none;

/**
 * A deterministic "today's border" — a pure function of the calendar date,
 * not randomness, so a new entry gets a border assigned automatically
 * without it ever changing on a reload of the same draft, and entries
 * written on the same day land on the same default. Only used once, when a
 * brand-new entry is first created; an existing entry always keeps whatever
 * border was saved with it.
 */
export const dailyPageBorder = (date = new Date()) => {
  const choices = PAGE_BORDERS.filter((b) => b.value !== 'none');
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / 86400000);
  return choices[dayOfYear % choices.length].value;
};
