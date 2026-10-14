import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * A custom dropdown, standing in for a native `<select>` — the native
 * dropdown list can't be restyled with CSS at all, in any browser, so
 * matching the app's soft/cute look means replacing it rather than
 * theming it (same reasoning as TimePicker replacing `<input type="time">`).
 *
 * `options` is `[{ value, label, Icon? }]`. When an option has an `Icon`
 * (a mood's illustrated SVG component, say), it's shown next to the label
 * both in the trigger and in the list.
 */
export default function Dropdown({ id, label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="input flex items-center justify-between !py-2.5 text-left"
      >
        <span className="flex items-center gap-2 truncate" style={{ color: current ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}>
          {current?.Icon && (
            <span className="h-5 w-5 shrink-0" aria-hidden="true">
              <current.Icon className="h-full w-full" />
            </span>
          )}
          {current?.label || placeholder}
        </span>
        <ChevronDown
          size={14}
          style={{ color: 'rgb(var(--text-muted))' }}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label || placeholder}
          className="card absolute left-0 top-[calc(100%+6px)] z-30 max-h-64 w-full min-w-[180px] animate-fade-up overflow-y-auto p-1.5 shadow-paper-lg"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => pick(o.value)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
                  style={{ backgroundColor: active ? 'rgb(var(--accent-soft))' : 'transparent', color: active ? 'rgb(var(--heading))' : 'rgb(var(--text))' }}
                >
                  {o.Icon && (
                    <span className="h-5 w-5 shrink-0" aria-hidden="true">
                      <o.Icon className="h-full w-full" />
                    </span>
                  )}
                  <span className="flex-1 truncate">{o.label}</span>
                  {active && <Check size={13} style={{ color: 'rgb(var(--accent))' }} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
