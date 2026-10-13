import { useEffect, useRef, useState } from 'react';
import { Moon } from 'lucide-react';
import { formatTime12h } from '../utils/sleep';

// Every half hour, the whole day — one list, one tap, done. (24h × 2 = 48
// options short enough to scroll through at a glance; a bedtime rarely
// needs finer than that.)
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

/**
 * A custom time picker, standing in for `<input type="time">` — the
 * native picker (a bare scroll-wheel list) can't be restyled with CSS at
 * all, in any browser, so matching the app's soft/cute look means
 * replacing it rather than theming it.
 *
 * One scrollable list of ready-made times (half-hour steps) rather than
 * separate hour/minute/AM-PM dials — picking a time is one tap on the
 * option you want, not coordinating three columns. Opening it
 * auto-scrolls to whatever time is already set.
 */
export default function TimePicker({ value, onChange, label, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeRef = useRef(null);

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

  useEffect(() => {
    if (open) activeRef.current?.scrollIntoView({ block: 'center' });
  }, [open]);

  const pick = (time) => {
    onChange(time);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label htmlFor={id} className="label !mb-1 !text-[11px]">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="input flex items-center justify-between !py-2 !text-sm"
      >
        <span style={{ color: 'rgb(var(--heading))' }}>{formatTime12h(value)}</span>
        <Moon size={14} style={{ color: 'rgb(var(--accent))' }} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label || 'Pick a time'}
          className="card absolute left-0 top-[calc(100%+6px)] z-30 w-[148px] animate-fade-up overflow-hidden p-2 shadow-paper-lg"
        >
          <div className="mb-1 flex items-center gap-1.5 px-1">
            <Moon size={11} style={{ color: 'rgb(var(--accent))' }} aria-hidden="true" />
            <span className="muted text-[10px] font-medium uppercase tracking-wide">Pick a time</span>
          </div>
          <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
            {TIMES.map((t) => {
              const isActive = t === value;
              return (
                <button
                  key={t}
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  onClick={() => pick(t)}
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive ? 'rgb(var(--accent-soft))' : 'transparent',
                    color: isActive ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))',
                  }}
                >
                  {formatTime12h(t)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
