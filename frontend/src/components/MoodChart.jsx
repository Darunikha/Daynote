import { getMood, MOODS } from '../utils/moods';

/**
 * Donut chart of the mood distribution. Drawn with plain SVG arcs so there is
 * no chart library to load, and it stays soft rather than clinical.
 */
export function MoodDonut({ distribution = [], size = 148, thickness = 18 }) {
  const data = distribution.filter((d) => d.count > 0);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={
        total
          ? `Mood distribution: ${data.map((d) => `${getMood(d.mood).label} ${d.percent}%`).join(', ')}`
          : 'No mood data yet'
      }
      className="shrink-0"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgb(var(--border))"
        strokeWidth={thickness}
        opacity={total ? 0.4 : 1}
      />

      {total > 0 &&
        data.map((d) => {
          const fraction = d.count / total;
          const dash = fraction * circumference;
          const el = (
            <circle
              key={d.mood}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getMood(d.mood).color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(dash - 2, 0)} ${circumference - Math.max(dash - 2, 0)}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          );
          offset += dash;
          return el;
        })}
    </svg>
  );
}

/** Horizontal bars showing each mood's share of the month. */
export function MoodBars({ distribution = [] }) {
  const data = distribution.filter((d) => d.count > 0);
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.count));

  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const mood = getMood(d.mood);
        return (
          <li key={d.mood} className="flex items-center gap-3">
            <span className="flex w-24 shrink-0 items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: mood.color }}
                aria-hidden="true"
              />
              <span className="truncate" style={{ color: 'rgb(var(--text))' }}>
                {mood.label}
              </span>
            </span>

            <span
              className="h-2 flex-1 overflow-hidden rounded-full"
              style={{ backgroundColor: 'rgb(var(--border) / 0.5)' }}
            >
              <span
                className="block h-full rounded-full transition-all duration-700"
                style={{ width: `${(d.count / max) * 100}%`, backgroundColor: mood.color }}
              />
            </span>

            <span className="muted w-10 shrink-0 text-right text-xs tabular-nums">{d.percent}%</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "This Week" strip: one soft column per day, coloured by that day's mood and
 * scaled by how much was written.
 */
export function WeekStrip({ days = [] }) {
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="flex items-end justify-between gap-1.5 sm:gap-2">
      {days.map((day) => {
        const mood = day.mood ? getMood(day.mood) : null;
        const height = day.count ? 28 + (day.count / max) * 52 : 10;

        return (
          <div key={day.label + day.date} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-full transition-all duration-500"
              style={{
                height,
                backgroundColor: mood ? mood.color : 'rgb(var(--border))',
                opacity: mood ? 0.85 : 0.5,
              }}
              title={mood ? `${day.label}: ${mood.label}` : `${day.label}: nothing written`}
            />
            <span className="muted text-[10px] font-medium">{day.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Legend used under the donut. */
export function MoodLegend({ distribution = [], limit = 5 }) {
  const data = distribution.filter((d) => d.count > 0).slice(0, limit);
  if (!data.length) return null;

  return (
    <ul className="space-y-2">
      {data.map((d) => {
        const mood = getMood(d.mood);
        return (
          <li key={d.mood} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: mood.color }}
                aria-hidden="true"
              />
              <span style={{ color: 'rgb(var(--text))' }}>{mood.label}</span>
            </span>
            <span className="muted tabular-nums">{d.percent}%</span>
          </li>
        );
      })}
    </ul>
  );
}

export { MOODS };
