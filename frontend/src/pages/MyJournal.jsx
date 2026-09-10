import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, PenLine, X, SearchX } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import JournalCard from '../components/JournalCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonGrid } from '../components/Loading';
import useDebounce from '../hooks/useDebounce';
import useJournals from '../hooks/useJournals';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { MOODS } from '../utils/moods';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'favorites', label: 'Favourites' },
  { key: 'capsules', label: '⏳ Time Capsules' },
  { key: 'voice', label: '🎙️ Voice Notes' },
  { key: 'notes', label: 'Notes' },
  { key: 'drafts', label: 'Drafts' },
];

export default function MyJournal() {
  const toast = useToast();

  // Tag links from a journal entry arrive as /journal?tag=gratitude
  const [params] = useSearchParams();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [mood, setMood] = useState('all');
  const [tag, setTag] = useState(params.get('tag') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  // Open the filter panel straight away when a tag arrived in the URL, so the
  // active filter is visible (and clearable) rather than silently applied.
  const [showFilters, setShowFilters] = useState(Boolean(params.get('tag')));
  const [allTags, setAllTags] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  // Reset to the first page whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tab, mood, tag, sort]);

  useEffect(() => {
    journalService
      .tags()
      .then((res) => setAllTags(res.data.tags))
      .catch(() => setAllTags([]));
  }, []);

  const filters = useMemo(
    () => ({
      search: debouncedSearch.trim(),
      mood,
      tag,
      sort,
      page,
      limit: 9,
      favorite: tab === 'favorites' ? 'true' : undefined,
      timeCapsule: tab === 'capsules' ? 'true' : undefined,
      hasAudio: tab === 'voice' ? 'true' : undefined,
      drafts: tab === 'drafts' ? 'true' : tab === 'notes' ? 'false' : undefined,
    }),
    [debouncedSearch, mood, tag, sort, page, tab]
  );

  const { entries, pagination, loading, patchEntry, removeEntry } = useJournals(filters);

  const activeFilterCount = [mood !== 'all', Boolean(tag), sort !== 'newest'].filter(Boolean).length;

  const toggleFavorite = async (entry) => {
    const next = !entry.isFavorite;
    patchEntry(entry._id, { isFavorite: next });
    try {
      await journalService.toggleFavorite(entry._id, next);
      toast.success(next ? 'Added to favourites' : 'Removed from favourites');
    } catch (err) {
      patchEntry(entry._id, { isFavorite: !next });
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

  const clearFilters = () => {
    setMood('all');
    setTag('');
    setSort('newest');
  };

  const hasQuery = Boolean(debouncedSearch.trim()) || activeFilterCount > 0 || tab !== 'all';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">My Journal</h1>
          <p className="muted mt-1 text-sm">
            {pagination.total} {pagination.total === 1 ? 'entry' : 'entries'} kept safe.
          </p>
        </div>
        <Link to="/journal/new" className="btn btn-primary">
          <PenLine size={16} aria-hidden="true" />
          New Entry
        </Link>
      </header>

      {/* Search + filter toggle */}
      <div className="flex gap-2">
        <SearchBar value={search} onChange={setSearch} className="flex-1" id="journal-search" />
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
          aria-controls="journal-filters"
          className="btn btn-ghost !rounded-xl !px-3.5 shrink-0"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
              style={{ backgroundColor: 'rgb(var(--accent))', color: '#4A3038' }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter entries">
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(key)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: active ? 'rgb(var(--accent) / 0.45)' : 'transparent',
                color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))',
                boxShadow: active ? 'none' : 'inset 0 0 0 1px rgb(var(--border))',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div id="journal-filters" className="card animate-fade-up space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mood-filter" className="label">
                Mood
              </label>
              <select
                id="mood-filter"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="input"
              >
                <option value="all">Any mood</option>
                {MOODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-filter" className="label">
                Sort by
              </label>
              <select
                id="sort-filter"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div>
              <span className="label">Tags</span>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => {
                  const active = tag === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(active ? '' : t)}
                      aria-pressed={active}
                      className="chip transition-colors"
                      style={{
                        backgroundColor: active ? 'rgb(var(--olive) / 0.22)' : 'transparent',
                        color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))',
                      }}
                    >
                      #{t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeFilterCount > 0 && (
            <button type="button" onClick={clearFilters} className="btn btn-ghost !py-1.5 text-xs">
              <X size={13} aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : entries.length === 0 ? (
        hasQuery ? (
          <EmptyState
            icon={SearchX}
            title="No entries found."
            description="Try a different word, or clear the filters to see everything again."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('');
              setTab('all');
              clearFilters();
            }}
          />
        ) : (
          <EmptyState
            title="You haven't written anything yet."
            description="Start capturing your thoughts today."
            actionLabel="Write your first entry"
            actionTo="/journal/new"
          />
        )
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <JournalCard
                key={entry._id}
                entry={entry}
                onToggleFavorite={toggleFavorite}
                onDelete={setPendingDelete}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Pagination">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-ghost !px-4 !py-2 text-sm"
              >
                Previous
              </button>
              <span className="muted px-2 text-sm tabular-nums">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="btn btn-ghost !px-4 !py-2 text-sm"
              >
                Next
              </button>
            </nav>
          )}
        </>
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
