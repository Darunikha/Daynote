import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * A compact trigger button that opens a floating panel below it — used to
 * tuck a bulkier picker (paper style, decoration) behind a small toolbar
 * button instead of letting it take up permanent page space.
 */
export default function PopoverPanel({ label, valueLabel, preview, children, panelClassName = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border py-1.5 pl-2 pr-3 text-xs transition-colors hover:bg-[rgb(var(--surface-alt))]"
        style={{ borderColor: 'rgb(var(--border))' }}
      >
        {preview}
        <span className="flex flex-col items-start leading-tight">
          <span
            className="text-[9px] font-medium uppercase tracking-wide"
            style={{ color: 'rgb(var(--text-muted))' }}
          >
            {label}
          </span>
          <span className="max-w-[100px] truncate font-medium" style={{ color: 'rgb(var(--heading))' }}>
            {valueLabel}
          </span>
        </span>
        <ChevronDown
          size={13}
          style={{ color: 'rgb(var(--text-muted))' }}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={`card absolute left-0 top-[calc(100%+8px)] z-30 max-h-[70vh] w-[320px] max-w-[calc(100vw-2rem)] animate-fade-up overflow-y-auto p-4 shadow-paper-lg ${panelClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
