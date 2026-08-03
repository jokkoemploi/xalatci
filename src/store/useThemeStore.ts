import { create } from 'zustand';

interface ThemeState {
  theme: 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'light') => void;
}

export const useThemeStore = create<ThemeState>(() => ({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
}));

