import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from './Loading';

/**
 * Accessible confirmation modal: traps focus, closes on Escape, and fits
 * comfortably on small screens.
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Keep it',
  onConfirm,
  onCancel,
  loading = false,
  tone = 'danger',
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.();
    };
    document.addEventListener('keydown', onKey);

    const previouslyFocused = document.activeElement;
    confirmRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open, onCancel, loading]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-[rgb(31,29,29)]/40 backdrop-blur-[2px]"
        onClick={() => !loading && onCancel?.()}
        aria-hidden="true"
      />

      <div className="card relative w-full max-w-md animate-fade-up p-6 shadow-paper-lg">
        <span
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            backgroundColor: tone === 'danger' ? 'rgb(var(--brandy) / 0.1)' : 'rgb(var(--accent-soft))',
            color: tone === 'danger' ? 'rgb(var(--brandy))' : 'rgb(var(--heading))',
          }}
        >
          <AlertTriangle size={20} aria-hidden="true" />
        </span>

        <h2 id="confirm-title" className="mb-2 font-serif text-lg">
          {title}
        </h2>
        {message && <p className="muted mb-6 text-sm leading-relaxed">{message}</p>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={tone === 'danger' ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Spinner size={15} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
