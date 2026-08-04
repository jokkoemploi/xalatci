import { create } from 'zustand';

export type MobileScreenNumber = 
  | 1 // Splash Screen
  | 2 // Onboarding 1
  | 3 // Onboarding 2
  | 4 // Onboarding 3
  | 5 // Connexion
  | 6 // Inscription
  | 7 // Mot de passe oublié
  | 8 // Dashboard citoyen (Accueil)
  | 9 // Carte des incidents
  | 10 // Signaler un incident
  | 11 // Prendre une photo
  | 12 // Choix de la catégorie
  | 13 // Localisation GPS
  | 14 // Description
  | 15 // Confirmation
  | 16 // Mes signalements
  | 17 // Détail d'un signalement
  | 18 // Évolution / Suivi
  | 19 // Notifications
  | 20 // Messagerie
  | 21 // Badges
  | 22 // Profil
  | 23 // Paramètres
  | 24 // Historique
  | 25 // À propos
  | 26; // Mode sombre

export type AdminTab = 
  | 'dashboard'
  | 'incidents'
  | 'pending_incidents'
  | 'in_progress_incidents'
  | 'resolved_incidents'
  | 'map_heatmap'
  | 'users'
  | 'agents'
  | 'categories'
  | 'chat_support'
  | 'analytics'
  | 'reports'
  | 'settings'
  | 'logs';

export interface NewReportDraft {
  photoUrl: string;
  category: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    commune?: string;
  };
  title: string;
  description: string;
  urgency: 'Faible' | 'Moyenne' | 'Critique';
}

interface ViewState {
  activePortal: 'mobile_citoyen' | 'web_admin';
  mobileScreen: MobileScreenNumber;
  adminTab: AdminTab;
  selectedIncidentId: string | null;
  reportDraft: NewReportDraft;

  setPortal: (portal: 'mobile_citoyen' | 'web_admin') => void;
  setMobileScreen: (screen: MobileScreenNumber) => void;
  setAdminTab: (tab: AdminTab) => void;
  setSelectedIncidentId: (id: string | null) => void;
  updateReportDraft: (partial: Partial<NewReportDraft>) => void;
  resetReportDraft: () => void;
}

const initialDraft: NewReportDraft = {
  photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
  category: 'Routes & Voirie',
  location: {
    address: 'Avenue Lamine Guèye, Dakar Plateau, Dakar',
    lat: 14.6710,
    lng: -17.4380,
    commune: 'Dakar Plateau'
  },
  title: '',
  description: '',
  urgency: 'Moyenne'
};

export const useViewStore = create<ViewState>((set) => ({
  activePortal: 'mobile_citoyen',
  mobileScreen: 1, // Start with the onboarding/splash flow before login and dashboard access
  adminTab: 'dashboard',
  selectedIncidentId: 'inc-1',
  reportDraft: initialDraft,

  setPortal: (activePortal) => set({ activePortal }),
  setMobileScreen: (mobileScreen) => set({ mobileScreen }),
  setAdminTab: (adminTab) => set({ adminTab }),
  setSelectedIncidentId: (selectedIncidentId) => set({ selectedIncidentId }),
  updateReportDraft: (partial) =>
    set((state) => ({ reportDraft: { ...state.reportDraft, ...partial } })),
  resetReportDraft: () => set({ reportDraft: initialDraft }),
}));
