import { getPageBorder } from '../utils/pageBorders';

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

/**
 * One corner motif per style, anchored to the top-left (0,0) corner with
 * its ribbon tails trailing along both edges so they meet the ribbon line
 * running between corners. The other three corners reuse the same
 * artwork, flipped with a CSS transform — cheaper than drawing four
 * corners, and symmetric designs like these flip cleanly. These are drawn
 * at a fixed pixel size and never stretched, so proportions stay intact
 * regardless of the page's size.
 */
const CORNERS = {
  'ribbon-bow': (color) => (
    <svg {...base} viewBox="0 0 56 56" width="48" height="48" fill="none">
      {/* two curling tails, like a bow's ribbon ends trailing off the corner */}
      <path d="M17 22q-8 3-8 13M23 16q3-8 13-8" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* a bow-tie: two symmetric loops meeting at a center knot */}
      <path d="M20 16C14 9 7 10 7 16C7 22 14 23 20 16Z" fill={`${color}2E`} stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M20 16C26 9 33 10 33 16C33 22 26 23 20 16Z" fill={`${color}2E`} stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="20" cy="16" r="2.3" fill={color} />
    </svg>
  ),
  'scalloped-lace': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="40" height="40" fill="none">
      <path d="M2 36Q2 2 36 2" stroke={color} strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M4 20Q4 12 12 12Q12 4 20 4" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="4" cy="20" r="1.4" fill={color} />
      <circle cx="12" cy="12" r="1.4" fill={color} />
      <circle cx="20" cy="4" r="1.4" fill={color} />
    </svg>
  ),
  'floral-corner': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="42" height="42" fill="none">
      <path d="M2 36Q2 10 36 2" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55" />
      <g>
        <ellipse cx="12" cy="8" rx="3.2" ry="1.9" fill={`${color}4A`} stroke={color} strokeWidth="0.9" transform="rotate(0 12 8)" />
        <ellipse cx="12" cy="8" rx="3.2" ry="1.9" fill={`${color}4A`} stroke={color} strokeWidth="0.9" transform="rotate(72 12 8)" />
        <ellipse cx="12" cy="8" rx="3.2" ry="1.9" fill={`${color}4A`} stroke={color} strokeWidth="0.9" transform="rotate(144 12 8)" />
        <ellipse cx="12" cy="8" rx="3.2" ry="1.9" fill={`${color}4A`} stroke={color} strokeWidth="0.9" transform="rotate(216 12 8)" />
        <ellipse cx="12" cy="8" rx="3.2" ry="1.9" fill={`${color}4A`} stroke={color} strokeWidth="0.9" transform="rotate(288 12 8)" />
        <circle cx="12" cy="8" r="1.4" fill={color} />
      </g>
      <ellipse cx="5" cy="19" rx="2" ry="1.1" fill={`${color}3A`} stroke={color} strokeWidth="0.8" transform="rotate(-30 5 19)" />
    </svg>
  ),
  'vintage-swirl': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="42" height="42" fill="none">
      <path d="M3 34Q3 18 14 15Q21 13 19 8Q17 4 12 6Q9 7.3 11 10" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="11" cy="10" r="1.1" fill={color} />
    </svg>
  ),
  'ornamental-frame': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="38" height="38" fill="none">
      <path d="M4 36Q4 4 36 4" stroke={color} strokeWidth="0.9" fill="none" opacity="0.5" />
      <path d="M2 30Q2 2 30 2" stroke={color} strokeWidth="0.9" fill="none" opacity="0.5" />
      <rect x="8.5" y="8.5" width="6.5" height="6.5" fill={`${color}2E`} stroke={color} strokeWidth="1.1" transform="rotate(45 11.75 11.75)" />
      <circle cx="11.75" cy="11.75" r="1.1" fill={color} />
    </svg>
  ),
  'rose-vine': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="42" height="42" fill="none">
      <path d="M3 36Q3 12 34 4" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
      <g transform="translate(10 10)">
        <circle r="3.2" fill={`${color}4A`} stroke={color} strokeWidth="0.9" />
        <path d="M0 -3.2A3.2 3.2 0 0 1 2.8 -1.4" stroke={color} strokeWidth="0.9" fill="none" />
      </g>
      <path d="M7 14q-5 0-6 6" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

/**
 * Two close parallel curves (a ribbon's two edges) plus a couple of bead
 * dots, run between corners — not a repeated motif. `preserveAspectRatio=
 * "none"` lets it stretch to fit however long the edge is, but because
 * it's just one or two broad curves (no fine detail to warp), stretching
 * reads as "a ribbon drawn to length" rather than a distorted pattern.
 * Horizontal and vertical are drawn separately so the ribbon always flows
 * along the edge it's on.
 */
