import axios from 'axios';
import { handleLocalBackendRequest } from '../lib/localBackend';

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('xalat_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  async (response) => {
    if (response?.data && typeof response.data === 'string' && response.data.includes('<!doctype html')) {
      const localResponse = await handleLocalBackendRequest({
        method: response.config.method || 'get',
        url: response.config.url || '/',
        params: response.config.params,
        data: response.config.data,
      });
      return { ...response, data: localResponse.data, status: localResponse.status };
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expirée ou non autorisée.');
    }

    if (
      error.response &&
      (error.response.status === 404 || error.response.status === 500 || error.response.headers?.['content-type']?.includes('text/html'))
    ) {
      const fallback = await handleLocalBackendRequest({
        method: error.config?.method || 'get',
        url: error.config?.url || '/',
        params: error.config?.params,
        data: error.config?.data,
      });
      if (fallback) {
        return Promise.resolve({
          data: fallback.data,
          status: fallback.status,
          statusText: 'OK',
          headers: {},
          config: error.config,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
