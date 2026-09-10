import { Link } from 'react-router-dom';
import { Star, MoreVertical, Pencil, Trash2, BookOpen, Lock, Hourglass, Mic } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MoodBadge from './MoodBadge';
import { relativeDay, excerpt } from '../utils/format';

/**
 * A single page from the notebook. `variant="feature"` renders the larger
 * "Today's Journal" card, `variant="mini"` the compact recent-entry card.
 */
export default function JournalCard({
  entry,
  variant = 'default',
  onToggleFavorite,
  onDelete,
  showMenu = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const isFeature = variant === 'feature';
  const isMini = variant === 'mini';

  return (
    <article
      className={`card card-hover group relative flex overflow-hidden ${
        isMini ? 'flex-col p-4' : 'flex-col p-5 sm:p-6'
      }`}
    >
      {/* Header row: date + actions */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <time
          dateTime={new Date(entry.date).toISOString()}
          className="muted text-[11px] font-medium uppercase tracking-wider"
        >
          {relativeDay(entry.date)}
        </time>

        <div className="flex shrink-0 items-center gap-1 flex-wrap justify-end">
          {entry.isTimeCapsule && (
            <span
              className="chip !py-0.5 !text-[10px] inline-flex items-center gap-1"
              style={{
                color: entry.isCapsuleLocked ? '#D97706' : '#059669',
                backgroundColor: entry.isCapsuleLocked ? 'rgba(217, 119, 6, 0.12)' : 'rgba(5, 150, 105, 0.12)',
              }}
              title={entry.isCapsuleLocked ? 'Sealed Time Capsule' : 'Unlocked Time Capsule'}
            >
              <Hourglass size={10} aria-hidden="true" />
              {entry.isCapsuleLocked ? 'Sealed' : 'Capsule'}
            </span>
          )}

          {entry.audioUrl && (
            <span
              className="chip !py-0.5 !text-[10px] inline-flex items-center gap-1"
              style={{ color: '#0284C7', backgroundColor: 'rgba(2, 132, 199, 0.12)' }}
              title="Voice Note Attached"
            >
              <Mic size={10} aria-hidden="true" />
              Voice
            </span>
          )}

          {entry.isLocked && (
            <span
              className="chip !py-0.5 !text-[10px] inline-flex items-center gap-1"
              style={{ color: 'rgb(var(--brandy))', backgroundColor: 'rgb(var(--brandy) / 0.1)' }}
              title="Password Protected"
            >
              <Lock size={10} aria-hidden="true" />
              Locked
            </span>
          )}

          {entry.isDraft && (
            <span className="chip !py-0.5 !text-[10px]" style={{ color: 'rgb(var(--olive))' }}>
              Draft
            </span>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(entry)}
              aria-label={entry.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
              aria-pressed={entry.isFavorite}
              className="rounded-full p-1.5 transition-colors hover:bg-[rgb(var(--accent-soft))]"
            >
              <Star
                size={15}
                style={{ color: entry.isFavorite ? '#E0A94E' : 'rgb(var(--text-muted))' }}
                fill={entry.isFavorite ? '#E8C87C' : 'none'}
              />
            </button>
          )}

          {showMenu && (onDelete || true) && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Entry options"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="muted rounded-full p-1.5 transition-colors hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--heading))]"
              >
                <MoreVertical size={15} />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="card absolute right-0 top-9 z-20 w-40 animate-fade-up overflow-hidden !rounded-xl p-1 shadow-paper-lg"
                >
                  <Link
                    to={`/journal/${entry._id}`}
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[rgb(var(--surface-alt))]"
                  >
                    <BookOpen size={14} /> Read
                  </Link>
                  <Link
                    to={`/journal/${entry._id}/edit`}
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[rgb(var(--surface-alt))]"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(entry);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[rgb(var(--surface-alt))]"
                      style={{ color: 'rgb(var(--brandy))' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <Link to={`/journal/${entry._id}`} className="flex flex-1 flex-col focus:outline-none">
        <div className={isMini ? '' : 'flex flex-col gap-4 sm:flex-row-reverse sm:items-start'}>
          {entry.imageUrl && !entry.isLocked && (
            <img
              src={entry.imageUrl}
              alt=""
              loading="lazy"
              className={`w-full shrink-0 rounded-xl object-cover ${
                isFeature ? 'h-44 sm:h-40 sm:w-56' : 'h-32 sm:h-24 sm:w-28'
              }`}
            />
          )}

          <div className="min-w-0 flex-1">
            <h3
              className={`mb-1.5 break-words font-serif transition-colors group-hover:text-[rgb(var(--brandy))] ${
                isFeature ? 'text-xl sm:text-2xl' : isMini ? 'text-[15px]' : 'text-lg'
              }`}
            >
              {entry.title || 'Untitled entry'}
            </h3>

            <p
              className={`muted text-sm leading-relaxed ${
                isFeature ? 'line-clamp-4' : isMini ? 'line-clamp-2' : 'line-clamp-3'
              }`}
            >
              {entry.isLocked ? (
                <span className="inline-flex items-center gap-1.5 font-medium italic opacity-75">
                  <Lock size={13} /> This entry is password protected.
                </span>
              ) : (
                excerpt(entry.content, isFeature ? 260 : 130)
              )}
            </p>
          </div>
        </div>
      </Link>

      {/* Footer: mood + tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <MoodBadge mood={entry.mood} showLabel={!isMini} />
        {!isMini &&
          entry.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">
              #{tag}
            </span>
          ))}
        {!isMini && entry.tags?.length > 3 && (
          <span className="muted text-xs">+{entry.tags.length - 3}</span>
        )}
      </div>
    </article>
  );
}

