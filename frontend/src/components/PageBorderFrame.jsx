import { getPageBorder } from '../utils/pageBorders';

const base = {
  'aria-hidden': 'true',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
};

/**
 * One corner motif per style, anchored to the top-left (0,0) corner with
 * its linework trailing a little along both edges so it blends into the
 * line running between corners. The other three corners reuse the same
 * artwork, flipped with a CSS transform — cheaper than drawing four
 * corners, and symmetric designs like these flip cleanly. These are drawn
 * at a fixed pixel size and never stretched, so proportions stay intact
 * regardless of the page's size.
 */
const CORNERS = {
  'ribbon-bow': (color) => (
    <svg {...base} viewBox="0 0 50 50" width="42" height="42" fill="none">
      <path d="M2 36Q2 10 36 2" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.65" />
      {/* a proper two-loop bow with trailing tails, not a blob */}
      <path
        d="M14 13c-3-4 1-8 5-5c1-4 7-3 6 1c4-1 6 4 2 6c3 3-1 7-5 5c-1 3-6 3-7-1c-4 1-6-4-2-6Z"
        fill={`${color}2E`}
        stroke={color}
        strokeWidth="1.2"
      />
      <circle cx="16.5" cy="12.5" r="1.4" fill={color} />
      <path d="M11 16q-5 2-4 9M21 16q5 2 4 9" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
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
 * A single gentle flourish line per style, run between corners — not a
 * repeated motif. `preserveAspectRatio="none"` lets it stretch to fit
 * however long the edge is, but because it's just one or two broad
 * curves (no fine detail to warp), stretching reads as "a ribbon drawn to
 * length" rather than a distorted pattern. Horizontal and vertical are
 * drawn separately so the curve always flows along the edge it's on.
 */
const EDGES_H = {
  'ribbon-bow': (color) => (
    <path d="M0 6Q20 0 40 6Q60 12 80 6Q90 3 100 6" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
  ),
  'scalloped-lace': (color) => (
    <path d="M0 10Q25 1 50 10Q75 1 100 10" stroke={color} strokeWidth="1" fill="none" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
  'floral-corner': (color) => (
    <path d="M0 8Q30 1 50 8Q70 15 100 8" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
  'vintage-swirl': (color) => (
    <path d="M0 7C30 -3 70 17 100 7" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
  'ornamental-frame': (color) => (
    <>
      <line x1="0" y1="2.5" x2="100" y2="2.5" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="9.5" x2="100" y2="9.5" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
    </>
  ),
  'rose-vine': (color) => (
    <path d="M0 8Q30 1 50 8Q70 15 100 8" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
};

/** Same flourishes, running top-to-bottom instead of left-to-right. */
const EDGES_V = {
  'ribbon-bow': (color) => (
    <path d="M6 0Q0 20 6 40Q12 60 6 80Q3 90 6 100" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
  ),
  'scalloped-lace': (color) => (
    <path d="M10 0Q1 25 10 50Q1 75 10 100" stroke={color} strokeWidth="1" fill="none" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
  'floral-corner': (color) => (
    <path d="M8 0Q1 30 8 50Q15 70 8 100" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
  'vintage-swirl': (color) => (
    <path d="M7 0C-3 30 17 70 7 100" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
  'ornamental-frame': (color) => (
    <>
      <line x1="2.5" y1="0" x2="2.5" y2="100" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="9.5" y1="0" x2="9.5" y2="100" stroke={color} strokeWidth="0.8" opacity="0.5" vectorEffect="non-scaling-stroke" />
    </>
  ),
  'rose-vine': (color) => (
    <path d="M8 0Q1 30 8 50Q15 70 8 100" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
  ),
};

/**
 * A decorative frame around the writing page: four corner ornaments (one
 * motif, flipped into each corner, drawn at a fixed size — never
 * stretched) plus one gentle flourish line running between them along
 * each edge. The middle stays completely empty — this never overlaps the
 * title, text, photos or sticky notes, only the outer margin.
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
      {/* edges — one flourish line stretched to span between the corners */}
      <svg className="absolute left-10 right-10 top-2 h-3" viewBox="0 0 100 12" preserveAspectRatio="none">
        {EdgeH(meta.color)}
      </svg>
      <svg
        className="absolute left-10 right-10 bottom-2 h-3"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        style={{ transform: 'scaleY(-1)' }}
      >
        {EdgeH(meta.color)}
      </svg>
      <svg className="absolute top-10 bottom-10 left-2 w-3" viewBox="0 0 12 100" preserveAspectRatio="none">
        {EdgeV(meta.color)}
      </svg>
      <svg
        className="absolute top-10 bottom-10 right-2 w-3"
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
