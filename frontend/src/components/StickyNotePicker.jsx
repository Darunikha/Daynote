import { STICKY_NOTE_DESIGNS, MAX_STICKY_NOTES, getNoteBackgroundStyle, getNoteShapeStyle } from '../utils/stickyNotes';

/**
 * Tap a design to drop a new sticky note onto the page — this picker only
 * adds notes; moving, restyling, and deleting happens on the note itself.
 */
export default function StickyNotePicker({ count = 0, onAdd }) {
  const atLimit = count >= MAX_STICKY_NOTES;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {STICKY_NOTE_DESIGNS.map((d) => (
          <button
            key={d.value}
            type="button"
            disabled={atLimit}
            onClick={() => onAdd(d.value)}
            className="flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2.5 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            style={{ borderColor: 'rgb(var(--border))' }}
          >
            <span
              className="h-9 w-9 shrink-0 border"
              style={{
                borderColor: 'rgb(var(--border))',
                ...getNoteBackgroundStyle(d.value),
                ...getNoteShapeStyle(d.value === 'heart' ? 'plain' : d.value),
              }}
              aria-hidden="true"
            />
            {d.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'rgb(var(--text-muted))' }}>
        {atLimit
          ? `That's ${MAX_STICKY_NOTES} notes — plenty for one page.`
          : 'Tap a style to drop it on the page, then drag it wherever you like.'}
      </p>
    </div>
  );
}
