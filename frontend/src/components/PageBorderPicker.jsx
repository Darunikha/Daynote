import { Check, Ban } from 'lucide-react';
import { PAGE_BORDERS, getPageBorder } from '../utils/pageBorders';
import PageBorderFrame from './PageBorderFrame';

/** Small preview tile — the actual border art, shrunk onto a swatch-sized card. */
function Swatch({ value, size = 52 }) {
  const meta = getPageBorder(value);
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 overflow-hidden rounded-lg border"
      style={{
        width: size,
        height: size,
        borderStyle: meta.color ? 'solid' : 'dashed',
        borderColor: meta.color ? 'rgb(var(--border))' : 'rgb(var(--text-muted) / 0.4)',
        backgroundColor: 'rgb(var(--surface))',
      }}
    >
      {meta.color ? <PageBorderFrame value={value} /> : <Ban size={16} className="absolute inset-0 m-auto" style={{ color: 'rgb(var(--text-muted))' }} />}
    </span>
  );
}

/**
 * A simple grid of border swatches — only a handful of designs, so unlike
 * PaperStylePicker there's no need for category tabs. Click a tile to
 * preview + select it immediately, same pattern as the other pickers.
 */
export default function PageBorderPicker({ value = 'none', onChange }) {
  const current = getPageBorder(value);

  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3 rounded-xl border p-2.5"
        style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--surface-alt))' }}
      >
        <Swatch value={value} />
        <div className="min-w-0">
          <p className="muted text-[10px] uppercase tracking-wider">Current border</p>
          <p className="truncate text-sm font-medium" style={{ color: 'rgb(var(--heading))' }}>
            {current.label}
          </p>
        </div>
      </div>

      <div role="radiogroup" aria-label="Page border" className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {PAGE_BORDERS.map((b) => {
          const active = value === b.value;
          return (
            <button
              key={b.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(b.value)}
              className="group flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors"
              style={{ backgroundColor: active ? 'rgb(var(--accent-soft))' : 'transparent' }}
            >
              <span className="relative">
                <Swatch value={b.value} />
                {active && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgb(var(--accent))', color: '#4A3038' }}
                  >
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </span>
              <span
                className="text-center text-[10px] leading-tight transition-colors"
                style={{ color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}
              >
                {b.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
