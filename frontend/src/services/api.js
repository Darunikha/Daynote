import axios from 'axios';

// In development VITE_API_URL can be left blank; Vite proxies /api to the backend.
const baseURL = `${import.meta.env.VITE_API_URL || ''}/api`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

export const TOKEN_KEY = 'daynote-token';

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Normalises any axios failure into a friendly message string. */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return 'That request took too long. Please try again.';
  if (error?.message === 'Network Error') {
    return 'We could not reach the server. Is the backend running?';
  }
  return 'Something went wrong. Please try again.';
};

// Sign the user out automatically when the token is rejected.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const onAuthPage = ['/login', '/register', '/'].includes(window.location.pathname);
    if (status === 401 && !onAuthPage) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('daynote:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
