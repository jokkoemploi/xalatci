import apiClient from './axios';
import { UserProfile } from '../types';

export const agentService = {
  getAgents: async () => {
    const res = await apiClient.get<UserProfile[]>('/admin/users');
    return res.data.filter(u => u.role === 'agent' || u.role === 'admin');
  }
};

export default agentService;
