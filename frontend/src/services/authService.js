import api from './api';

const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload).then((r) => r.data),
  resetPassword: (token, payload) =>
    api.post(`/auth/reset-password/${token}`, payload).then((r) => r.data),
};

export default authService;
