import api from './api';

const uploadService = {
  /** Tells the UI whether Cloudinary is configured on the server. */
  status: () => api.get('/upload/status').then((r) => r.data),

  upload: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api
      .post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
};

export default uploadService;
