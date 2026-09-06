import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

const ACCENTS = {
  success: 'rgb(var(--olive))',
  error: 'rgb(var(--brandy))',
  info: 'rgb(var(--accent))',
};

/** Rendered once by ToastProvider; individual toasts are pushed via useToast(). */
export default function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:top-6 sm:bottom-auto sm:items-end"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(({ id, message, type }) => {
        const Icon = ICONS[type] || Info;
        return (
          <div
            key={id}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex w-full max-w-sm animate-slide-in-right items-start gap-3 rounded-xl border px-4 py-3 shadow-paper-lg"
            style={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
              borderLeft: `3px solid ${ACCENTS[type] || ACCENTS.info}`,
            }}
          >
            <Icon size={18} className="mt-0.5 shrink-0" style={{ color: ACCENTS[type] }} />
            <p className="flex-1 text-sm leading-relaxed" style={{ color: 'rgb(var(--text))' }}>
              {message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(id)}
              aria-label="Dismiss notification"
              className="muted shrink-0 rounded-md p-0.5 transition-colors hover:text-[rgb(var(--heading))]"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
