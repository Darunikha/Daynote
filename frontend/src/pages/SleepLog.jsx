import { useCallback, useEffect, useMemo, useState } from 'react';
import { Moon, Save, Trash2 } from 'lucide-react';
import Calendar from '../components/Calendar';
import TimePicker from '../components/TimePicker';
import { SleepQualityDonut, SleepQualityLegend } from '../components/SleepChart';
import { SkeletonLines } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { TapedNote, SprigLeft } from '../components/Botanical';
import { WashiTapeCharm } from '../components/Charms';
import sleepService from '../services/sleepService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SLEEP_QUALITY, getSleepQuality, formatDuration, formatTime12h } from '../utils/sleep';
import { MONTH_NAMES, startOfMonth, endOfMonth, toDateInput, isSameDay, formatDate } from '../utils/format';

const EMPTY_FORM = { bedTime: '23:00', wakeTime: '07:00', quality: 'fair', notes: '' };

export default function SleepLog() {
  const toast = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    const from = startOfMonth(new Date(year, month, 1)).toISOString();
    const to = endOfMonth(new Date(year, month, 1)).toISOString();

    try {
      const [list, s] = await Promise.all([sleepService.list({ from, to }), sleepService.stats({ from, to })]);
      setLogs(list.data.logs);
      setStats(s.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [year, month, toast]);

  useEffect(() => {
    load();
  }, [load]);

  /** Standalone check-ins take priority over a journal entry's mood for that day. */
  const entriesByDay = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      const d = new Date(l.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      (map[key] ||= []).push(l);
    });
    return map;
  }, [logs]);

  const selectedLog = useMemo(() => logs.find((l) => isSameDay(l.date, selectedDate)) || null, [logs, selectedDate]);

  // Whenever the selected day (or the data for it) changes, fill the form
  // with that day's existing log, or reset to sensible defaults for a day
  // that hasn't been logged yet.
  useEffect(() => {
    setForm(selectedLog ? { bedTime: selectedLog.bedTime, wakeTime: selectedLog.wakeTime, quality: selectedLog.quality, notes: selectedLog.notes || '' } : EMPTY_FORM);
  }, [selectedLog]);

  const selectedIsToday = isSameDay(selectedDate, today);
  const selectedDateLabel = selectedIsToday ? 'last night' : `the night before ${formatDate(selectedDate)}`;
  const previewMinutes = useMemo(() => {
    const [bh, bm] = form.bedTime.split(':').map(Number);
    const [wh, wm] = form.wakeTime.split(':').map(Number);
    const bed = bh * 60 + bm;
    const wake = wh * 60 + wm;
    return wake <= bed ? 1440 - bed + wake : wake - bed;
  }, [form.bedTime, form.wakeTime]);

  const save = async () => {
    setSaving(true);
    try {
      await sleepService.checkIn({ date: toDateInput(selectedDate), ...form });
      toast.success(selectedLog ? 'Sleep log updated' : 'Sleep logged');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedLog) return;
    setDeleting(true);
    try {
      await sleepService.remove(selectedLog._id);
      toast.success('Sleep log removed');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const hasData = Boolean(stats?.nightsLogged);
  const daysNoted = Object.keys(entriesByDay).length;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Sleep Log</h1>
          <p className="muted mt-1 text-sm">A quiet record of your nights — bedtime, wake time, how it felt.</p>
        </div>
        <Moon className="hidden h-10 w-10 shrink-0 text-[rgb(var(--accent))] opacity-50 sm:block" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <section className="card p-5 sm:p-6">
          {loading ? (
            <SkeletonLines lines={7} />
          ) : (
            <Calendar
              year={year}
              month={month}
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
              You logged sleep on {daysNoted} {daysNoted === 1 ? 'night' : 'nights'} in {MONTH_NAMES[month]}. Click any
              past date to fill in a night you missed.
            </p>
          )}
        </section>

        <div className="space-y-6">
          <section className="card relative overflow-visible p-5 pt-7 sm:p-6 sm:pt-8">
            <span className="absolute -top-2.5 left-7 -rotate-6" aria-hidden="true">
              <WashiTapeCharm className="h-5 w-14" />
            </span>

            <h2 className="mb-1 flex items-center gap-1.5 font-hand text-2xl" style={{ color: 'rgb(var(--heading))' }}>
              <Moon size={15} className="text-[rgb(var(--accent))]" aria-hidden="true" />
              How did you sleep {selectedDateLabel}?
            </h2>
            <p className="muted mb-4 text-sm">
              {selectedLog ? 'Already logged — change anything and save to update it.' : 'Pick a bedtime and wake time, no need to be exact.'}
            </p>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <TimePicker
                  id="bedTime"
                  label="Bedtime"
                  value={form.bedTime}
                  onChange={(bedTime) => setForm((f) => ({ ...f, bedTime }))}
                />
              </div>
              <div>
                <TimePicker
                  id="wakeTime"
                  label="Wake time"
                  value={form.wakeTime}
                  onChange={(wakeTime) => setForm((f) => ({ ...f, wakeTime }))}
                />
              </div>
            </div>

            <p className="muted mb-4 text-xs">
              That's about <span className="font-medium" style={{ color: 'rgb(var(--heading))' }}>{formatDuration(previewMinutes)}</span> of sleep.
            </p>

            <div className="mb-5" role="radiogroup" aria-label="Sleep quality">
              <p className="label !mb-1.5 !text-[11px]">Quality</p>
              <div className="flex flex-wrap gap-2">
                {SLEEP_QUALITY.map((q) => {
                  const active = form.quality === q.value;
                  return (
                    <button
                      key={q.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setForm((f) => ({ ...f, quality: q.value }))}
                      className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200"
                      style={{
                        backgroundColor: active ? q.soft : 'transparent',
                        boxShadow: active ? `inset 0 0 0 1px ${q.color}66` : 'none',
                      }}
                    >
                      <q.Icon size={20} style={{ color: active ? q.color : 'rgb(var(--text-muted))' }} />
                      <span className="text-[11px] font-medium" style={{ color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}>
                        {q.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label htmlFor="sleep-notes" className="label !mb-1 !text-[11px]">
              Notes (optional)
            </label>
            <textarea
              id="sleep-notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Woke up a few times, felt rested anyway…"
              maxLength={280}
              className="input mb-4 !min-h-[64px] resize-none !text-sm"
            />

            <div className="flex gap-2">
              <button type="button" onClick={save} disabled={saving} className="btn btn-primary flex-1">
                <Save size={14} aria-hidden="true" />
                {selectedLog ? 'Update' : 'Save'}
              </button>
              {selectedLog && (
                <button
                  type="button"
                  onClick={remove}
                  disabled={deleting}
                  aria-label="Delete this sleep log"
                  className="btn btn-ghost !px-3"
                >
                  <Trash2 size={14} style={{ color: 'rgb(var(--brandy))' }} />
                </button>
              )}
            </div>
          </section>

          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 font-serif text-lg">Sleep Insights</h2>

            {loading ? (
              <SkeletonLines lines={4} />
            ) : !hasData ? (
              <p className="muted text-sm leading-relaxed">
                Nothing logged this month yet. Log a night above and your sleep will gather here.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <SleepQualityDonut distribution={stats.distribution} />
                  <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-base leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                      {formatDuration(stats.avgMinutes)}
                    </span>
                    <span className="muted text-[10px]">avg / night</span>
                  </span>
                </div>

                <div className="w-full flex-1">
                  <SleepQualityLegend distribution={stats.distribution} />
                </div>
              </div>
            )}
          </section>

          {hasData && !loading && (
            <section className="card flex items-center justify-between gap-4 p-5 text-center sm:p-6">
              <div>
                <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
                  {formatDuration(stats.shortestMinutes)}
                </p>
                <p className="muted text-xs">Shortest</p>
              </div>
              <div>
                <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
                  {stats.nightsLogged}
                </p>
                <p className="muted text-xs">Nights logged</p>
              </div>
              <div>
                <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
                  {formatDuration(stats.longestMinutes)}
                </p>
                <p className="muted text-xs">Longest</p>
              </div>
            </section>
          )}

          <div className="flex justify-center">
            <TapedNote rotate="1.5deg" className="max-w-sm">
              {selectedLog
                ? `${formatTime12h(selectedLog.bedTime)} – ${formatTime12h(selectedLog.wakeTime)}`
                : 'Rest is not a reward, it is a need.'}
            </TapedNote>
          </div>
        </div>
      </div>

      {!loading && !hasData && (
        <EmptyState
          title="No sleep logged for this month."
          description="Log a night above whenever you like — the rest fills itself in."
          actionLabel="Go to Mood Tracker"
          actionTo="/mood"
        />
      )}

      <div className="relative flex justify-center pt-2">
        <SprigLeft className="h-24 w-16 text-[rgb(var(--olive))] opacity-30" />
      </div>
    </div>
  );
}
