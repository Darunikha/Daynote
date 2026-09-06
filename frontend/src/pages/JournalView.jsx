import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Star, Clock } from 'lucide-react';
import MoodBadge from '../components/MoodBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonLines } from '../components/Loading';
import { Flower } from '../components/Botanical';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatLongDate, toParagraphs, readingTime } from '../utils/format';

export default function JournalView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    journalService
      .get(id)
      .then((res) => active && setEntry(res.data.entry))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  const toggleFavorite = async () => {
    const next = !entry.isFavorite;
    setEntry((e) => ({ ...e, isFavorite: next }));
    try {
      await journalService.toggleFavorite(id, next);
      toast.success(next ? 'Added to favourites' : 'Removed from favourites');
    } catch (err) {
      setEntry((e) => ({ ...e, isFavorite: !next }));
      toast.error(getErrorMessage(err));
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await journalService.remove(id);
      toast.success('Journal entry deleted successfully');
      navigate('/journal', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="card mx-auto max-w-3xl space-y-5 p-6 sm:p-10">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-8 w-2/3" />
        <SkeletonLines lines={6} />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <h1 className="mb-2 font-serif text-xl">We could not find that entry</h1>
        <p className="muted mb-6 text-sm">{error || 'It may have been deleted.'}</p>
        <Link to="/journal" className="btn btn-primary">
          Back to my journal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Actions bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="muted inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors hover:text-[rgb(var(--heading))]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={entry.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={entry.isFavorite}
            className="rounded-full border p-2 transition-colors hover:bg-[rgb(var(--accent-soft))]"
          >
            <Star
              size={16}
              style={{ color: entry.isFavorite ? '#E0A94E' : 'rgb(var(--text-muted))' }}
              fill={entry.isFavorite ? '#E8C87C' : 'none'}
            />
          </button>

          <Link to={`/journal/${id}/edit`} className="btn btn-ghost !px-4 !py-2 text-sm">
            <Pencil size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="btn btn-danger !px-4 !py-2 text-sm"
          >
            <Trash2 size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* The entry itself */}
      <article className="card relative overflow-hidden p-6 sm:p-10">
        <Flower className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-[rgb(var(--accent))] opacity-25" />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <time
            dateTime={new Date(entry.date).toISOString()}
            className="muted text-xs font-medium uppercase tracking-wider"
          >
            {formatLongDate(entry.date)}
          </time>
          <MoodBadge mood={entry.mood} size="lg" />
          {entry.isDraft && (
            <span className="chip" style={{ color: 'rgb(var(--olive))' }}>
              Draft
            </span>
          )}
        </div>

        <h1 className="mb-4 break-words font-serif text-3xl leading-tight sm:text-4xl">
          {entry.title}
        </h1>

        <p className="muted mb-8 inline-flex items-center gap-1.5 text-xs">
          <Clock size={12} aria-hidden="true" />
          {readingTime(entry.content)} min read
        </p>

        {entry.imageUrl && (
          <img
            src={entry.imageUrl}
            alt=""
            className="mb-8 max-h-[420px] w-full rounded-2xl object-cover"
          />
        )}

        <div className="prose-journal max-w-[68ch] text-[15px] sm:text-base" style={{ color: 'rgb(var(--text))' }}>
          {toParagraphs(entry.content).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {entry.tags?.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2 border-t pt-6">
            {entry.tags.map((tag) => (
              <li key={tag}>
                <Link
                  to={`/journal?tag=${encodeURIComponent(tag)}`}
                  className="chip transition-colors hover:text-[rgb(var(--heading))]"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this entry?"
        message={`"${entry.title}" will be gone for good. This cannot be undone.`}
        confirmLabel="Delete entry"
        onConfirm={remove}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  );
}
