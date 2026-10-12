import { getPageBorder } from '../utils/pageBorders';

const base = { 'aria-hidden': 'true', focusable: 'false', xmlns: 'http://www.w3.org/2000/svg' };

/**
 * A single gentle flourish line spanning between corners — one continuous
 * curve, not a repeated tile, so it always flows without the seams a
 * tiled pattern shows at each repeat boundary. `preserveAspectRatio=
 * "none"` lets it stretch to fit however long the edge is; because it's
 * just one broad curve with no fine repeating detail, stretching reads as
 * "a ribbon drawn to length" rather than a distorted pattern — the same
 * reasoning that ruled out stretching the actual photo (too much fine
 * detail to warp), but fine for a plain procedural line.
 */
const edgeH = (color) => (
  <path d="M0 6Q25 -2 50 6Q75 14 100 6" stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
);
const edgeV = (color) => (
  <path d="M6 0Q-2 25 6 50Q14 75 6 100" stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
);

/**
 * A decorative frame around the writing page, built from the real
 * hand-drawn ribbon/bow illustrations: each corner is a piece actually
 * cropped from the source artwork (components/PageBorderFrame reads it as
 * a plain image, drawn at a fixed size — never stretched, so the bow
 * keeps its exact proportions), and a single flourish line in the
 * artwork's own red connects them along each edge.
 *
 * This replaces an earlier version that tiled the whole source image
 * around the edges via CSS border-image. That avoided distortion but
 * produced visible seams at every tile repeat, since the art isn't
 * drawn as a seamless loop — not actually "flowing". A plain procedural
 * line can't have that problem because there's nothing to repeat.
 */
export default function PageBorderFrame({ value }) {
  const meta = getPageBorder(value);
  if (!meta.corner) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      <svg className="absolute left-20 right-20 top-5 h-5" viewBox="0 0 100 12" preserveAspectRatio="none">
        {edgeH(meta.lineColor)}
      </svg>
      <svg
        className="absolute left-20 right-20 bottom-5 h-5"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        style={{ transform: 'scaleY(-1)' }}
      >
        {edgeH(meta.lineColor)}
      </svg>
      <svg className="absolute top-20 bottom-20 left-5 w-5" viewBox="0 0 12 100" preserveAspectRatio="none">
        {edgeV(meta.lineColor)}
      </svg>
      <svg
        className="absolute top-20 bottom-20 right-5 w-5"
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        {edgeV(meta.lineColor)}
      </svg>

      <img src={meta.corner} alt="" className="absolute left-0 top-0" style={{ width: 92, height: 92 }} />
      <img src={meta.corner} alt="" className="absolute right-0 top-0" style={{ width: 92, height: 92, transform: 'scaleX(-1)' }} />
      <img src={meta.corner} alt="" className="absolute bottom-0 left-0" style={{ width: 92, height: 92, transform: 'scaleY(-1)' }} />
      <img src={meta.corner} alt="" className="absolute bottom-0 right-0" style={{ width: 92, height: 92, transform: 'scale(-1, -1)' }} />
    </div>
  );
}
