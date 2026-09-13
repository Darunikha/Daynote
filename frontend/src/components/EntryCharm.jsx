import { getDecoration } from '../utils/decorations';

/**
 * Renders every chosen scrapbook charm pinned to a corner of its nearest
 * `position: relative` ancestor (a journal card). Most charms hang mostly
 * outside the card's own padding box — like something clipped or taped onto
 * the edge — so they never sit over the title, date, or entry text.
 *
 * When more than one charm shares the same corner, each extra one fans out
 * a little further along the edge instead of stacking exactly on top of the
 * last, so a handful of charms still reads as an intentional little cluster.
 */
export default function EntryCharm({ values, className = '' }) {
  const list = (Array.isArray(values) ? values : [values]).filter((v) => v && v !== 'none');
  if (!list.length) return null;

  const seenPerCorner = {};

  return (
    <>
      {list.map((value) => {
        const decoration = getDecoration(value);
        if (!decoration.Charm) return null;

        const { Charm, width, height, rotate = 0, offset = {}, corner = '' } = decoration;
        const stackIndex = seenPerCorner[corner] || 0;
        seenPerCorner[corner] = stackIndex + 1;
        const stackShift = stackIndex * (width * 0.55 + 8);
        const shiftLeft = corner.endsWith('left') ? stackShift : 0;
        const shiftRight = corner.endsWith('right') ? stackShift : 0;

        return (
          <span
            key={value}
            aria-hidden="true"
            className={`pointer-events-none absolute z-[1] select-none drop-shadow-sm ${className}`}
            style={{
              width,
              height,
              top: offset.top,
              bottom: offset.bottom,
              left: offset.left != null ? offset.left + shiftLeft : undefined,
              right: offset.right != null ? offset.right + shiftRight : undefined,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Charm className="h-full w-full" />
          </span>
        );
      })}
    </>
  );
}
