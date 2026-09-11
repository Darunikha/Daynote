import { useState } from 'react';
import { Check } from 'lucide-react';
import { PAPER_CATEGORIES, PAPER_STYLES, getPaperBackground, getPaperStyleMeta } from '../utils/paperStyles';

/** Small preview tile showing the actual pattern, used both in the grid and as the "current style" chip. */
function Swatch({ value, size = 44 }) {
  const isPlain = value === 'plain';
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 rounded-lg border"
      style={{
        width: size,
        height: size,
        borderStyle: isPlain ? 'dashed' : 'solid',
        borderColor: isPlain ? 'rgb(var(--text-muted) / 0.4)' : 'rgb(var(--border))',
        ...getPaperBackground(value),
      }}
    >
      {isPlain && (
        <span
          className="absolute inset-2 rounded-sm"
          style={{ border: '1px solid rgb(var(--text-muted) / 0.25)' }}
        />
      )}
    </span>
  );
}

/**
 * Categorized grid of paper-style swatches. Click a tile to preview + select
 * it immediately — the parent owns `value`/`onChange` just like MoodSelector.
 */
export default function PaperStylePicker({ value = 'plain', onChange }) {
  const [activeCategory, setActiveCategory] = useState(PAPER_CATEGORIES[0].id);
  const current = getPaperStyleMeta(value);
  const none = PAPER_STYLES[0];

  return (
    <div className="space-y-3">
      {/* Currently selected style */}
      <div
        className="flex items-center gap-3 rounded-xl border p-2.5"
        style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--surface-alt))' }}
      >
        <Swatch value={value} />
        <div className="min-w-0">
          <p className="muted text-[10px] uppercase tracking-wider">Current style</p>
          <p className="truncate text-sm font-medium" style={{ color: 'rgb(var(--heading))' }}>
            {current.label}
          </p>
        </div>
      </div>

      {/* None / Plain Paper — always visible, outside the categories */}
      <button
        type="button"
        onClick={() => onChange(none.value)}
        aria-pressed={value === none.value}
        className="flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors"
        style={{
          borderColor: value === none.value ? 'rgb(var(--accent))' : 'rgb(var(--border))',
          backgroundColor: value === none.value ? 'rgb(var(--accent-soft))' : 'transparent',
        }}
      >
        <Swatch value={none.value} size={32} />
        <span className="flex-1 text-xs font-medium" style={{ color: 'rgb(var(--heading))' }}>
          {none.label}
        </span>
        {value === none.value && <Check size={14} style={{ color: 'rgb(var(--accent))' }} />}
      </button>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Paper style categories"
        className="flex gap-1 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {PAPER_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCategory(cat.id)}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: active ? 'rgb(var(--accent-soft))' : 'transparent',
                color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))',
                boxShadow: active ? 'inset 0 -2px 0 rgb(var(--accent))' : 'none',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Swatch grid for the active category */}
      <div
        role="radiogroup"
        aria-label={PAPER_CATEGORIES.find((c) => c.id === activeCategory)?.label}
        className="grid max-h-64 grid-cols-3 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-4"
      >
        {PAPER_CATEGORIES.find((c) => c.id === activeCategory)?.styles.map((id) => {
          const meta = getPaperStyleMeta(id);
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className="group flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors"
              style={{
                backgroundColor: active ? 'rgb(var(--accent-soft))' : 'transparent',
              }}
            >
              <span className="relative">
                <Swatch value={id} size={52} />
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
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
