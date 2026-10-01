import React, { useEffect, useState } from 'react';
import { Sparkles, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import journalService from '../services/journalService';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Loading';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { toDateInput, formatLongDate } from '../utils/format';

export default function MemoryLane() {
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState(toDateInput());
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = async (dateStr) => {
    setLoading(true);
    try {
      const res = await journalService.onThisDay({ date: dateStr });
      setMemories(res.data.entries || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories(selectedDate);
  }, [selectedDate]);

  const displayDateStr = formatLongDate(selectedDate);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))]"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-serif text-3xl flex items-center gap-2">
              <Sparkles className="text-amber-500 w-7 h-7" /> Memory Lane
            </h1>
            <p className="muted mt-1 text-sm">
              Look back at what you wrote on this day in past months & years.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
          <Calendar size={16} className="text-amber-600 dark:text-amber-400 ml-1" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-sm font-medium outline-none text-stone-800 dark:text-stone-100 cursor-pointer"
          />
          {selectedDate !== toDateInput() && (
            <button
              type="button"
              onClick={() => setSelectedDate(toDateInput())}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline px-1"
            >
              Today
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {loading ? (
        <SkeletonGrid count={3} />
      ) : memories.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
              Found {memories.length} {memories.length === 1 ? 'memory' : 'memories'} for{' '}
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{displayDateStr}</span>
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((entry) => (
              <div key={entry._id} className="relative group">
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-amber-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow">
                    {entry.timeAgo || 'Past Memory'}
                  </span>
                </div>
                <JournalCard entry={entry} showMenu={true} />
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
        />
      )}
    </div>
  );
}
