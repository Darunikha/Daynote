import PageBorderFrame from './PageBorderFrame';

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
 * `border` (a PAGE_BORDERS value) draws a decorative frame — corner
 * ornaments + tiled edge lines — hugging just inside this same edge, via
 * PageBorderFrame. Its middle is always empty, so it never competes with
 * the title, text, photos or sticky notes for space.
 */
export default function JournalPageFrame({ children, className = '', style, border = 'none' }) {
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
        className={`card shadow-paper-lg relative ${className}`}
        style={{ transform: 'rotate(-0.3deg)', ...style }}
      >
        <span aria-hidden="true" className="journal-grain pointer-events-none absolute inset-0" />
        <PageBorderFrame value={border} />
        {children}
      </div>
    </div>
  );
}
