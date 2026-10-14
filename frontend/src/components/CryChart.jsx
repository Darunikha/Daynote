import { getCryIntensity } from '../utils/cry';

/** Donut chart of the month's cry-intensity distribution — same plain-SVG arc technique as Mood/Sleep's charts. */
export function CryIntensityDonut({ distribution = [], size = 148, thickness = 18 }) {
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
          ? `Cry intensity distribution: ${data.map((d) => `${getCryIntensity(d.intensity).label} ${d.percent}%`).join(', ')}`
          : 'No cry data yet'
      }
      className="shrink-0"
    >
      <circle cx={center} cy={center} r={radius} fill="none" stroke="rgb(var(--border))" strokeWidth={thickness} opacity={total ? 0.4 : 1} />

      {total > 0 &&
        data.map((d) => {
          const fraction = d.count / total;
          const dash = fraction * circumference;
          const el = (
            <circle
              key={d.intensity}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getCryIntensity(d.intensity).color}
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
export function CryIntensityLegend({ distribution = [] }) {
  const data = distribution.filter((d) => d.count > 0);
  if (!data.length) return null;

  return (
    <ul className="space-y-2">
      {data.map((d) => {
        const i = getCryIntensity(d.intensity);
        return (
          <li key={d.intensity} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: i.color }} aria-hidden="true" />
              <span style={{ color: 'rgb(var(--text))' }}>{i.label}</span>
            </span>
            <span className="muted tabular-nums">{d.percent}%</span>
          </li>
        );
      })}
    </ul>
  );
}
