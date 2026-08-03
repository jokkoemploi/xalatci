import apiClient from '../api/axios';
import authService from '../api/auth.service';
import incidentService from '../api/incident.service';
import categoryService from '../api/category.service';
import dashboardService from '../api/dashboard.service';
import notificationService from '../api/notification.service';
import userService from '../api/user.service';
import historyService from '../api/history.service';
import reportService from '../api/report.service';
import agentService from '../api/agent.service';
import messageService from '../api/message.service';

export {
  apiClient,
  apiClient as api,
  authService,
  incidentService,
  categoryService,
  dashboardService,
  userService,
  notificationService,
  historyService,
  reportService,
  agentService,
  messageService,
  messageService as chatService
};

export const adminService = {
  getDashboardStats: () => dashboardService.getStats(),
  getUsers: () => userService.getUsersList(),
  createUser: (data: { name: string; email: string; phone: string; role: string; commune: string }) => userService.createUser(data),
  updateUser: (id: string, data: Partial<import('../types').UserProfile>) => userService.updateUser(id, data),
  updateUserStatus: (id: string, status: 'actif' | 'suspendu') => userService.updateUserStatus(id, status),
  deleteUser: (id: string) => userService.deleteUser(id)
};

export const profileService = {
  getProfile: () => userService.getProfile(),
  updateProfile: (data: Parameters<typeof userService.updateProfile>[0]) => userService.updateProfile(data),
  getHistory: () => historyService.getHistory()
};

export const badgeService = {
  getBadges: () => userService.getBadges()
};
