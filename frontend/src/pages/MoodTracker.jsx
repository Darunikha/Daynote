import { useCallback, useEffect, useMemo, useState } from 'react';
import Calendar from '../components/Calendar';
import { MoodDonut, MoodBars, MoodLegend } from '../components/MoodChart';
import { SkeletonLines } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { TapedNote, SprigLeft } from '../components/Botanical';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { getMood, moodInsight } from '../utils/moods';
import { MONTH_NAMES, startOfMonth, endOfMonth } from '../utils/format';

export default function MoodTracker() {
  const toast = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const from = startOfMonth(new Date(year, month, 1)).toISOString();
    const to = endOfMonth(new Date(year, month, 1)).toISOString();

    try {
      const [list, statsRes] = await Promise.all([
        journalService.list({ from, to, limit: 60 }),
        journalService.stats({ from, to }),
      ]);
      setEntries(list.data.entries);
      setStats(statsRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [year, month, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const entriesByDay = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      (map[key] ||= []).push(e);
    });
    return map;
  }, [entries]);

  const hasData = Boolean(stats?.countedInRange);
  const top = stats?.topMood ? getMood(stats.topMood) : null;
  const daysWritten = Object.keys(entriesByDay).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">Mood Tracker</h1>
        <p className="muted mt-1 text-sm">
          Your mood this month — no scores, no streaks to chase.
        </p>
      </header>

      {/* items-start keeps the calendar card its natural height instead of
          stretching it to match the taller insights column. */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        {/* Mood calendar */}
        <section className="card p-5 sm:p-6">
          {loading ? (
            <SkeletonLines lines={7} />
          ) : (
            <Calendar
              year={year}
              month={month}
              variant="mood"
              onMonthChange={(y, m) => {
                setYear(y);
                setMonth(m);
              }}
              entriesByDay={entriesByDay}
            />
          )}

          {!loading && (
            <p className="muted mt-5 border-t pt-4 text-xs leading-relaxed">
              You wrote on {daysWritten} {daysWritten === 1 ? 'day' : 'days'} in{' '}
              {MONTH_NAMES[month]}.
            </p>
          )}
        </section>

        {/* Insights */}
        <div className="space-y-6">
          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 font-serif text-lg">Mood Insights</h2>

            {loading ? (
              <SkeletonLines lines={4} />
            ) : !hasData ? (
              <p className="muted text-sm leading-relaxed">
                Nothing written this month yet. Once you do, your moods will gather here.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <MoodDonut distribution={stats.distribution} />
                  <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="muted text-[10px] uppercase tracking-wider">Mostly</span>
                    <span className="font-serif text-lg leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                      {top?.label}
                    </span>
                    <span className="muted text-[10px]">this month</span>
                  </span>
                </div>

                <div className="w-full flex-1">
                  <MoodLegend distribution={stats.distribution} />
                </div>
              </div>
            )}
          </section>

          {hasData && !loading && (
            <section className="card p-5 sm:p-6">
              <h2 className="mb-5 font-serif text-lg">How the month leaned</h2>
              <MoodBars distribution={stats.distribution} />
            </section>
          )}

          <div className="flex justify-center">
            <TapedNote rotate="1.5deg" className="max-w-sm">
              {loading || !hasData
                ? 'Your mood matters.'
                : moodInsight(stats.topMood)}
            </TapedNote>
          </div>
        </div>
      </div>

      {!loading && !hasData && (
        <EmptyState
          title="No moods to show for this month."
          description="Write an entry and pick how the day felt — the rest fills itself in."
          actionLabel="Write an entry"
          actionTo="/journal/new"
        />
      )}

      <div className="relative flex justify-center pt-2">
        <SprigLeft className="h-24 w-16 text-[rgb(var(--olive))] opacity-30" />
      </div>

      <p className="muted mx-auto max-w-md text-center font-hand text-lg">
        Your mood is part of your story, not a problem to fix.
      </p>
    </div>
  );
}
