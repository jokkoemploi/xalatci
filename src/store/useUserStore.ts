import { create } from 'zustand';
import { UserProfile } from '../types';

interface UserState {
  selectedUser: UserProfile | null;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  setSelectedUser: (user: UserProfile | null) => void;
  setSearchTerm: (term: string) => void;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  searchTerm: '',
  roleFilter: 'Tous',
  statusFilter: 'Tous',
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setRoleFilter: (role) => set({ roleFilter: role }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
