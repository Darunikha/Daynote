import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, CalendarDays } from 'lucide-react';
import Calendar from '../components/Calendar';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import { SkeletonLines } from '../components/Loading';
import { Branch } from '../components/Botanical';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatLongDate, startOfMonth, endOfMonth, isSameDay, toDateInput } from '../utils/format';

export default function CalendarPage() {
  const toast = useToast();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch just the visible month's entries.
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await journalService.list({
        from: startOfMonth(new Date(year, month, 1)).toISOString(),
        to: endOfMonth(new Date(year, month, 1)).toISOString(),
        limit: 60,
        sort: 'newest',
      });
      setEntries(res.data.entries);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setEntries([]);
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

  const dayEntries = useMemo(
    () => entries.filter((e) => isSameDay(e.date, selected)),
    [entries, selected]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Calendar</h1>
          <p className="muted mt-1 text-sm">Your month, one small page at a time.</p>
        </div>
        <Link to="/journal/new" className="btn btn-primary">
          <PenLine size={16} aria-hidden="true" />
          New Entry
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <section className="card relative overflow-hidden p-5 sm:p-6">
          <Branch className="pointer-events-none absolute -right-4 top-2 h-16 w-28 text-[rgb(var(--olive))] opacity-25" />
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
              selectedDate={selected}
              onSelectDate={setSelected}
            />
          )}

          <p className="muted mt-5 border-t pt-4 text-xs leading-relaxed">
            A soft dot marks a day you wrote on. Pick any date to read it again.
          </p>
        </section>

        <section aria-live="polite" className="space-y-4">
          <h2 className="font-serif text-lg">{formatLongDate(selected)}</h2>

          {loading ? (
            <div className="card p-5">
              <SkeletonLines lines={3} />
            </div>
          ) : dayEntries.length === 0 ? (
            <EmptyState
              compact
              icon={CalendarDays}
              title="Nothing written on this day."
              description="You can still add an entry for it whenever you like."
              actionLabel="Write for this day"
              actionTo={`/journal/new?date=${toDateInput(selected)}`}
            />
          ) : (
            <div className="space-y-4">
              {dayEntries.map((entry) => (
                <JournalCard key={entry._id} entry={entry} showMenu={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
