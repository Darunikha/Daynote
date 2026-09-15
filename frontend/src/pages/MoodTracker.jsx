import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Calendar from '../components/Calendar';
import MoodSelector from '../components/MoodSelector';
import { MoodDonut, MoodBars, MoodLegend } from '../components/MoodChart';
import { SkeletonLines } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { TapedNote, SprigLeft, Flower } from '../components/Botanical';
import { WashiTapeCharm } from '../components/Charms';
import journalService from '../services/journalService';
import moodService from '../services/moodService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { getMood, moodInsight } from '../utils/moods';
import { MONTH_NAMES, startOfMonth, endOfMonth, toDateInput, isSameDay, formatDate } from '../utils/format';

/** Adds two {mood,count}[] distributions together and recomputes percent/topMood. */
const mergeDistributions = (a = [], b = []) => {
  const counts = {};
  [...a, ...b].forEach(({ mood, count }) => {
    counts[mood] = (counts[mood] || 0) + count;
  });
  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const distribution = Object.entries(counts)
    .map(([mood, count]) => ({ mood, count, percent: total ? Math.round((count / total) * 100) : 0 }))
    .sort((x, y) => y.count - x.count);
  return { distribution, topMood: distribution[0]?.count ? distribution[0].mood : null, countedInRange: total };
};

export default function MoodTracker() {
  const toast = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState([]);
  const [moodCheckins, setMoodCheckins] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const from = startOfMonth(new Date(year, month, 1)).toISOString();
    const to = endOfMonth(new Date(year, month, 1)).toISOString();

    try {
      const [list, journalStats, moods, moodStats] = await Promise.all([
        journalService.list({ from, to, limit: 60 }),
        journalService.stats({ from, to }),
        moodService.list({ from, to }),
        moodService.stats({ from, to }),
      ]);
      setEntries(list.data.entries);
      setMoodCheckins(moods.data.moods);
      setStats(mergeDistributions(journalStats.data.distribution, moodStats.data.distribution));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [year, month, toast]);

  useEffect(() => {
    load();
  }, [load]);

  /** Records a mood for whichever date is currently selected on the calendar. */
  const recordMood = async (mood) => {
    if (!mood || checkingIn) return;
    setCheckingIn(true);
    try {
      await moodService.checkIn({ mood, date: toDateInput(selectedDate) });
      toast.success(
        isSameDay(selectedDate, today) ? 'Mood recorded' : `Mood recorded for ${formatDate(selectedDate)}`
      );
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCheckingIn(false);
    }
  };

  /** Standalone check-ins take priority over a journal entry's mood for that day. */
  const entriesByDay = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      (map[key] ||= []).push(e);
    });
    moodCheckins.forEach((m) => {
      const d = new Date(m.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map[key] = [{ mood: m.mood }, ...(map[key] || [])];
    });
    return map;
  }, [entries, moodCheckins]);

  const hasData = Boolean(stats?.countedInRange);
  const top = stats?.topMood ? getMood(stats.topMood) : null;
  const daysNoted = Object.keys(entriesByDay).length;

  const selectedIsToday = isSameDay(selectedDate, today);
  const selectedCheckin = moodCheckins.find((m) => isSameDay(m.date, selectedDate)) || null;
  const selectedMoodMeta = selectedCheckin ? getMood(selectedCheckin.mood) : null;
  const selectedDateLabel = selectedIsToday ? 'today' : `on ${formatDate(selectedDate)}`;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Mood Tracker</h1>
          <p className="muted mt-1 text-sm">
            A little page for how you're doing — no scores, no streaks to chase.
          </p>
        </div>
        <Flower className="hidden h-10 w-10 shrink-0 text-[rgb(var(--accent))] opacity-50 sm:block" />
      </header>

      {/* items-start keeps the calendar card its natural height instead of
          stretching it to match the taller insights column. */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        {/* Mood calendar — the main way to pick a day, including past ones
            you forgot to check in on. Future days can't be picked. */}
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
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              maxDate={today}
            />
          )}

          {!loading && (
            <p className="muted mt-5 border-t pt-4 text-xs leading-relaxed">
              You noted a mood on {daysNoted} {daysNoted === 1 ? 'day' : 'days'} in{' '}
              {MONTH_NAMES[month]}. Click any past date to fill in a day you missed.
            </p>
          )}
        </section>

        <div className="space-y-6">
          {/* Check-in for whichever date is selected on the calendar —
              styled like a little journal check-in rather than a dashboard
              widget. */}
          <section className="card relative overflow-visible p-5 pt-7 sm:p-6 sm:pt-8">
            <span className="absolute -top-2.5 left-7 -rotate-6" aria-hidden="true">
              <WashiTapeCharm className="h-5 w-14" />
            </span>

            <h2 className="mb-1 flex items-center gap-1.5 font-hand text-2xl" style={{ color: 'rgb(var(--heading))' }}>
              <Sparkles size={15} className="text-[rgb(var(--accent))]" aria-hidden="true" />
              How did you feel {selectedDateLabel}?
            </h2>
            <p className="muted mb-4 text-sm">
              {selectedMoodMeta
                ? `Logged as ${selectedMoodMeta.label.toLowerCase()} — tap another sticker to change it.`
                : selectedIsToday
                  ? 'Pick whatever sticker fits right now, no need to overthink it.'
                  : 'Missed this one? Pick a sticker and it will be saved for that day.'}
            </p>
            <MoodSelector value={selectedCheckin?.mood || ''} onChange={recordMood} />
          </section>
          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 font-serif text-lg">Mood Insights</h2>

            {loading ? (
              <SkeletonLines lines={4} />
            ) : !hasData ? (
              <p className="muted text-sm leading-relaxed">
                Nothing noted this month yet. Check in above and your moods will gather here.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <MoodDonut distribution={stats.distribution} />
                  <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {top?.Icon && (
                      <span className="mb-0.5 h-8 w-8" aria-hidden="true">
                        <top.Icon className="h-full w-full" />
                      </span>
                    )}
                    <span className="font-serif text-base leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                      Mostly {top?.label}
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
          description="Check in above whenever you like — the rest fills itself in."
          actionLabel="Write an entry instead"
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
