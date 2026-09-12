import { getDecoration } from '../utils/decorations';

/**
 * Renders the chosen scrapbook charm pinned to a corner of its nearest
 * `position: relative` ancestor (a journal card). Most charms hang mostly
 * outside the card's own padding box — like something clipped or taped onto
 * the edge — so they never sit over the title, date, or entry text.
 */
export default function EntryCharm({ value, className = '' }) {
  const decoration = getDecoration(value);
  if (!decoration.Charm) return null;

  const { Charm, width, height, rotate = 0, offset = {} } = decoration;

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-[1] select-none drop-shadow-sm ${className}`}
      style={{
        width,
        height,
        top: offset.top,
        bottom: offset.bottom,
        left: offset.left,
        right: offset.right,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <Charm className="h-full w-full" />
    </span>
  );
}
