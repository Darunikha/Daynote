import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonGrid } from '../components/Loading';
import useJournals from '../hooks/useJournals';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Favorites() {
  const toast = useToast();
  const filters = useMemo(() => ({ favorite: 'true', limit: 30, sort: 'newest' }), []);
  const { entries, loading, removeEntry } = useJournals(filters);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /** Un-favouriting on this page removes the card from the list. */
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
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">Favorites</h1>
        <p className="muted mt-1 text-sm">The entries you wanted to keep close.</p>
      </header>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorite memories yet."
          description="Tap the star on any entry and it will wait for you here."
          actionLabel="Browse your journal"
          actionTo="/journal"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              onToggleFavorite={removeFavorite}
              onDelete={setPendingDelete}
            />
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
