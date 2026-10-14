import { getPageBorder } from '../utils/pageBorders';

// The visible band, as a fraction of the box's own width/height on each
// axis — matches BORDER_SAFE_FRACTION in JournalPageFrame.jsx, which pads
// the content in by the same amount. Keep the two in sync: this value is
// where the art gets clipped, that one is where the text starts, so text
// padding must be >= this or it sits under still-visible ink.
export const BORDER_MASK_FRACTION = { x: 0.22, y: 0.37 };

const maskUrl = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>` +
    `<path fill-rule='evenodd' fill='#fff' d='M0,0H100V100H0Z ` +
    `M${BORDER_MASK_FRACTION.x * 100},${BORDER_MASK_FRACTION.y * 100}` +
    `H${100 - BORDER_MASK_FRACTION.x * 100}V${100 - BORDER_MASK_FRACTION.y * 100}` +
    `H${BORDER_MASK_FRACTION.x * 100}Z'/></svg>`
)}`;

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
 * The fix for that: don't slice it at all. Render the whole image as one
 * `<img>`, scaled with `object-fit: fill` to exactly match the page's
 * current box. `object-fit: contain` was considered and rejected — on a
 * page taller or narrower than the source image, it would leave bare
 * gaps on two sides instead of the frame reaching every edge.
 *
 * That alone isn't sufficient, though: these are hand-drawn frames, not
 * clean rectangular borders, so their ink doesn't stay a fixed distance
 * from the edge everywhere — e.g. heart-bow's hearts sit partway down
 * each side, ribbon-wave's bow sits at the bottom-center, reaching much
 * further in there than a strip near the corners would suggest. Relying
 * on a guessed padding to dodge wherever each image's ink happens to be
 * is fragile and was wrong in practice. Instead, `mask-image` clips the
 * rendered image to a frame-shaped band (the outer BORDER_MASK_FRACTION
 * of each axis) — a hard, deterministic guarantee that no ink renders
 * past that boundary, for any of these images, regardless of their
 * individual layouts. JournalPageFrame pads the content in by the same
 * fraction, so the two always line up.
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
      style={{
        objectFit: 'fill',
        WebkitMaskImage: `url("${maskUrl}")`,
        maskImage: `url("${maskUrl}")`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    />
  );
}
