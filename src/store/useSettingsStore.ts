import { create } from 'zustand';

interface SettingsState {
  municipalityName: string;
  autoAssignAgents: boolean;
  pushNotificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  setSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  municipalityName: 'Ville de Dakar',
  autoAssignAgents: true,
  pushNotificationsEnabled: true,
  emailAlertsEnabled: true,
  setSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
}));