const ribbonH = (outer, inner, dots) => (color) => (
  <>
    <path d={outer} stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.75" vectorEffect="non-scaling-stroke" />
    <path d={inner} stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.5" vectorEffect="non-scaling-stroke" />
    {dots.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="0.9" fill={color} opacity="0.8" />
    ))}
  </>
);

const EDGES_H = {
  'ribbon-bow': ribbonH('M0 4Q20 -2 40 4Q60 10 80 4Q90 1 100 4', 'M0 8Q20 2 40 8Q60 14 80 8Q90 5 100 8', [
    [20, 1],
    [50, 10],
    [80, 1],
  ]),
  'scalloped-lace': ribbonH('M0 8Q25 -1 50 8Q75 -1 100 8', 'M0 11Q25 2 50 11Q75 2 100 11', [
    [25, -1],
    [75, -1],
  ]),
  'floral-corner': ribbonH('M0 6Q30 -1 50 6Q70 13 100 6', 'M0 10Q30 3 50 10Q70 17 100 10', [
    [15, 2],
    [85, 2],
  ]),
  'vintage-swirl': ribbonH('M0 5C30 -5 70 15 100 5', 'M0 9C30 -1 70 19 100 9', []),
  'ornamental-frame': (color) => (
    <>
      <line x1="0" y1="2.5" x2="100" y2="2.5" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="9.5" x2="100" y2="9.5" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
    </>
  ),
  'rose-vine': ribbonH('M0 6Q30 -1 50 6Q70 13 100 6', 'M0 10Q30 3 50 10Q70 17 100 10', [[50, 11]]),
};

const ribbonV = (outer, inner, dots) => (color) => (
  <>
    <path d={outer} stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.75" vectorEffect="non-scaling-stroke" />
    <path d={inner} stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.5" vectorEffect="non-scaling-stroke" />
    {dots.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="0.9" fill={color} opacity="0.8" />
    ))}
  </>
);

/** Same ribbons, running top-to-bottom instead of left-to-right. */
const EDGES_V = {
  'ribbon-bow': ribbonV('M4 0Q-2 20 4 40Q10 60 4 80Q1 90 4 100', 'M8 0Q2 20 8 40Q14 60 8 80Q5 90 8 100', [
    [1, 20],
    [10, 50],
    [1, 80],
  ]),
  'scalloped-lace': ribbonV('M8 0Q-1 25 8 50Q-1 75 8 100', 'M11 0Q2 25 11 50Q2 75 11 100', [
    [-1, 25],
    [-1, 75],
  ]),
  'floral-corner': ribbonV('M6 0Q-1 30 6 50Q13 70 6 100', 'M10 0Q3 30 10 50Q17 70 10 100', [
    [2, 15],
    [2, 85],
  ]),
  'vintage-swirl': ribbonV('M5 0C-5 30 15 70 5 100', 'M9 0C-1 30 19 70 9 100', []),
  'ornamental-frame': (color) => (
    <>
      <line x1="2.5" y1="0" x2="2.5" y2="100" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="9.5" y1="0" x2="9.5" y2="100" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
    </>
  ),
  'rose-vine': ribbonV('M6 0Q-1 30 6 50Q13 70 6 100', 'M10 0Q3 30 10 50Q17 70 10 100', [[11, 50]]),
};

/**
 * A decorative frame around the writing page: four corner ornaments (one
 * motif, flipped into each corner, drawn at a fixed size — never
 * stretched) plus a two-line ribbon with bead dots running between them
 * along each edge. The middle stays completely empty — this never
 * overlaps the title, text, photos or sticky notes, only the outer margin.
 */
export default function PageBorderFrame({ value }) {
  const meta = getPageBorder(value);
  if (!meta.color) return null;

  const Corner = CORNERS[value];
  const EdgeH = EDGES_H[value];
  const EdgeV = EDGES_V[value];
  if (!Corner) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      {/* edges — a ribbon stretched to span between the corners */}
      <svg className="absolute left-11 right-11 top-2 h-4" viewBox="0 0 100 12" preserveAspectRatio="none">
        {EdgeH(meta.color)}
      </svg>
      <svg
        className="absolute left-11 right-11 bottom-2 h-4"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        style={{ transform: 'scaleY(-1)' }}
      >
        {EdgeH(meta.color)}
      </svg>
      <svg className="absolute top-11 bottom-11 left-2 w-4" viewBox="0 0 12 100" preserveAspectRatio="none">
        {EdgeV(meta.color)}
      </svg>
      <svg
        className="absolute top-11 bottom-11 right-2 w-4"
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        {EdgeV(meta.color)}
      </svg>

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
