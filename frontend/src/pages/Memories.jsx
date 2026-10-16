import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Star, CalendarDays } from 'lucide-react';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonGrid } from '../components/Loading';
import useJournals from '../hooks/useJournals';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { toDateInput, formatLongDate } from '../utils/format';

const TABS = [
  { id: 'on-this-day', label: 'On This Day', icon: Sparkles },
  { id: 'favorites', label: 'Favorites', icon: Star },
];

/** The "On This Day" tab — past entries written on this same calendar day. */
function OnThisDay() {
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState(toDateInput());
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    journalService
      .onThisDay({ date: selectedDate })
      .then((res) => active && setMemories(res.data.entries || []))
      .catch((err) => {
        if (!active) return;
        toast.error(getErrorMessage(err));
        setMemories([]);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const displayDateStr = formatLongDate(selectedDate);

  const toggleFavorite = async (entry) => {
    const next = !entry.isFavorite;
    setMemories((list) => list.map((e) => (e._id === entry._id ? { ...e, isFavorite: next } : e)));
    try {
      await journalService.toggleFavorite(entry._id, next);
      toast.success(next ? 'Added to favourites' : 'Removed from favourites');
    } catch (err) {
      setMemories((list) => list.map((e) => (e._id === entry._id ? { ...e, isFavorite: !next } : e)));
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl border p-2.5"
        style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--surface-alt))' }}
      >
        <CalendarDays size={16} style={{ color: 'rgb(var(--accent))' }} className="ml-1 shrink-0" />
        <input
          type="date"
          value={selectedDate}
          max={toDateInput()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="cursor-pointer bg-transparent text-sm font-medium outline-none"
          style={{ color: 'rgb(var(--heading))' }}
        />
        {selectedDate !== toDateInput() && (
          <button
            type="button"
            onClick={() => setSelectedDate(toDateInput())}
            className="px-1 text-xs font-medium hover:underline"
            style={{ color: 'rgb(var(--accent))' }}
          >
            Today
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : memories.length > 0 ? (
        <div className="space-y-4">
          <p className="muted text-sm font-medium">
            Found {memories.length} {memories.length === 1 ? 'memory' : 'memories'} for{' '}
            <span style={{ color: 'rgb(var(--heading))' }}>{displayDateStr}</span>
          </p>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {memories.map((entry) => (
              <div key={entry._id} className="relative">
                <span
                  className="absolute -top-2.5 right-4 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-paper"
                  style={{ backgroundColor: 'rgb(var(--accent))', color: '#4A3038' }}
                >
                  {entry.timeAgo || 'Past Memory'}
                </span>
                <JournalCard entry={entry} showMenu onToggleFavorite={toggleFavorite} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No memories found for this date."
          description={`You haven't written any entries on ${displayDateStr} in previous years yet.`}
          actionLabel="Write today's story"
          actionTo="/journal/new"
          compact
        />
      )}
    </div>
  );
}

/** The "Favorites" tab — entries you've starred. */
function Favorites() {
  const toast = useToast();
  const filters = useMemo(() => ({ favorite: 'true', limit: 30, sort: 'newest' }), []);
  const { entries, loading, removeEntry } = useJournals(filters);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /** Un-favouriting here removes the card from the list. */
  const removeFavorite = async (entry) => {
    removeEntry(entry._id);
    try {
      await journalService.toggleFavorite(entry._id, false);
      toast.success('Removed from favourites');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await journalService.remove(pendingDelete._id);
      removeEntry(pendingDelete._id);
      toast.success('Journal entry deleted successfully');
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {loading ? (
        <SkeletonGrid count={3} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorite memories yet."
          description="Tap the star on any entry and it will wait for you here."
          actionLabel="Browse your journal"
          actionTo="/journal"
          compact
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <JournalCard key={entry._id} entry={entry} onToggleFavorite={removeFavorite} onDelete={setPendingDelete} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this entry?"
        message={`"${pendingDelete?.title || 'This entry'}" will be gone for good. This cannot be undone.`}
        confirmLabel="Delete entry"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </div>
  );
}

/**
 * Memory Lane and Favorites, joined into one page with a tab switcher —
 * both are "entries worth looking back at", just surfaced two different
 * ways (by date vs. manually starred), so they share one place in the
 * sidebar instead of two. `?tab=favorites` deep-links to a tab directly;
 * the old /memory-lane and /favorites routes redirect here (see App.jsx).
 */
export default function Memories() {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get('tab') === 'favorites' ? 'favorites' : 'on-this-day';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">Memories</h1>
        <p className="muted mt-1 text-sm">Entries worth looking back at — on this day, and the ones you starred.</p>
      </header>

      <div
        role="tablist"
        aria-label="Memories"
        className="inline-flex gap-1 rounded-full border p-1"
        style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--surface))' }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setParams(tab.id === 'on-this-day' ? {} : { tab: tab.id })}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? 'rgb(var(--accent))' : 'transparent',
                color: active ? '#4A3038' : 'rgb(var(--text-muted))',
              }}
            >
              <tab.icon size={14} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'on-this-day' ? <OnThisDay /> : <Favorites />}
    </div>
  );
}
