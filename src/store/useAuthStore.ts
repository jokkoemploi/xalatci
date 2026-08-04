import { create } from 'zustand';
import { UserProfile } from '../types';
import { authService, profileService } from '../lib/api';
import { eventBus } from '../lib/eventBus';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(email);
      set({ user: res.user, isAuthenticated: true, isLoading: false });
      eventBus.emit('LOGIN_SUCCESS', res.user);
      eventBus.emit('USER_UPDATED', res.user);
    } catch {
      set({ isLoading: false });
    }
  },

  register: async (name: string, email: string, phone: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.register({ name, email, phone });
      set({ user: res.user, isAuthenticated: true, isLoading: false });
      eventBus.emit('LOGIN_SUCCESS', res.user);
    } catch {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('xalat_token');
    set({ user: null, isAuthenticated: false });
    eventBus.emit('LOGOUT');
  },

  fetchUser: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
      eventBus.emit('USER_UPDATED', user);
    } catch {
      // Keep default
    }
  },

  updateProfile: async (data) => {
    try {
      const updated = await profileService.updateProfile(data);
      set({ user: updated });
      eventBus.emit('PROFILE_UPDATED', updated);
      eventBus.emit('USER_UPDATED', updated);
    } catch {
      // ignore
    }
  }
}));
