import { useMemo } from 'react';

const DAY_MS = 86400000;
const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** How dark a square is for a given day's entry count — a flat on/off dot
 * would lose the difference between a one-line day and a five-entry day. */
const opacityFor = (count) => {
  if (count <= 0) return 0;
  if (count === 1) return 0.35;
  if (count === 2) return 0.6;
  if (count === 3) return 0.8;
  return 1;
};

/**
 * A GitHub-style activity grid: one column per week, one row per weekday,
 * going back `weeks` weeks from today, shaded by how many entries were
 * written that day. `days` is the raw `[{ date: 'YYYY-MM-DD', count }]`
 * from journalService.heatmap() — sparse (only days with entries), so it's
 * turned into a lookup once rather than re-scanned per cell.
 *
 * Weeks run Sunday–Saturday and the grid always ends on the current week,
 * padded with empty leading cells so the first column lines up under its
 * real weekday rather than being squeezed to the left.
 */
export default function WritingHeatmap({ days = [], weeks = 53 }) {
  const byDay = useMemo(() => new Map(days.map((d) => [d.date, d.count])), [days]);

  const { columns, monthMarkers } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay())); // end of this week (Saturday)
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));
    start.setDate(start.getDate() - start.getDay()); // back up to a Sunday

    const cols = [];
    const markers = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks; w += 1) {
      const col = [];
      for (let d = 0; d < 7; d += 1) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        if (date > today) {
          col.push(null);
          continue;
        }
        if (d === 0 && date.getMonth() !== lastMonth) {
          lastMonth = date.getMonth();
          markers.push({ week: w, label: MONTH_LABELS[date.getMonth()] });
        }
        const key = toKey(date);
        col.push({ key, count: byDay.get(key) || 0, date });
      }
      cols.push(col);
    }
    return { columns: cols, monthMarkers: markers };
  }, [byDay, weeks]);

  const totalDays = days.reduce((sum, d) => sum + (d.count > 0 ? 1 : 0), 0);

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1" style={{ minWidth: weeks * 13 }}>
          <div className="flex gap-[3px] pl-6 text-[10px]" style={{ color: 'rgb(var(--text-muted))' }}>
            {columns.map((_, w) => {
              const marker = monthMarkers.find((m) => m.week === w);
              return (
                <span key={w} className="w-[10px] shrink-0">
                  {marker?.label}
                </span>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            <div className="flex w-6 shrink-0 flex-col gap-[3px] text-[10px]" style={{ color: 'rgb(var(--text-muted))' }}>
              {WEEKDAY_LABELS.map((label, i) => (
                <span key={i} className="h-[10px] leading-[10px]">
                  {label}
                </span>
              ))}
            </div>

            {columns.map((col, w) => (
              <div key={w} className="flex shrink-0 flex-col gap-[3px]">
                {col.map((cell, d) =>
                  cell ? (
                    <div
                      key={cell.key}
                      title={`${cell.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — ${cell.count} ${cell.count === 1 ? 'entry' : 'entries'}`}
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{
                        backgroundColor:
                          cell.count > 0 ? `rgb(var(--accent) / ${opacityFor(cell.count)})` : 'rgb(var(--border) / 0.5)',
                      }}
                    />
                  ) : (
                    <div key={`${w}-${d}`} className="h-[10px] w-[10px]" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
        <span>{totalDays} days written in the last {weeks} weeks</span>
        <span className="flex items-center gap-1">
          Less
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: i === 0 ? 'rgb(var(--border) / 0.5)' : `rgb(var(--accent) / ${opacityFor(i)})` }}
            />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
