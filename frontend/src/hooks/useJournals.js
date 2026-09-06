import { useCallback, useEffect, useState } from 'react';
import journalService from '../services/journalService';
import { getErrorMessage } from '../services/api';

/**
 * Fetches a filtered page of journal entries and keeps it in sync when the
 * filters change. `filters` should be memoised or a stable literal.
 */
export default function useJournals(filters = {}) {
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const key = JSON.stringify(filters);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await journalService.list(JSON.parse(key));
      setEntries(res.data.entries);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  /** Applies a local change (favourite toggle, delete) without a refetch. */
  const patchEntry = useCallback((id, patch) => {
    setEntries((list) => list.map((e) => (e._id === id ? { ...e, ...patch } : e)));
  }, []);

  const removeEntry = useCallback((id) => {
    setEntries((list) => list.filter((e) => e._id !== id));
    setPagination((p) => ({ ...p, total: Math.max(0, p.total - 1) }));
  }, []);

  return { entries, pagination, loading, error, refetch: fetchEntries, patchEntry, removeEntry };
}
