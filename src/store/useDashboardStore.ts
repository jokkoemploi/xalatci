import { create } from 'zustand';

interface DashboardState {
  periodFilter: '7d' | '30d' | '90d' | 'year';
  statusFilter: string;
  categoryFilter: string;
  communeFilter: string;
  searchQuery: string;
  setPeriodFilter: (p: '7d' | '30d' | '90d' | 'year') => void;
  setStatusFilter: (s: string) => void;
  setCategoryFilter: (c: string) => void;
  setCommuneFilter: (commune: string) => void;
  setSearchQuery: (q: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  periodFilter: '30d',
  statusFilter: 'Tous',
  categoryFilter: 'Toutes',
  communeFilter: 'Toutes',
  searchQuery: '',
  setPeriodFilter: (periodFilter) => set({ periodFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setCommuneFilter: (communeFilter) => set({ communeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
