import apiClient from './axios';
import { DashboardStats } from '../types';

export const dashboardService = {
  getStats: async () => {
    const res = await apiClient.get<DashboardStats>('/admin/stats');
    return res.data;
  }
};

export default dashboardService;
