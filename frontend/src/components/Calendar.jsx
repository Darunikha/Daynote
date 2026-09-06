import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMood } from '../utils/moods';
import { MONTH_NAMES, monthGrid, isSameDay } from '../utils/format';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Month calendar shared by the Calendar page and the Mood Tracker.
 * `entriesByDay` maps a "YYYY-M-D" key to that day's entries.
 */
export default function Calendar({
  month,
  year,
  onMonthChange,
  entriesByDay = {},
  selectedDate,
  onSelectDate,
  variant = 'default',
}) {
  const weeks = monthGrid(year, month);
  const today = new Date();
  const showMoodFill = variant === 'mood';

  const keyFor = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const step = (delta) => {
    const next = new Date(year, month + delta, 1);
    onMonthChange(next.getFullYear(), next.getMonth());
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous month"
          className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))]"
        >
          <ChevronLeft size={16} />
        </button>

        <h3 className="font-serif text-lg sm:text-xl" aria-live="polite">
          {MONTH_NAMES[month]} {year}
        </h3>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next month"
          className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <table className="w-full table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th
                key={d}
                scope="col"
                className="muted pb-2 text-[10px] font-medium uppercase tracking-wider sm:text-xs"
              >
                <span aria-hidden="true">{d.slice(0, 2)}</span>
                <span className="sr-only">{d}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day) return <td key={di} />;

                const dayEntries = entriesByDay[keyFor(day)] || [];
                const has = dayEntries.length > 0;
                const mood = has ? getMood(dayEntries[0].mood) : null;
                const isToday = isSameDay(day, today);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <td key={di} className="p-0 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onSelectDate?.(day)}
                      aria-label={`${day.getDate()} ${MONTH_NAMES[month]}${
                        has ? `, ${dayEntries.length} entry${dayEntries.length > 1 ? 's' : ''}` : ', no entries'
                      }`}
                      aria-current={isToday ? 'date' : undefined}
                      aria-pressed={Boolean(isSelected)}
                      className="relative mx-auto flex aspect-square w-full max-w-[42px] flex-col items-center justify-center rounded-full text-xs transition-all duration-200 hover:scale-105 sm:text-sm"
                      style={{
                        backgroundColor:
                          showMoodFill && mood
                            ? mood.soft
                            : isSelected
                              ? 'rgb(var(--accent) / 0.45)'
                              : 'transparent',
                        color: 'rgb(var(--text))',
                        boxShadow: isSelected
                          ? '0 0 0 2px rgb(var(--accent))'
                          : isToday
                            ? '0 0 0 1px rgb(var(--olive))'
                            : 'none',
                      }}
                    >
                      {showMoodFill && mood ? (
                        <span aria-hidden="true" className="text-base leading-none sm:text-lg">
                          {mood.emoji}
                        </span>
                      ) : (
                        <span className={isToday ? 'font-semibold' : ''}>{day.getDate()}</span>
                      )}

                      {/* Entry indicator dot */}
                      {has && !showMoodFill && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-1 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: mood.color }}
                        />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
