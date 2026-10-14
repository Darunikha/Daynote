import { getPageBorder } from '../utils/pageBorders';

/**
 * A decorative frame around the writing page, drawn from a real hand-drawn
 * ribbon/bow illustration (a transparent PNG) rather than hand-coded SVG.
 *
 * This uses CSS `border-image`, the standard technique for "wrap a decorative
 * image around a box whose size isn't fixed": the source image is sliced
 * into a 3×3 grid at `slice`%, the four corners are drawn at their original
 * size (never stretched, so the bows keep their proportions), and the four
 * edge strips between them repeat as whole tiles (`round`) rather than
 * stretching as one smeared copy — `stretch` looked fine on a roughly
 * square test card but badly warped the detailed ribbon art on the
 * page's actual tall, narrow proportions. `round` never distorts a tile;
 * the tradeoff is that a design with a single accent mid-edge (like one
 * bow at the bottom) may repeat it a few times along a long edge instead
 * of showing it once — in practice this reads as a garland, not a glitch.
 * The image's own transparent center means there's nothing to clip — the
 * middle of the page stays completely empty no matter how the box resizes,
 * so this can never overlap the title, text, photos or sticky notes.
 *
 * Width is 84px, not a slimmer value — the source art is ~400–480px per
 * side, and squeezing it into a thin border forces the browser to
 * downscale it hard, which read as smudged/blurry (confirmed by comparing
 * renders at two widths side by side: thinner was visibly softer, not a
 * flaw in the artwork itself). More width gives it room to stay crisp.
 */
export default function PageBorderFrame({ value }) {
  const meta = getPageBorder(value);
  if (!meta.src) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2]"
      aria-hidden="true"
      style={{
        borderStyle: 'solid',
        borderWidth: 84,
        borderImageSource: `url(${meta.src})`,
        borderImageSlice: `${meta.slice}%`,
        borderImageWidth: '84px',
        borderImageRepeat: 'round',
      }}
    />
  );
}
