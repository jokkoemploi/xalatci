import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoryService, 
  notificationService, 
  chatService, 
  badgeService, 
  profileService, 
  adminService,
  dashboardService,
  authService
} from '../lib/api';
import { eventBus } from '../lib/eventBus';

export function useDashboard() {
  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: () => dashboardService.getStats(),
  });
}

export function useDashboardStats() {
  return useDashboard();
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 5000,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMessages() {
  return useQuery({
    queryKey: ['chat_messages'],
    queryFn: () => chatService.getMessages(),
    refetchInterval: 3000,
  });
}

export function useChatMessages() {
  return useMessages();
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => chatService.sendMessage(text),
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ['chat_messages'] });
      eventBus.emit('NEW_MESSAGE', msg);
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => badgeService.getBadges(),
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => profileService.getHistory(),
  });
}

export function useHistoryLogs() {
  return useHistory();
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => adminService.getDashboardStats(),
  });
}

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => adminService.getDashboardStats(),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getMe(),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['admin_users'],
    queryFn: () => adminService.getUsers(),
  });
}

export function useAdminUsers() {
  return useUsers();
}

export function useAgents() {
  return useQuery({
    queryKey: ['admin_agents'],
    queryFn: async () => {
      const users = await adminService.getUsers();
      return users.filter(u => u.role === 'agent' || u.role === 'admin');
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: () => adminService.getDashboardStats(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; phone: string; role: string; commune: string }) => adminService.createUser(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      queryClient.invalidateQueries({ queryKey: ['admin_agents'] });
      eventBus.emit('USER_UPDATED', user);
    }
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'actif' | 'suspendu' }) => adminService.updateUserStatus(id, status),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      queryClient.invalidateQueries({ queryKey: ['admin_agents'] });
      eventBus.emit('USER_UPDATED', user);
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      queryClient.invalidateQueries({ queryKey: ['admin_agents'] });
      eventBus.emit('USER_UPDATED', id);
    }
  });
}
