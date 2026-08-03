import apiClient from './axios';
import { ActivityLog } from '../types';

export const historyService = {
  getHistory: async () => {
    const res = await apiClient.get<ActivityLog[]>('/history');
    return res.data;
  }
};

export default historyService;
