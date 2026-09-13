import { Ban } from 'lucide-react';
import { DECORATIONS, MAX_DECORATIONS } from '../utils/decorations';

/**
 * Grid of scrapbook-charm swatches. Unlike MoodSelector this is a
 * multi-select: an entry can wear several charms at once, up to
 * MAX_DECORATIONS, and "None" clears the whole selection.
 */
export default function DecorationPicker({ values = [], onChange, className = '' }) {
  const atLimit = values.length >= MAX_DECORATIONS;

  const toggle = (value) => {
    if (value === 'none') {
      onChange([]);
      return;
    }
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else if (!atLimit) {
      onChange([...values, value]);
    }
  };

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Card decorations"
        className="flex flex-wrap gap-2"
      >
        {DECORATIONS.map((d) => {
          const active = d.value === 'none' ? values.length === 0 : values.includes(d.value);
          const disabled = d.value !== 'none' && !active && atLimit;
          return (
            <button
              key={d.value}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => toggle(d.value)}
              className="group flex w-[58px] flex-col items-center gap-1.5 rounded-xl px-1.5 py-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: active ? 'rgb(var(--accent-soft))' : 'transparent',
                boxShadow: active ? 'inset 0 0 0 1px rgb(var(--accent) / 0.4)' : 'none',
              }}
            >
              <span
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-enabled:group-hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'rgb(var(--surface-alt))',
                  boxShadow: active ? '0 0 0 2px rgb(var(--accent))' : 'inset 0 0 0 1px rgb(var(--border))',
                }}
              >
                {d.Charm ? (
                  <d.Charm className="h-6 w-6" />
                ) : (
                  <Ban size={16} style={{ color: 'rgb(var(--text-muted))' }} />
                )}
              </span>
              <span
                className="text-center text-[10px] font-medium leading-tight"
                style={{ color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}
              >
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="muted mt-3 text-[11px]">
        {values.length === 0
          ? `Pick up to ${MAX_DECORATIONS} charms, or leave it plain.`
          : `${values.length} of ${MAX_DECORATIONS} charms selected.`}
      </p>
    </div>
  );
}
