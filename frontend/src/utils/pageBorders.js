import ribbonLoop from '../assets/borders/ribbon-loop.png';
import ribbonWave from '../assets/borders/ribbon-wave.png';
import heartBow from '../assets/borders/heart-bow.png';
import classicBow from '../assets/borders/classic-bow.png';
import scallopedBow from '../assets/borders/scalloped-bow.png';
import curvedBow from '../assets/borders/curved-bow.png';

/**
 * Decorative page borders — real hand-drawn ribbon/bow frame artwork
 * (transparent PNGs) around the writing page itself, rendered via CSS
 * `border-image` (see components/PageBorderFrame.jsx) rather than
 * hand-coded SVG. `src` is a Vite-imported asset URL so it gets bundled
 * and hashed correctly in production; `slice` is the border-image-slice
 * percentage tuned per image so each one's corner bows land inside the
 * unstretched corner region instead of being cut or stretched.
 *
 * Keep the `value` list in sync with backend/models/Journal.js PAGE_BORDERS.
 */
export const PAGE_BORDERS = [
  { value: 'none', label: 'None / Plain' },
  { value: 'ribbon-loop', label: 'Ribbon Loop', src: ribbonLoop, slice: 34 },
  { value: 'ribbon-wave', label: 'Ribbon Wave', src: ribbonWave, slice: 30 },
  { value: 'heart-bow', label: 'Heart & Bow', src: heartBow, slice: 32 },
  { value: 'classic-bow', label: 'Classic Bow', src: classicBow, slice: 30 },
  { value: 'scalloped-bow', label: 'Scalloped Bow', src: scallopedBow, slice: 22 },
  { value: 'curved-bow', label: 'Curved Bow', src: curvedBow, slice: 28 },
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
