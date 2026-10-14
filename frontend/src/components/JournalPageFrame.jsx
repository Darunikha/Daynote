import { useLayoutEffect, useRef, useState } from 'react';
import PageBorderFrame, { BORDER_MASK_FRACTION } from './PageBorderFrame';

// How far the content is pushed in from each edge, as a fraction of the
// page's own rendered size on that axis — matches BORDER_MASK_FRACTION,
// the band PageBorderFrame actually clips its art to, so text always
// starts right at (not under) the visible edge of the frame. A fixed
// pixel padding (what an earlier version used) was correct-looking on a
// small test swatch and badly undersized on the app's actual, much
// larger page, which is exactly why the border ended up covering the
// title and text — this is computed from the page's own measured size
// instead, so it scales correctly on every page, however tall it grows.
const BORDER_SAFE_FRACTION = BORDER_MASK_FRACTION;

/**
 * Wraps the journal writing surface so it reads as a real, slightly-tilted
 * sheet of paper resting on a small stack of pages, rather than a plain
 * rectangular editor panel. Shared by the New Entry / Edit page and the
 * read-only entry view so a saved entry looks the same as it did while
 * being written.
 *
 * Straight edges, generously rounded corners (`.card`'s own `rounded-card`)
 * — not a wavy or torn edge. Two earlier passes tried a deckled/torn top
 * and bottom (first as a straight-line polygon, which read as a sharp
 * zigzag; then as a curved SVG clip-path, which still read as wavier than
 * intended); this design calls for the simpler shape instead.
 *
 * The "stack" is two faint page-colored slivers peeking out from behind the
 * main sheet, each nudged and rotated a little differently. They're plain
 * siblings rendered before the main card (not the card's own pseudo-
 * elements), so they can't ever paint over its content, decorations, or
 * sticky notes — CSS stacks positioned elements without an explicit
 * z-index by DOM order, and those all set their own z-index already.
 *
 * `border` (a PAGE_BORDERS value) draws a decorative frame — one complete
 * image, not tiled — via PageBorderFrame. When one is active, this
 * measures its own rendered size (via ResizeObserver, not CSS percentage
 * padding — vertical percentage padding resolves against the box's
 * WIDTH per spec, which is wrong here on anything other than a square
 * page) and pads the content in by BORDER_SAFE_FRACTION of each axis, so
 * the title/text/photos/sticky notes always clear the border's ink
 * regardless of how tall the page grows.
 */
export default function JournalPageFrame({ children, className = '', style, border = 'none' }) {
  const cardRef = useRef(null);
  const [borderPadding, setBorderPadding] = useState(null);

  useLayoutEffect(() => {
    if (border === 'none' || !cardRef.current) {
      setBorderPadding(null);
      return undefined;
    }
    const el = cardRef.current;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const next = {
        paddingLeft: Math.round(width * BORDER_SAFE_FRACTION.x),
        paddingRight: Math.round(width * BORDER_SAFE_FRACTION.x),
        paddingTop: Math.round(height * BORDER_SAFE_FRACTION.y),
        paddingBottom: Math.round(height * BORDER_SAFE_FRACTION.y),
      };
      setBorderPadding((prev) => (prev && prev.paddingTop === next.paddingTop && prev.paddingLeft === next.paddingLeft ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [border]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="rounded-card border absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface))',
          borderColor: 'rgb(var(--border) / 0.7)',
          transform: 'rotate(1.1deg) translate(7px, 6px)',
          opacity: 0.7,
        }}
      />
      <div
        aria-hidden="true"
        className="rounded-card border absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface))',
          borderColor: 'rgb(var(--border) / 0.7)',
          transform: 'rotate(-1.6deg) translate(-8px, 8px)',
          opacity: 0.45,
        }}
      />

      <div
        ref={cardRef}
        className={`card shadow-paper-lg relative ${className}`}
        style={{ transform: 'rotate(-0.3deg)', ...style, ...borderPadding }}
      >
        <span aria-hidden="true" className="journal-grain pointer-events-none absolute inset-0" />
        <PageBorderFrame value={border} />
        {children}
      </div>
    </div>
  );
}
