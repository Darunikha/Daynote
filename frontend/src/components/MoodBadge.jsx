import { getMood } from '../utils/moods';

/** Small pill showing an entry's mood. */
export default function MoodBadge({ mood, size = 'sm', showLabel = true }) {
  const m = getMood(mood);
  const isLarge = size === 'lg';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        isLarge ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ backgroundColor: m.soft, color: '#5B4A46' }}
      title={m.label}
    >
      <span aria-hidden="true" className={isLarge ? 'text-base' : 'text-sm'}>
        {m.emoji}
      </span>
      {showLabel && <span>{m.label}</span>}
      {!showLabel && <span className="sr-only">{m.label}</span>}
    </span>
  );
}

/** Just the coloured dot — used in the calendar and week strip. */
export function MoodDot({ mood, size = 8, className = '' }) {
  const m = getMood(mood);
  return (
    <span
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: m.color }}
      title={m.label}
      aria-hidden="true"
    />
  );
}
