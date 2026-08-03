import { create } from 'zustand';
import { Incident } from '../types';

interface IncidentState {
  selectedIncidentId: string | null;
  activeFilter: 'TOUS' | 'EN_ATTENTE' | 'PRIS_EN_CHARGE' | 'EN_COURS' | 'RESOLU' | 'REJETEE';
  selectedCategory: string | null;
  searchQuery: string;
  setSelectedIncidentId: (id: string | null) => void;
  setActiveFilter: (filter: 'TOUS' | 'EN_ATTENTE' | 'PRIS_EN_CHARGE' | 'EN_COURS' | 'RESOLU' | 'REJETEE') => void;
  setSelectedCategory: (cat: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  selectedIncidentId: null,
  activeFilter: 'TOUS',
  selectedCategory: null,
  searchQuery: '',
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
