import { useId } from 'react';

/**
 * Wraps the journal writing surface so it reads as a real, slightly-tilted
 * sheet of paper — torn off a pad along the top and bottom edges — resting
 * on a small stack of pages, rather than a plain rectangular editor panel.
 * Shared by the New Entry / Edit page and the read-only entry view so a
 * saved entry looks the same as it did while being written.
 *
 * The torn edge is an SVG clip-path with quadratic-bezier curves, not a CSS
 * `clip-path: polygon()` — a polygon can only draw straight lines between
 * points, which reads as a sharp zigzag. Curves give the soft, rounded tear
 * a real piece of paper has. `clipPathUnits="objectBoundingBox"` lets the
 * path use fractional 0–1 coordinates that scale with the element's actual
 * box, the curve equivalent of percentage units — needed here because the
 * page's height isn't fixed, it grows with how much is written.
 *
 * The "stack" is two faint page-colored slivers peeking out from behind the
 * main sheet, each nudged, rotated and torn a little differently. They're
 * plain siblings rendered before the main card (not the card's own pseudo-
 * elements), so they can't ever paint over its content, decorations, or
 * sticky notes — CSS stacks positioned elements without an explicit
 * z-index by DOM order, and those all set their own z-index already.
 *
 * The card's own shadow is a `filter: drop-shadow` rather than the usual
 * `.card` box-shadow — a box-shadow is drawn from the element's rectangular
 * box, so it would show up as a rectangle behind the torn silhouette;
 * drop-shadow follows the clipped shape instead.
 */

// Gentle, slightly irregular wave (quadratic beziers through sine-based
// points) rather than a uniform scallop — reads as a soft natural tear,
// not stamped-out stationery. y stays within about 0–2.6% of the box's
// height on each edge, so it's a tear, not a deep notch.
const TORN_PATH =
  'M0.0000,0.0243 Q0.0833,0.0259 0.1250,0.0141 Q0.1667,0.0022 0.2083,0.0102 Q0.2500,0.0182 0.2917,0.0196 ' +
  'Q0.3333,0.0210 0.3750,0.0122 Q0.4167,0.0033 0.4583,0.0138 Q0.5000,0.0243 0.5417,0.0253 Q0.5833,0.0263 ' +
  '0.6250,0.0149 Q0.6667,0.0034 0.7083,0.0113 Q0.7500,0.0192 0.7917,0.0197 Q0.8333,0.0201 0.8750,0.0111 ' +
  'Q0.9167,0.0020 1.0000,0.0239 L1.0000,0.9761 Q0.9167,0.9958 0.8750,0.9878 Q0.8333,0.9797 0.7917,0.9752 ' +
  'Q0.7500,0.9707 0.7083,0.9831 Q0.6667,0.9955 0.6250,0.9900 Q0.5833,0.9846 0.5417,0.9808 Q0.5000,0.9769 ' +
  '0.4583,0.9871 Q0.4167,0.9972 0.3750,0.9887 Q0.3333,0.9802 0.2917,0.9754 Q0.2500,0.9706 0.2083,0.9825 ' +
  'Q0.1667,0.9945 0.1250,0.9888 Q0.0833,0.9832 0.0000,0.9772 Z';

export default function JournalPageFrame({ children, className = '', style }) {
  const clipId = `journal-page-torn-${useId()}`;

  return (
    <div className="relative">
      {/* Zero-size, visually hidden — only here to define the clip shape. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={TORN_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface))',
          clipPath: `url(#${clipId})`,
          transform: 'rotate(1.1deg) translate(7px, 6px)',
          opacity: 0.7,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface))',
          clipPath: `url(#${clipId})`,
          transform: 'rotate(-1.6deg) translate(-8px, 8px)',
          opacity: 0.45,
        }}
      />

      <div
        className={`card relative ${className}`}
        style={{
          clipPath: `url(#${clipId})`,
          border: 'none',
          transform: 'rotate(-0.3deg)',
          filter: 'drop-shadow(0 18px 30px rgb(107 75 90 / 0.22)) drop-shadow(0 2px 4px rgb(107 75 90 / 0.08))',
          ...style,
        }}
      >
        <span aria-hidden="true" className="journal-grain pointer-events-none absolute inset-0" />
        {children}
      </div>
    </div>
  );
}
