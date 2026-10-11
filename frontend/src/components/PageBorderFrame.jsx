import { getPageBorder } from '../utils/pageBorders';

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

/**
 * One corner motif per style, anchored to the top-left (0,0) corner with
 * its linework trailing ~40px along both edges so it blends into the tiled
 * edge strip. The other three corners reuse the same artwork, flipped with
 * a CSS transform — cheaper than drawing four corners, and symmetric
 * designs like these flip cleanly.
 */
const CORNERS = {
  'ribbon-bow': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="46" height="46" fill="none">
      <path d="M2 40Q2 10 40 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />
      <path
        d="M11 9c-2-3 1-6 4-4c1-3 5-2 4 1c3-1 4 3 1 4c2 2 0 5-3 4c0 3-4 3-4 0c-3 1-5-2-3-4c-2-1-1-4 1-1Z"
        fill={`${color}33`}
        stroke={color}
        strokeWidth="1.3"
      />
      <circle cx="11.5" cy="8.5" r="1.3" fill={color} />
      <path d="M8 13q-4 2-3 7M14 13q4 2 3 7" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  ),
  'scalloped-lace': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="44" height="44" fill="none">
      <path d="M2 40Q2 2 40 2" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M4 20Q4 12 12 12Q12 4 20 4" stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="4" cy="20" r="1.6" fill={color} />
      <circle cx="12" cy="12" r="1.6" fill={color} />
      <circle cx="20" cy="4" r="1.6" fill={color} />
      <path d="M6 27q7-7 14 0M13 6q7-7 14 0" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  ),
  'floral-corner': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="46" height="46" fill="none">
      <path d="M2 40Q2 10 40 2" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
      <g>
        <ellipse cx="12" cy="8" rx="3.4" ry="2" fill={`${color}55`} stroke={color} strokeWidth="1" transform="rotate(0 12 8)" />
        <ellipse cx="12" cy="8" rx="3.4" ry="2" fill={`${color}55`} stroke={color} strokeWidth="1" transform="rotate(72 12 8)" />
        <ellipse cx="12" cy="8" rx="3.4" ry="2" fill={`${color}55`} stroke={color} strokeWidth="1" transform="rotate(144 12 8)" />
        <ellipse cx="12" cy="8" rx="3.4" ry="2" fill={`${color}55`} stroke={color} strokeWidth="1" transform="rotate(216 12 8)" />
        <ellipse cx="12" cy="8" rx="3.4" ry="2" fill={`${color}55`} stroke={color} strokeWidth="1" transform="rotate(288 12 8)" />
        <circle cx="12" cy="8" r="1.6" fill={color} />
      </g>
      <path d="M8 14q-5 1-6 7M18 10q5-1 7-6" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <ellipse cx="5" cy="19" rx="2.2" ry="1.2" fill={`${color}44`} stroke={color} strokeWidth="0.9" transform="rotate(-30 5 19)" />
      <ellipse cx="23" cy="6" rx="2.2" ry="1.2" fill={`${color}44`} stroke={color} strokeWidth="0.9" transform="rotate(30 23 6)" />
    </svg>
  ),
  'vintage-swirl': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="46" height="46" fill="none">
      <path d="M3 38Q3 20 16 17Q24 15 22 9Q20 4 14 6Q10 7.5 12 11" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="11" r="1.2" fill={color} />
      <path d="M16 17Q28 14 38 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  ),
  'ornamental-frame': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="42" height="42" fill="none">
      <path d="M4 40Q4 4 40 4" stroke={color} strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M2 34Q2 2 34 2" stroke={color} strokeWidth="1" fill="none" opacity="0.55" />
      <rect x="8.5" y="8.5" width="7" height="7" fill={`${color}33`} stroke={color} strokeWidth="1.2" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="1.3" fill={color} />
    </svg>
  ),
  'rose-vine': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="46" height="46" fill="none">
      <path d="M3 40Q3 12 38 4" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.65" />
      <g transform="translate(10 10)">
        <circle r="3.4" fill={`${color}55`} stroke={color} strokeWidth="1" />
        <path d="M0 -3.4A3.4 3.4 0 0 1 3 -1.5" stroke={color} strokeWidth="1" fill="none" />
        <path d="M-2 2.5A3.4 3.4 0 0 1 -3.4 0" stroke={color} strokeWidth="1" fill="none" />
      </g>
      <path d="M7 14q-5 0-6 6M14 6q0-5 6-6" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

/**
 * A small tileable motif per style, repeated along an edge as a CSS
 * background-image. Horizontal and vertical versions are drawn separately
 * (not one rotated via CSS) so the wave direction always reads as "running
 * along the edge" on every side.
 */
