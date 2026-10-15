import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, HeartPulse, Moon, Droplet } from 'lucide-react';
import { MoodDonut, MoodLegend } from '../components/MoodChart';
import { SleepQualityDonut, SleepQualityLegend } from '../components/SleepChart';
import { CryIntensityDonut, CryIntensityLegend } from '../components/CryChart';
import { SkeletonLines } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { TapedNote, SprigLeft } from '../components/Botanical';
import journalService from '../services/journalService';
import moodService from '../services/moodService';
import sleepService from '../services/sleepService';
import cryService from '../services/cryService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { getMood, moodInsight } from '../utils/moods';
import { formatDuration } from '../utils/sleep';
import { MONTH_NAMES, startOfMonth, endOfMonth } from '../utils/format';

/** Adds two {mood,count}[] distributions together and recomputes percent/topMood — same merge MoodTracker uses, so a journal entry's mood and a standalone check-in both count. */
const mergeMoods = (a = [], b = []) => {
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

export default function Recap() {
  const toast = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [moodStats, setMoodStats] = useState(null);
  const [sleepStats, setSleepStats] = useState(null);
  const [cryStats, setCryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const load = useCallback(async () => {
    setLoading(true);
    const from = startOfMonth(new Date(year, month, 1)).toISOString();
    const to = endOfMonth(new Date(year, month, 1)).toISOString();

    try {
      const [journalMoods, moods, sleep, cry] = await Promise.all([
        journalService.stats({ from, to }),
        moodService.stats({ from, to }),
        sleepService.stats({ from, to }),
        cryService.stats({ from, to }),
      ]);
      setMoodStats(mergeMoods(journalMoods.data.distribution, moods.data.distribution));
      setSleepStats(sleep.data);
      setCryStats(cry.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [year, month, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const step = (delta) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const hasMood = Boolean(moodStats?.countedInRange);
  const hasSleep = Boolean(sleepStats?.nightsLogged);
  const hasCry = Boolean(cryStats?.countedInRange);
  const hasAnything = hasMood || hasSleep || hasCry;
  const topMood = moodStats?.topMood ? getMood(moodStats.topMood) : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">Monthly Recap</h1>
        <p className="muted mt-1 text-sm">Mood, sleep and tears — one gentle look back at the month.</p>
      </header>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous month"
          className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))]"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="w-44 text-center font-serif text-xl" aria-live="polite">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))] disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <section key={i} className="card p-5 sm:p-6">
              <SkeletonLines lines={5} />
            </section>
          ))}
        </div>
      ) : !hasAnything ? (
        <EmptyState
          title={`Nothing logged in ${MONTH_NAMES[month]} yet.`}
          description="Check in on your mood, log a night's sleep, or note a cry — your recap fills itself in."
          actionLabel="Check your mood"
          actionTo="/mood"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* Mood */}
          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-1.5 font-serif text-lg">
              <HeartPulse size={15} className="text-[rgb(var(--accent))]" aria-hidden="true" />
              Mood
            </h2>
            {!hasMood ? (
              <p className="muted text-sm leading-relaxed">No moods noted this month.</p>
            ) : (
              <>
                <div className="flex flex-col items-center gap-5">
                  <div className="relative shrink-0">
                    <MoodDonut distribution={moodStats.distribution} />
                    <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      {topMood?.Icon && (
                        <span className="mb-0.5 h-8 w-8" aria-hidden="true">
                          <topMood.Icon className="h-full w-full" />
                        </span>
                      )}
                      <span className="font-serif text-base leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                        Mostly {topMood?.label}
                      </span>
                    </span>
                  </div>
                  <div className="w-full">
                    <MoodLegend distribution={moodStats.distribution} />
                  </div>
                </div>
                <p className="muted mt-5 border-t pt-4 text-xs leading-relaxed">{moodInsight(moodStats.topMood)}</p>
              </>
            )}
          </section>

          {/* Sleep */}
          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-1.5 font-serif text-lg">
              <Moon size={15} className="text-[rgb(var(--accent))]" aria-hidden="true" />
              Sleep
            </h2>
            {!hasSleep ? (
              <p className="muted text-sm leading-relaxed">No sleep logged this month.</p>
            ) : (
              <>
                <div className="flex flex-col items-center gap-5">
                  <div className="relative shrink-0">
                    <SleepQualityDonut distribution={sleepStats.distribution} />
                    <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-serif text-base leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                        {formatDuration(sleepStats.avgMinutes)}
                      </span>
                      <span className="muted text-[10px]">avg / night</span>
                    </span>
                  </div>
                  <div className="w-full">
                    <SleepQualityLegend distribution={sleepStats.distribution} />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4 text-center">
                  <div>
                    <p className="font-serif text-base" style={{ color: 'rgb(var(--heading))' }}>
                      {formatDuration(sleepStats.shortestMinutes)}
                    </p>
                    <p className="muted text-[11px]">Shortest</p>
                  </div>
                  <div>
                    <p className="font-serif text-base" style={{ color: 'rgb(var(--heading))' }}>
                      {sleepStats.nightsLogged}
                    </p>
                    <p className="muted text-[11px]">Nights logged</p>
                  </div>
                  <div>
                    <p className="font-serif text-base" style={{ color: 'rgb(var(--heading))' }}>
                      {formatDuration(sleepStats.longestMinutes)}
                    </p>
                    <p className="muted text-[11px]">Longest</p>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Cry */}
          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-1.5 font-serif text-lg">
              <Droplet size={15} className="text-[rgb(var(--accent))]" aria-hidden="true" />
              Cry
            </h2>
            {!hasCry ? (
              <p className="muted text-sm leading-relaxed">Nothing logged this month. That's worth noting too.</p>
            ) : (
              <>
                <div className="flex flex-col items-center gap-5">
                  <div className="relative shrink-0">
                    <CryIntensityDonut distribution={cryStats.distribution} />
                    <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-serif text-xl leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                        {cryStats.countedInRange}
                      </span>
                      <span className="muted text-[10px]">logged</span>
                    </span>
                  </div>
                  <div className="w-full">
                    <CryIntensityLegend distribution={cryStats.distribution} />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4 text-center">
                  <div>
                    <p className="font-serif text-base" style={{ color: 'rgb(var(--heading))' }}>
                      {cryStats.feltBetter}
                    </p>
                    <p className="muted text-[11px]">Felt better</p>
                  </div>
                  <div>
                    <p className="font-serif text-base" style={{ color: 'rgb(var(--heading))' }}>
                      {cryStats.feltSame}
                    </p>
                    <p className="muted text-[11px]">Same</p>
                  </div>
                  <div>
                    <p className="font-serif text-base" style={{ color: 'rgb(var(--heading))' }}>
                      {cryStats.feltWorse}
                    </p>
                    <p className="muted text-[11px]">Felt worse</p>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {!loading && hasAnything && (
        <div className="flex justify-center">
          <TapedNote rotate="1.5deg" className="max-w-sm">
            Every month leaves a trace. This one is yours.
          </TapedNote>
        </div>
      )}

      <div className="relative flex justify-center pt-2">
        <SprigLeft className="h-24 w-16 text-[rgb(var(--olive))] opacity-30" />
      </div>
    </div>
  );
}
