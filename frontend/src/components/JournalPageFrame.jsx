/**
 * Wraps the journal writing surface so it reads as a real, slightly-tilted
 * sheet of paper — torn off a pad along the top and bottom edges — resting
 * on a small stack of pages, rather than a plain rectangular editor panel.
 * Shared by the New Entry / Edit page and the read-only entry view so a
 * saved entry looks the same as it did while being written.
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
export default function JournalPageFrame({ children, className = '', style }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="journal-page-torn absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface))',
          transform: 'rotate(1.1deg) translate(7px, 6px)',
          opacity: 0.7,
        }}
      />
      <div
        aria-hidden="true"
        className="journal-page-torn absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface))',
          transform: 'rotate(-1.6deg) translate(-8px, 8px)',
          opacity: 0.45,
        }}
      />

      <div
        className={`journal-page-torn card relative ${className}`}
        style={{
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