const EDGE_TILES_H = {
  'ribbon-bow': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='16'><path d='M1 8q3-6 6 0t6 0t6 0t6 0' stroke='${color}' stroke-width='1.3' fill='none' stroke-linecap='round'/><circle cx='14' cy='8' r='1.1' fill='${color}'/></svg>`,
  'scalloped-lace': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='18' height='12'><path d='M0 10Q4.5 1 9 10Q13.5 1 18 10' stroke='${color}' stroke-width='1.2' fill='none'/></svg>`,
  'floral-corner': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='26' height='16'><path d='M1 13Q7 3 13 13Q19 3 25 13' stroke='${color}' stroke-width='1.1' fill='none'/><ellipse cx='7' cy='8' rx='2' ry='1.1' fill='${color}' opacity='.8' transform='rotate(-30 7 8)'/><ellipse cx='19' cy='8' rx='2' ry='1.1' fill='${color}' opacity='.8' transform='rotate(30 19 8)'/></svg>`,
  'vintage-swirl': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='14'><path d='M0 7Q6 0 12 7T24 7' stroke='${color}' stroke-width='1.2' fill='none'/></svg>`,
  'ornamental-frame': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='12'><line x1='0' y1='3.5' x2='22' y2='3.5' stroke='${color}' stroke-width='0.9'/><line x1='0' y1='8.5' x2='22' y2='8.5' stroke='${color}' stroke-width='0.9'/><rect x='9' y='4' width='4' height='4' fill='${color}' transform='rotate(45 11 6)'/></svg>`,
  'rose-vine': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='14'><path d='M0 11Q6 2 12 11T24 11' stroke='${color}' stroke-width='1.2' fill='none'/><circle cx='12' cy='6.5' r='1.5' fill='${color}'/></svg>`,
};

/** Same motifs, running top-to-bottom instead of left-to-right. */
const EDGE_TILES_V = {
  'ribbon-bow': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='28'><path d='M8 1q-6 3 0 6t0 6t0 6t0 6' stroke='${color}' stroke-width='1.3' fill='none' stroke-linecap='round'/><circle cx='8' cy='14' r='1.1' fill='${color}'/></svg>`,
  'scalloped-lace': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='18'><path d='M10 0Q1 4.5 10 9Q1 13.5 10 18' stroke='${color}' stroke-width='1.2' fill='none'/></svg>`,
  'floral-corner': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='26'><path d='M13 1Q3 7 13 13Q3 19 13 25' stroke='${color}' stroke-width='1.1' fill='none'/><ellipse cx='8' cy='7' rx='1.1' ry='2' fill='${color}' opacity='.8' transform='rotate(-30 8 7)'/><ellipse cx='8' cy='19' rx='1.1' ry='2' fill='${color}' opacity='.8' transform='rotate(30 8 19)'/></svg>`,
  'vintage-swirl': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='24'><path d='M7 0Q0 6 7 12T7 24' stroke='${color}' stroke-width='1.2' fill='none'/></svg>`,
  'ornamental-frame': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='22'><line x1='3.5' y1='0' x2='3.5' y2='22' stroke='${color}' stroke-width='0.9'/><line x1='8.5' y1='0' x2='8.5' y2='22' stroke='${color}' stroke-width='0.9'/><rect x='4' y='9' width='4' height='4' fill='${color}' transform='rotate(45 6 11)'/></svg>`,
  'rose-vine': (color) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='24'><path d='M11 0Q2 6 11 12T11 24' stroke='${color}' stroke-width='1.2' fill='none'/><circle cx='6.5' cy='12' r='1.5' fill='${color}'/></svg>`,
};

const tileUrl = (tiles, variant, color) => `url("data:image/svg+xml,${encodeURIComponent(tiles[variant](color))}")`;

/**
 * A decorative frame around the writing page: four corner ornaments (one
 * motif, flipped into each corner) plus a tiled line running between them
 * along all four edges. The middle stays completely empty — this never
 * overlaps the title, text, photos or sticky notes, only the outer ~40px
 * margin. Tiling (rather than stretching one big SVG) keeps the linework
 * crisp at any page size instead of warping on resize.
 */
export default function PageBorderFrame({ value }) {
  const meta = getPageBorder(value);
  if (!meta.color) return null;

  const Corner = CORNERS[value];
  if (!Corner) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      {/* edges — thin tiled strips between the corners */}
      <div
        className="absolute left-11 right-11 top-1.5 h-4"
        style={{ backgroundImage: tileUrl(EDGE_TILES_H, value, meta.color), backgroundRepeat: 'repeat-x', opacity: 0.85 }}
      />
      <div
        className="absolute left-11 right-11 bottom-1.5 h-4"
        style={{
          backgroundImage: tileUrl(EDGE_TILES_H, value, meta.color),
          backgroundRepeat: 'repeat-x',
          opacity: 0.85,
          transform: 'scaleY(-1)',
        }}
      />
      <div
        className="absolute top-11 bottom-11 left-1.5 w-4"
        style={{ backgroundImage: tileUrl(EDGE_TILES_V, value, meta.color), backgroundRepeat: 'repeat-y', opacity: 0.85 }}
      />
      <div
        className="absolute top-11 bottom-11 right-1.5 w-4"
        style={{
          backgroundImage: tileUrl(EDGE_TILES_V, value, meta.color),
          backgroundRepeat: 'repeat-y',
          opacity: 0.85,
          transform: 'scaleX(-1)',
        }}
      />

      {/* corners */}
      <span className="absolute left-1 top-1">{Corner(meta.color)}</span>
      <span className="absolute right-1 top-1" style={{ transform: 'scaleX(-1)' }}>
        {Corner(meta.color)}
      </span>
      <span className="absolute bottom-1 left-1" style={{ transform: 'scaleY(-1)' }}>
        {Corner(meta.color)}
      </span>
      <span className="absolute bottom-1 right-1" style={{ transform: 'scale(-1, -1)' }}>
        {Corner(meta.color)}
      </span>
    </div>
  );
}
