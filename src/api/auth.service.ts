import apiClient from './axios';
import { UserProfile } from '../types';

export const authService = {
  login: async (email: string) => {
    const res = await apiClient.post<{ token: string; user: UserProfile }>('/auth/login', { email });
    if (res.data.token) {
      localStorage.setItem('xalat_token', res.data.token);
    }
    return res.data;
  },

  register: async (data: { name: string; email: string; phone: string; commune?: string }) => {
    const res = await apiClient.post<{ token: string; user: UserProfile }>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('xalat_token', res.data.token);
    }
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<UserProfile>('/auth/me');
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem('xalat_token');
    return true;
  }
};

export default authService;
