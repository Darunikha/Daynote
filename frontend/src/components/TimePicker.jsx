import { useEffect, useRef, useState } from 'react';
import { Moon } from 'lucide-react';
import { formatTime12h } from '../utils/sleep';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // :00, :05 … :55 — plenty precise for a bedtime

const to24 = (h12, m, period) => {
  let h = h12 % 12;
  if (period === 'PM') h += 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const from24 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return { h12: h % 12 || 12, m, period };
};

/** One scrollable column of pill options, used for hour/minute/AM-PM. */
function Column({ items, active, onPick, pad }) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div className="flex max-h-44 flex-1 flex-col gap-0.5 overflow-y-auto">
      {items.map((it) => {
        const isActive = it === active;
        return (
          <button
            key={it}
            ref={isActive ? activeRef : undefined}
            type="button"
            onClick={() => onPick(it)}
            className="shrink-0 rounded-lg px-2 py-1.5 text-center text-sm font-medium transition-colors"
            style={{
              backgroundColor: isActive ? 'rgb(var(--accent-soft))' : 'transparent',
              color: isActive ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))',
            }}
          >
            {pad ? String(it).padStart(2, '0') : it}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A custom time picker, standing in for `<input type="time">` — the
 * native picker (a bare scroll-wheel list) can't be restyled with CSS at
 * all, in any browser, so matching the app's soft/cute look means
 * replacing it rather than theming it.
 *
 * Works in 5-minute steps rather than 1-minute — a bedtime/wake time
 * rarely needs more precision than that, and it keeps the minute column
 * the same comfortable length as the hour column instead of a 60-item list.
 */
export default function TimePicker({ value, onChange, label, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { h12, m, period } = from24(value);
  const mRounded = (Math.round(m / 5) * 5) % 60;

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

  const set = (patch) => {
    const next = { h12, m: mRounded, period, ...patch };
    onChange(to24(next.h12, next.m, next.period));
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
          className="card absolute left-0 top-[calc(100%+6px)] z-30 w-[188px] animate-fade-up overflow-hidden p-2.5 shadow-paper-lg"
        >
          <div className="mb-1.5 flex items-center gap-1.5 px-0.5">
            <Moon size={11} style={{ color: 'rgb(var(--accent))' }} aria-hidden="true" />
            <span className="muted text-[10px] font-medium uppercase tracking-wide">Pick a time</span>
          </div>
          <div className="flex gap-1">
            <Column items={HOURS} active={h12} onPick={(v) => set({ h12: v })} />
            <Column items={MINUTES} active={mRounded} onPick={(v) => set({ m: v })} pad />
            <Column items={['AM', 'PM']} active={period} onPick={(v) => set({ period: v })} />
          </div>
        </div>
      )}
    </div>
  );
}
