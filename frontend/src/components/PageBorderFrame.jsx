import { getPageBorder } from '../utils/pageBorders';

/**
 * A decorative frame around the writing page, drawn from the real
 * hand-drawn ribbon/bow illustration — rendered as ONE complete image,
 * not tiled, sliced, or repeated in any way.
 *
 * Earlier versions used CSS `border-image` to slice the source into a
 * 3×3 grid and tile the edge strips between the corners. That's the
 * standard technique for a decorative border, but it's fundamentally the
 * wrong tool for THIS art: these images are each a single continuous
 * hand-drawn frame (the bows and the ribbon between them are one
 * unbroken line), not a repeatable tile. Slicing it and repeating a
 * fragment of it necessarily shows a seam at every repeat, no matter how
 * the slice point or tile size is tuned — that's what kept reading as
 * "cut" and "stitched together".
 *
 * The actual fix: don't slice it at all. Render the whole image as one
 * `<img>`, scaled with `object-fit: fill` to exactly match the page's
 * current box. The page's box isn't a fixed aspect ratio (it grows with
 * how much is written), and these frames are close to square, so some
 * non-uniform scaling happens on a very tall page — but that's a single
 * clean resize of one image, not a composited, repeated pattern, so
 * there is no seam, gap, or cut anywhere: every corner and the ribbon
 * connecting them stays exactly as drawn, just scaled as one piece.
 * `object-fit: contain` was considered and rejected — on a page taller
 * or narrower than the source image, it would leave bare gaps on two
 * sides instead of the frame reaching every edge.
 *
 * The image's own transparent center means the middle of the page stays
 * completely empty regardless of scale, so this never overlaps the
 * title, text, photos or sticky notes.
 */
export default function PageBorderFrame({ value }) {
  const meta = getPageBorder(value);
  if (!meta.src) return null;

  return (
    <img
      src={meta.src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      style={{ objectFit: 'fill' }}
    />
  );
}
