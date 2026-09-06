/** Small spinner used inside buttons and on route transitions. */
export function Spinner({ size = 18, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

/** Full-page loader shown while the session is being restored. */
export function PageLoader({ label = 'Loading your journal…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status">
      <Spinner size={28} className="text-[rgb(var(--accent))]" />
      <p className="muted font-hand text-lg">{label}</p>
    </div>
  );
}

/** Skeleton placeholder shaped like a journal card. */
export function JournalCardSkeleton({ large = false }) {
  return (
    <div className={`card p-5 ${large ? 'sm:p-7' : ''}`} aria-hidden="true">
      <div className="skeleton mb-3 h-3 w-24" />
      <div className={`skeleton mb-4 ${large ? 'h-7 w-3/5' : 'h-5 w-2/3'}`} />
      <div className="space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-11/12" />
        {large && <div className="skeleton h-3 w-4/5" />}
      </div>
      <div className="mt-5 flex gap-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <JournalCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SkeletonLines({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton h-3" style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

export default PageLoader;
