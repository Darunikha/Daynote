import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenLine, CalendarDays, HeartPulse, ArrowRight, Star, Sparkles } from 'lucide-react';
import JournalCard from '../components/JournalCard';
import MemoryLaneCard from '../components/MemoryLaneCard';
import MoodSelector from '../components/MoodSelector';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { WeekStrip } from '../components/MoodChart';
import { JournalCardSkeleton, SkeletonLines } from '../components/Loading';
import { TapedNote, Branch } from '../components/Botanical';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { greeting, firstName, isSameDay } from '../utils/format';

const QUICK_ACTIONS = [
  { to: '/journal/new', label: 'New Entry', icon: PenLine, variant: 'primary' },
  { to: '/calendar', label: 'View Calendar', icon: CalendarDays, variant: 'ghost' },
  { to: '/mood', label: 'Check Mood', icon: HeartPulse, variant: 'olive' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickMood, setQuickMood] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, statsRes, memoryRes] = await Promise.all([
        journalService.list({ limit: 8, sort: 'newest' }),
        journalService.stats(),
        journalService.onThisDay().catch(() => ({ data: { entries: [] } })),
      ]);
      setEntries(list.data.entries);
      setStats(statsRes.data);
      setMemories(memoryRes.data?.entries || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const [featured, ...rest] = entries;
  const recent = rest.slice(0, 3);

  /** Last seven days, oldest first, with the mood of that day's first entry. */
  const week = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayEntries = entries.filter((e) => isSameDay(e.date, date));
      days.push({
        date: date.toDateString(),
        label: date.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 3),
        count: dayEntries.length,
        mood: dayEntries[0]?.mood || null,
      });
    }
    return days;
  }, [entries]);

  const toggleFavorite = async (entry) => {
    const next = !entry.isFavorite;
    setEntries((list) => list.map((e) => (e._id === entry._id ? { ...e, isFavorite: next } : e)));
    try {
      await journalService.toggleFavorite(entry._id, next);
      toast.success(next ? 'Added to favourites' : 'Removed from favourites');
    } catch (err) {
      setEntries((list) =>
        list.map((e) => (e._id === entry._id ? { ...e, isFavorite: !next } : e))
      );
      toast.error(getErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await journalService.remove(pendingDelete._id);
      setEntries((list) => list.filter((e) => e._id !== pendingDelete._id));
      toast.success('Journal entry deleted successfully');
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  /** Picking a mood on the dashboard opens the editor with it pre-filled. */
  const startFromMood = (mood) => {
    setQuickMood(mood);
    if (mood) navigate(`/journal/new?mood=${mood}`);
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section className="relative">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
              {greeting()},
              <br />
              <span className="inline-flex items-center gap-2">
                {firstName(user?.name)}
                <span aria-hidden="true" style={{ color: 'rgb(var(--accent))' }}>
                  ♥
                </span>
              </span>
            </h1>

            <p className="muted mt-4 text-sm">How was your day today?</p>
            <MoodSelector value={quickMood} onChange={startFromMood} className="mt-3" />
          </div>

          <div className="hidden pt-4 lg:block">
            <TapedNote rotate="2deg" className="max-w-[190px]">
              Small steps,
              <br />
              big dreams.
            </TapedNote>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* On This Day / Memory Lane Widget */}
          {!loading && memories.length > 0 && (
            <section aria-label="Memory Lane">
              <MemoryLaneCard memories={memories} />
            </section>
          )}

          {/* Today's journal */}
          <section aria-labelledby="todays-journal">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="todays-journal" className="font-serif text-xl">
                Today&apos;s Journal
              </h2>
              <Link
                to="/journal"
                className="muted inline-flex items-center gap-1 text-sm transition-colors hover:text-[rgb(var(--brandy))]"
              >
                View all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <JournalCardSkeleton large />
            ) : featured ? (
              <JournalCard
                entry={featured}
                variant="feature"
                onToggleFavorite={toggleFavorite}
                onDelete={setPendingDelete}
              />
            ) : (
              <EmptyState
                title="You haven't written anything yet."
                description="Start capturing your thoughts today — even a single line counts."
                actionLabel="Write your first entry"
                actionTo="/journal/new"
              />
            )}
          </section>

          {/* Recent entries */}
          {(loading || recent.length > 0) && (
            <section aria-labelledby="recent-entries">
              <div className="mb-3 flex items-center justify-between">
                <h2 id="recent-entries" className="font-serif text-xl">
                  Recent Entries
                </h2>
                <Link
                  to="/journal"
                  className="muted inline-flex items-center gap-1 text-sm transition-colors hover:text-[rgb(var(--brandy))]"
                >
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {loading
                  ? Array.from({ length: 3 }, (_, i) => <JournalCardSkeleton key={i} />)
                  : recent.map((entry) => (
                      <JournalCard key={entry._id} entry={entry} variant="mini" showMenu={false} />
                    ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* This week */}
          <section className="card p-5" aria-labelledby="this-week">
            <h2 id="this-week" className="mb-4 font-serif text-lg">
              This Week
            </h2>
            {loading ? <SkeletonLines lines={4} /> : <WeekStrip days={week} />}
            <p className="muted mt-4 text-xs leading-relaxed">
              A soft look at the last seven days.
            </p>
          </section>

          {/* Quick actions */}
          <section className="card p-5" aria-labelledby="quick-actions">
            <h2 id="quick-actions" className="mb-4 font-serif text-lg">
              Quick Actions
            </h2>
            <div className="space-y-2.5">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon, variant }) => (
                <Link
                  key={to}
                  to={to}
                  className={`btn w-full !justify-start !rounded-xl ${
                    variant === 'primary'
                      ? 'btn-primary'
                      : variant === 'olive'
                        ? 'btn-olive'
                        : 'btn-ghost'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* Little stats */}
          <section className="card relative overflow-hidden p-5">
            <Branch className="pointer-events-none absolute -right-4 -top-2 h-16 w-28 text-[rgb(var(--olive))] opacity-30" />
            <h2 className="mb-4 font-serif text-lg">Your notebook</h2>

            {loading || !stats ? (
              <SkeletonLines lines={2} />
            ) : (
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="muted text-xs">Entries</dt>
                  <dd className="font-serif text-2xl">{stats.totalEntries}</dd>
                </div>
                <div>
                  <dt className="muted text-xs">Favourites</dt>
                  <dd className="flex items-center gap-1.5 font-serif text-2xl">
                    {stats.totalFavorites}
                    <Star size={15} aria-hidden="true" style={{ color: '#E0A94E' }} fill="#E8C87C" />
                  </dd>
                </div>
              </dl>
            )}
          </section>
        </div>
      </div>

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
