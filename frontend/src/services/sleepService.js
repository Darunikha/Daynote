import api from './api';

/** Standalone nightly sleep logs — bedtime, wake time, quality. */
const sleepService = {
  today: () => api.get('/sleep/today').then((r) => r.data),
  checkIn: (payload) => api.post('/sleep', payload).then((r) => r.data),
  list: (params) => api.get('/sleep', { params }).then((r) => r.data),
  stats: (params) => api.get('/sleep/stats', { params }).then((r) => r.data),
  remove: (id) => api.delete(`/sleep/${id}`).then((r) => r.data),
};

export default sleepService;
