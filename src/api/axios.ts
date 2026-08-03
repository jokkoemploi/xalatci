import axios from 'axios';

const meta = import.meta as unknown as { env?: Record<string, string> };
const baseURL = meta.env?.VITE_API_URL || meta.env?.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('xalat_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expirée ou non autorisée.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
