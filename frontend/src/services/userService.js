import api from './api';

const userService = {
  updateProfile: (payload) => api.put('/users/profile', payload).then((r) => r.data),
  updatePassword: (payload) => api.put('/users/password', payload).then((r) => r.data),
  deleteAccount: () => api.delete('/users/me').then((r) => r.data),
};

export default userService;
