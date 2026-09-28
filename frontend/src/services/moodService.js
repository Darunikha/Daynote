import api from './api';

/** Standalone daily mood check-ins — independent of journal entries. */
const moodService = {
  today: () => api.get('/moods/today').then((r) => r.data),
  checkIn: (payload) => api.post('/moods', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/moods/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/moods/${id}`).then((r) => r.data),
  list: (params) => api.get('/moods', { params }).then((r) => r.data),
  stats: (params) => api.get('/moods/stats', { params }).then((r) => r.data),
};

export default moodService;
