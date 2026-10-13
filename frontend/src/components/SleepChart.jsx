import { getSleepQuality, SLEEP_QUALITY } from '../utils/sleep';

/**
 * Donut chart of the month's sleep-quality distribution. Same plain-SVG
 * arc technique as MoodChart's MoodDonut, parameterized for sleep quality
 * instead of mood, so it stays visually consistent with the rest of the
 * app without a charting library.
 */
export function SleepQualityDonut({ distribution = [], size = 148, thickness = 18 }) {
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
          ? `Sleep quality distribution: ${data.map((d) => `${getSleepQuality(d.quality).label} ${d.percent}%`).join(', ')}`
          : 'No sleep data yet'
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
              key={d.quality}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getSleepQuality(d.quality).color}
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

/** Legend used under the donut. */
export function SleepQualityLegend({ distribution = [] }) {
  const data = distribution.filter((d) => d.count > 0);
  if (!data.length) return null;

  return (
    <ul className="space-y-2">
      {data.map((d) => {
        const q = getSleepQuality(d.quality);
        return (
          <li key={d.quality} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: q.color }} aria-hidden="true" />
              <span style={{ color: 'rgb(var(--text))' }}>{q.label}</span>
            </span>
            <span className="muted tabular-nums">{d.percent}%</span>
          </li>
        );
      })}
    </ul>
  );
}

export { SLEEP_QUALITY };
