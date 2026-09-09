import api from './api';

/** Strips empty values so the query string stays clean. */
const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined && v !== 'all')
  );

const journalService = {
  list: (params) => api.get('/journals', { params: clean(params) }).then((r) => r.data),
  get: (id, password) =>
    api
      .get(`/journals/${id}`, {
        headers: password ? { 'x-entry-password': password } : {},
      })
      .then((r) => r.data),
  create: (payload) => api.post('/journals', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/journals/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/journals/${id}`).then((r) => r.data),
  toggleFavorite: (id, isFavorite) =>
    api.patch(`/journals/${id}/favorite`, { isFavorite }).then((r) => r.data),
  lock: (id, password) => api.post(`/journals/${id}/lock`, { password }).then((r) => r.data),
  unlock: (id, password) => api.post(`/journals/${id}/unlock`, { password }).then((r) => r.data),
  removeLock: (id, password) => api.post(`/journals/${id}/remove-lock`, { password }).then((r) => r.data),
  stats: (params) => api.get('/journals/stats', { params: clean(params) }).then((r) => r.data),
  tags: () => api.get('/journals/tags').then((r) => r.data),
};

export default journalService;

