import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Star, Clock, Lock, Unlock, KeyRound, Hourglass, Volume2, Sparkles, Mic } from 'lucide-react';
import MoodBadge from '../components/MoodBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import PasswordModal from '../components/PasswordModal';
import { SkeletonLines } from '../components/Loading';
import { Flower } from '../components/Botanical';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatLongDate, toParagraphs, readingTime } from '../utils/format';
import { getPaperBackground } from '../utils/paperStyles';
import EntryCharm from '../components/EntryCharm';

export default function JournalView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [entry, setEntry] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Password Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('unlock'); // 'unlock' | 'lock' | 'remove'
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchEntry = (password = '') => {
    setLoading(true);
    journalService
      .get(id, password)
      .then((res) => {
        setEntry(res.data.entry);
        setIsUnlocked(res.data.isUnlocked ?? !res.data.entry.isLocked);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEntry();
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

  const handleModalSubmit = async (password) => {
    setModalLoading(true);
    setModalError('');

    try {
      if (modalMode === 'unlock') {
        const res = await journalService.unlock(id, password);
        setEntry(res.data.entry);
        setIsUnlocked(true);
        setModalOpen(false);
        toast.success('Entry unlocked');
      } else if (modalMode === 'lock') {
        const res = await journalService.lock(id, password);
        setEntry(res.data.entry);
        setIsUnlocked(true);
        setModalOpen(false);
        toast.success('Entry locked with password');
      } else if (modalMode === 'remove') {
        const res = await journalService.removeLock(id, password);
        setEntry(res.data.entry);
        setIsUnlocked(true);
        setModalOpen(false);
        toast.success('Lock removed from entry');
      }
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setModalLoading(false);
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

  const isLockedView = entry.isLocked && !isUnlocked;
  const isCapsuleLocked = Boolean(entry.isCapsuleLocked);

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
          {/* Lock / Unlock button */}
          {entry.isLocked ? (
            <button
              type="button"
              onClick={() => {
                if (isLockedView) {
                  setModalMode('unlock');
                } else {
                  setModalMode('remove');
                }
                setModalError('');
                setModalOpen(true);
              }}
              className="btn btn-ghost !px-3.5 !py-2 text-sm"
              title={isLockedView ? 'Unlock Entry' : 'Remove Password Lock'}
            >
              {isLockedView ? <Lock size={14} /> : <Unlock size={14} />}
              <span className="hidden sm:inline">
                {isLockedView ? 'Unlock' : 'Remove Lock'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setModalMode('lock');
                setModalError('');
                setModalOpen(true);
              }}
              className="btn btn-ghost !px-3.5 !py-2 text-sm"
              title="Lock Entry with Password"
            >
              <KeyRound size={14} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          )}

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

          {!isLockedView && !isCapsuleLocked && (
            <Link to={`/journal/${id}/edit`} className="btn btn-ghost !px-4 !py-2 text-sm">
              <Pencil size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
          )}

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
      <div className="relative">
        <EntryCharm value={entry.decoration} />
        <article
          className="card relative overflow-hidden p-6 sm:p-10"
          style={getPaperBackground(entry.paperStyle)}
        >
        <Flower className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-[rgb(var(--accent))] opacity-25" />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <time
            dateTime={new Date(entry.date).toISOString()}
            className="muted text-xs font-medium uppercase tracking-wider"
          >
            {formatLongDate(entry.date)}
          </time>
          <MoodBadge mood={entry.mood} size="lg" />
          {entry.isTimeCapsule && (
            <span
              className="chip inline-flex items-center gap-1 font-medium"
              style={{
                color: isCapsuleLocked ? '#D97706' : '#059669',
                backgroundColor: isCapsuleLocked ? 'rgba(217, 119, 6, 0.12)' : 'rgba(5, 150, 105, 0.12)',
              }}
            >
              <Hourglass size={12} /> {isCapsuleLocked ? 'Sealed Time Capsule' : 'Unlocked Time Capsule'}
            </span>
          )}
          {entry.audioUrl && !isCapsuleLocked && (
            <span
              className="chip inline-flex items-center gap-1 font-medium"
              style={{ color: '#0284C7', backgroundColor: 'rgba(2, 132, 199, 0.12)' }}
            >
              <Mic size={12} /> Voice Note
            </span>
          )}
          {entry.isDraft && (
            <span className="chip" style={{ color: 'rgb(var(--olive))' }}>
              Draft
            </span>
          )}
          {entry.isLocked && (
            <span
              className="chip inline-flex items-center gap-1"
              style={{ color: 'rgb(var(--brandy))', backgroundColor: 'rgb(var(--brandy) / 0.1)' }}
            >
              <Lock size={12} /> Password Protected
            </span>
          )}
        </div>

        <h1 className="mb-4 break-words font-serif text-3xl leading-tight sm:text-4xl">
          {entry.title}
        </h1>

        {isCapsuleLocked ? (
          <div className="my-8 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/40 p-8 text-center shadow-sm space-y-3">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shadow">
              <Hourglass size={28} />
            </span>
            <h2 className="font-serif text-xl text-amber-900 dark:text-amber-100">
              Sealed Time Capsule
            </h2>
            <p className="text-sm text-amber-800 dark:text-amber-300 max-w-md mx-auto leading-relaxed">
              This journal entry was sealed on purpose. Its content, images, and audio recordings will unlock on{' '}
              <strong className="font-semibold underline">
                {entry.unlockDate ? formatLongDate(entry.unlockDate) : 'its target date'}
              </strong>.
            </p>
          </div>
        ) : isLockedView ? (
          <div className="my-8 rounded-2xl border border-dashed p-8 text-center" style={{ backgroundColor: 'rgb(var(--surface-alt))' }}>
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--accent-soft))] text-[rgb(var(--heading))]">
              <Lock size={22} />
            </span>
            <h2 className="mb-1 font-serif text-lg">This Entry is Locked</h2>
            <p className="muted mb-6 text-sm">
              Please enter the password to view this journal entry.
            </p>
            <button
              type="button"
              onClick={() => {
                setModalMode('unlock');
                setModalError('');
                setModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Unlock size={15} /> Unlock Entry
            </button>
          </div>
        ) : (
          <>
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

            {/* Voice Note & Transcript Audio Player */}
            {entry.audioUrl && (
              <div className="my-8 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70 p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">Attached Voice Note</h3>
                    <p className="text-xs text-stone-500">Audio playback</p>
                  </div>
                </div>

                <audio controls src={entry.audioUrl} className="w-full rounded-lg" />

                {entry.audioTranscript && (
                  <div className="mt-3 bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                    <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
                      <Sparkles size={14} /> Speech-to-Text Transcript
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed italic">
                      "{entry.audioTranscript}"
                    </p>
                  </div>
                )}
              </div>
            )}

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
          </>
        )}
        </article>
      </div>

      <PasswordModal
        open={modalOpen}
        mode={modalMode}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        loading={modalLoading}
        error={modalError}
      />

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

