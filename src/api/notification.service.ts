import apiClient from './axios';
import { NotificationItem } from '../types';

export const notificationService = {
  getNotifications: async () => {
    const res = await apiClient.get<NotificationItem[]>('/notifications');
    return res.data;
  },

  markAllRead: async () => {
    const res = await apiClient.patch('/notifications/mark-read');
    return res.data;
  }
};

export default notificationService;
