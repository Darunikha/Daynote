import { Ban } from 'lucide-react';
import { DECORATIONS } from '../utils/decorations';

/**
 * Row of scrapbook-charm swatches, in the same spirit as MoodSelector: a
 * radiogroup of preview tiles so someone can see and pick a decoration for
 * this entry, including "None" for a clean card.
 */
export default function DecorationPicker({ value = 'none', onChange, className = '' }) {
  return (
    <div
      role="radiogroup"
      aria-label="Card decoration"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {DECORATIONS.map((d) => {
        const active = value === d.value;
        return (
          <button
            key={d.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? 'none' : d.value)}
            className="group flex w-[58px] flex-col items-center gap-1.5 rounded-xl px-1.5 py-2 transition-all duration-200"
            style={{
              backgroundColor: active ? 'rgb(var(--accent-soft))' : 'transparent',
              boxShadow: active ? 'inset 0 0 0 1px rgb(var(--accent) / 0.4)' : 'none',
            }}
          >
            <span
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-hover:-translate-y-0.5"
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
  );
}
