import apiClient from './axios';
import { UserProfile, Badge } from '../types';

export const userService = {
  getProfile: async () => {
    const res = await apiClient.get<UserProfile>('/profile');
    return res.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const res = await apiClient.put<UserProfile>('/profile', data);
    return res.data;
  },

  getBadges: async () => {
    const res = await apiClient.get<Badge[]>('/badges');
    return res.data;
  },

  getUsersList: async () => {
    const res = await apiClient.get<UserProfile[]>('/admin/users');
    return res.data;
  },

  createUser: async (data: { name: string; email: string; phone: string; role: string; commune: string }) => {
    const res = await apiClient.post<UserProfile>('/admin/users', data);
    return res.data;
  },

  updateUser: async (id: string, data: Partial<UserProfile>) => {
    const res = await apiClient.put<UserProfile>(`/admin/users/${id}`, data);
    return res.data;
  },

  updateUserStatus: async (id: string, status: 'actif' | 'suspendu') => {
    const res = await apiClient.patch<UserProfile>(`/admin/users/${id}/status`, { status });
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean }>(`/admin/users/${id}`);
    return res.data;
  }
};

export default userService;
