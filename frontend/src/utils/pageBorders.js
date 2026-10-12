import ribbonLoop from '../assets/borders/ribbon-loop.png';
import ribbonWave from '../assets/borders/ribbon-wave.png';
import heartBow from '../assets/borders/heart-bow.png';
import classicBow from '../assets/borders/classic-bow.png';
import scallopedBow from '../assets/borders/scalloped-bow.png';
import curvedBow from '../assets/borders/curved-bow.png';

import ribbonLoopCorner from '../assets/borders/corners/ribbon-loop.png';
import ribbonWaveCorner from '../assets/borders/corners/ribbon-wave.png';
import heartBowCorner from '../assets/borders/corners/heart-bow.png';
import classicBowCorner from '../assets/borders/corners/classic-bow.png';
import scallopedBowCorner from '../assets/borders/corners/scalloped-bow.png';
import curvedBowCorner from '../assets/borders/corners/curved-bow.png';

/**
 * Decorative page borders — real hand-drawn ribbon/bow artwork around the
 * writing page. `corner` is a piece actually cropped from the source
 * illustration (the bow, drawn at a fixed size, never stretched); `src`
 * is the full original frame, used only for the picker's preview
 * thumbnail; `lineColor` is a shade sampled from the art, used for the
 * single procedural line connecting the corners (see
 * components/PageBorderFrame.jsx for why it isn't tiled from the photo).
 *
 * Keep the `value` list in sync with backend/models/Journal.js PAGE_BORDERS.
 */
export const PAGE_BORDERS = [
  { value: 'none', label: 'None / Plain' },
  { value: 'ribbon-loop', label: 'Ribbon Loop', src: ribbonLoop, corner: ribbonLoopCorner, lineColor: '#C0344A' },
  { value: 'ribbon-wave', label: 'Ribbon Wave', src: ribbonWave, corner: ribbonWaveCorner, lineColor: '#C23E52' },
  { value: 'heart-bow', label: 'Heart & Bow', src: heartBow, corner: heartBowCorner, lineColor: '#B23A4E' },
  { value: 'classic-bow', label: 'Classic Bow', src: classicBow, corner: classicBowCorner, lineColor: '#A23B4A' },
  { value: 'scalloped-bow', label: 'Scalloped Bow', src: scallopedBow, corner: scallopedBowCorner, lineColor: '#D9667A' },
  { value: 'curved-bow', label: 'Curved Bow', src: curvedBow, corner: curvedBowCorner, lineColor: '#C0392B' },
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
