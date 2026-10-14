import { useCallback, useEffect, useMemo, useState } from 'react';
import { Droplet, X } from 'lucide-react';
import Calendar from '../components/Calendar';
import { CryIntensityDonut, CryIntensityLegend } from '../components/CryChart';
import { SkeletonLines } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { TapedNote, SprigLeft } from '../components/Botanical';
import { WashiTapeCharm } from '../components/Charms';
import cryService from '../services/cryService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { CRY_INTENSITY, CRY_TRIGGERS, CRY_FELT, getCryIntensity, getCryTrigger } from '../utils/cry';
import { startOfMonth, endOfMonth, toDateInput, isSameDay, formatDate, formatTime } from '../utils/format';

export default function CryLog() {
  const toast = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [intensity, setIntensity] = useState('teary');
  const [trigger, setTrigger] = useState('other');
  const [felt, setFelt] = useState('same');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const from = startOfMonth(new Date(year, month, 1)).toISOString();
    const to = endOfMonth(new Date(year, month, 1)).toISOString();

    try {
      const [list, s] = await Promise.all([cryService.list({ from, to }), cryService.stats({ from, to })]);
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

  const entriesByDay = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      const d = new Date(l.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      (map[key] ||= []).push(l);
    });
    return map;
  }, [logs]);

  const selectedLogs = useMemo(
    () =>
      logs
        .filter((l) => isSameDay(l.date, selectedDate))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [logs, selectedDate]
  );

  const selectedIsToday = isSameDay(selectedDate, today);
  const selectedDateLabel = selectedIsToday ? 'today' : `on ${formatDate(selectedDate)}`;
  const daysNoted = Object.keys(entriesByDay).length;
  const hasData = Boolean(stats?.countedInRange);

  const save = async () => {
    setSaving(true);
    try {
      await cryService.checkIn({ date: toDateInput(selectedDate), intensity, trigger, felt, note: note.trim() });
      toast.success(selectedIsToday ? 'Logged' : `Logged for ${formatDate(selectedDate)}`);
      setNote('');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (removingId) return;
    setRemovingId(id);
    try {
      await cryService.remove(id);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Cry Log</h1>
          <p className="muted mt-1 text-sm">A gentle record of the tears — not a problem to fix, just worth noting.</p>
        </div>
        <Droplet className="hidden h-10 w-10 shrink-0 text-[rgb(var(--accent))] opacity-50 sm:block" />
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
              You logged something on {daysNoted} {daysNoted === 1 ? 'day' : 'days'}. Click any past date to fill in a
              day you missed.
            </p>
          )}
        </section>

        <div className="space-y-6">
          <section className="card relative overflow-visible p-5 pt-7 sm:p-6 sm:pt-8">
            <span className="absolute -top-2.5 left-7 -rotate-6" aria-hidden="true">
              <WashiTapeCharm className="h-5 w-14" />
            </span>

            <h2 className="mb-1 flex items-center gap-1.5 font-hand text-2xl" style={{ color: 'rgb(var(--heading))' }}>
              <Droplet size={15} className="text-[rgb(var(--accent))]" aria-hidden="true" />
              Did you cry {selectedDateLabel}?
            </h2>
            <p className="muted mb-4 text-sm">
              {selectedLogs.length
                ? "Happened more than once? Log another — you're not limited to one."
                : 'No pressure to explain it — a quick log is enough.'}
            </p>

            {selectedLogs.length > 0 && (
              <ul className="mb-4 flex flex-wrap gap-2">
                {selectedLogs.map((log) => {
                  const meta = getCryIntensity(log.intensity);
                  return (
                    <li
                      key={log._id}
                      className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-xs"
                      style={{ backgroundColor: meta.soft, color: 'rgb(var(--heading))' }}
                    >
                      <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
                        <meta.Icon size={13} style={{ color: meta.color }} />
                      </span>
                      <span>{meta.label}</span>
                      <span className="muted">{getCryTrigger(log.trigger).label}</span>
                      <span className="muted">{formatTime(log.createdAt)}</span>
                      <button
                        type="button"
                        onClick={() => remove(log._id)}
                        disabled={removingId === log._id}
                        aria-label={`Remove this ${meta.label.toLowerCase()} log`}
                        className="muted rounded-full p-0.5 transition-colors hover:text-[rgb(var(--heading))] disabled:opacity-40"
                      >
                        <X size={11} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mb-4" role="radiogroup" aria-label="Intensity">
              <p className="label !mb-1.5 !text-[11px]">Intensity</p>
              <div className="flex flex-wrap gap-2">
                {CRY_INTENSITY.map((i) => {
                  const active = intensity === i.value;
                  return (
                    <button
                      key={i.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setIntensity(i.value)}
                      className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200"
                      style={{
                        backgroundColor: active ? i.soft : 'transparent',
                        boxShadow: active ? `inset 0 0 0 1px ${i.color}66` : 'none',
                      }}
                    >
                      <i.Icon size={18} style={{ color: active ? i.color : 'rgb(var(--text-muted))' }} />
                      <span className="text-[11px] font-medium" style={{ color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}>
                        {i.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <p className="label !mb-1.5 !text-[11px]">What brought it on? (optional)</p>
              <div className="flex flex-wrap gap-1.5">
                {CRY_TRIGGERS.map((t) => {
                  const active = trigger === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTrigger(t.value)}
                      className="chip"
                      style={{
                        backgroundColor: active ? 'rgb(var(--accent))' : 'transparent',
                        color: active ? '#4A3038' : 'rgb(var(--text-muted))',
                        borderColor: active ? 'transparent' : 'rgb(var(--border))',
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4" role="radiogroup" aria-label="Felt after">
              <p className="label !mb-1.5 !text-[11px]">Felt after</p>
              <div className="flex gap-1.5">
                {CRY_FELT.map((f) => {
                  const active = felt === f.value;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFelt(f.value)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: active ? `${f.color}22` : 'transparent',
                        boxShadow: active ? `inset 0 0 0 1px ${f.color}66` : 'inset 0 0 0 1px rgb(var(--border))',
                        color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))',
                      }}
                    >
                      <f.Icon size={13} style={{ color: active ? f.color : 'rgb(var(--text-muted))' }} />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label htmlFor="cry-note" className="label !mb-1 !text-[11px]">
              Note (optional)
            </label>
            <textarea
              id="cry-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Whatever you want to remember about it…"
              maxLength={280}
              className="input mb-4 !min-h-[56px] resize-none !text-sm"
            />

            <button type="button" onClick={save} disabled={saving} className="btn btn-primary w-full">
              Log it
            </button>
          </section>

          <section className="card relative overflow-hidden p-5 sm:p-6">
            <h2 className="mb-5 font-serif text-lg">This Month</h2>

            {loading ? (
              <SkeletonLines lines={4} />
            ) : !hasData ? (
              <p className="muted text-sm leading-relaxed">Nothing logged this month yet. That's worth noting too.</p>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <CryIntensityDonut distribution={stats.distribution} />
                  <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-xl leading-tight" style={{ color: 'rgb(var(--heading))' }}>
                      {stats.countedInRange}
                    </span>
                    <span className="muted text-[10px]">logged</span>
                  </span>
                </div>

                <div className="w-full flex-1">
                  <CryIntensityLegend distribution={stats.distribution} />
                </div>
              </div>
            )}
          </section>

          {hasData && !loading && (
            <section className="card flex items-center justify-between gap-4 p-5 text-center sm:p-6">
              <div>
                <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
                  {stats.feltBetter}
                </p>
                <p className="muted text-xs">Felt better</p>
              </div>
              <div>
                <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
                  {stats.feltSame}
                </p>
                <p className="muted text-xs">About the same</p>
              </div>
              <div>
                <p className="font-serif text-lg" style={{ color: 'rgb(var(--heading))' }}>
                  {stats.feltWorse}
                </p>
                <p className="muted text-xs">Felt worse</p>
              </div>
            </section>
          )}

          <div className="flex justify-center">
            <TapedNote rotate="-1.5deg" className="max-w-sm">
              Crying is not a weakness. It's a release.
            </TapedNote>
          </div>
        </div>
      </div>

      {!loading && !hasData && (
        <EmptyState
          title="Nothing logged for this month."
          description="Log whenever you need to — the rest fills itself in."
          actionLabel="Write an entry instead"
          actionTo="/journal/new"
        />
      )}

      <div className="relative flex justify-center pt-2">
        <SprigLeft className="h-24 w-16 text-[rgb(var(--olive))] opacity-30" />
      </div>
    </div>
  );
}
