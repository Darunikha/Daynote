import { MOODS } from '../utils/moods';

/**
 * Row of soft mood buttons. Rendered as a radio group so it is fully
 * keyboard accessible.
 */
export default function MoodSelector({ value, onChange, size = 'md', className = '' }) {
  const compact = size === 'sm';

  return (
    <div
      role="radiogroup"
      aria-label="How are you feeling?"
      className={`flex flex-wrap gap-2 sm:gap-3 ${className}`}
    >
      {MOODS.map((mood) => {
        const active = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? '' : mood.value)}
            className={`group flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition-all duration-200 ${
              compact ? 'w-[62px]' : 'w-[72px]'
            }`}
            style={{
              backgroundColor: active ? mood.soft : 'transparent',
              boxShadow: active ? `inset 0 0 0 1px ${mood.color}66` : 'none',
            }}
          >
            <span
              className={`flex items-center justify-center rounded-full transition-transform duration-200 group-hover:-translate-y-0.5 ${
                compact ? 'h-9 w-9 text-lg' : 'h-11 w-11 text-xl'
              }`}
              style={{
                backgroundColor: mood.soft,
                boxShadow: active
                  ? `0 0 0 2px ${mood.color}`
                  : `inset 0 0 0 1px ${mood.color}55`,
              }}
              aria-hidden="true"
            >
              {mood.emoji}
            </span>
            <span
              className="text-[11px] font-medium leading-none"
              style={{ color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
