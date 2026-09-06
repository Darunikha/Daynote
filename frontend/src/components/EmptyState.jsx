import { Link } from 'react-router-dom';
import { Sprout } from './Botanical';

/**
 * Gentle empty state used across the journal, favourites and search views.
 */
export default function EmptyState({
  title = "You haven't written anything yet.",
  description = 'Start capturing your thoughts today.',
  actionLabel,
  actionTo,
  onAction,
  icon: Icon,
  compact = false,
}) {
  return (
    <div
      className={`card flex flex-col items-center justify-center px-6 text-center ${
        compact ? 'py-10' : 'py-16'
      }`}
    >
      <span
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgb(var(--accent-soft))', color: 'rgb(var(--olive))' }}
      >
        {Icon ? <Icon size={26} aria-hidden="true" /> : <Sprout className="h-8 w-8" />}
      </span>

      <h3 className="mb-2 font-serif text-xl">{title}</h3>
      <p className="muted mb-6 max-w-sm text-sm leading-relaxed">{description}</p>

      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button type="button" onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
