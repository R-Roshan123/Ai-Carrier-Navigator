import axios from 'axios';

// Decided at runtime rather than from the build mode: on the local dev server (localhost or
// port 5173) the API runs on localhost:5000; anywhere else, such as Vercel, the API is served
// from the same domain under /api, so a localhost address left over from development is ignored.
const apiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;
  const { hostname, port } = window.location;
  const onDevServer = hostname === 'localhost' || hostname === '127.0.0.1' || port === '5173';
  if (onDevServer) return configured || 'http://localhost:5000/api';
  return configured && !/localhost|127\.0\.0\.1/.test(configured) ? configured : '/api';
};

const api = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardData = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    return { user: { name: 'Aisha Patel', email: 'aisha@example.com' } };
  }
};

export default api;
