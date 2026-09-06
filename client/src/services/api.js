import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
