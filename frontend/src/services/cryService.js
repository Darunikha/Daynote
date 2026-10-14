import api from './api';

/** Standalone cry logs — independent of journal entries, like mood check-ins. */
const cryService = {
  today: () => api.get('/cry/today').then((r) => r.data),
  checkIn: (payload) => api.post('/cry', payload).then((r) => r.data),
  list: (params) => api.get('/cry', { params }).then((r) => r.data),
  stats: (params) => api.get('/cry/stats', { params }).then((r) => r.data),
  remove: (id) => api.delete(`/cry/${id}`).then((r) => r.data),
};

export default cryService;
