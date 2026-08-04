import React from 'react';
import { useViewStore, MobileScreenNumber } from '../../store/useViewStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Home, 
  ListOrdered, 
  Plus, 
  Bell, 
  User, 
  Wifi, 
  Battery, 
  Signal,
  Smartphone
} from 'lucide-react';

import {
  Screen1_Splash,
  Screen2_Onboarding1,
  Screen3_Onboarding2,
  Screen4_Onboarding3,
  Screen5_Connexion,
  Screen6_Inscription,
  Screen7_MotDePasseOublie
} from './screens/Screen1to7_AuthOnboarding';

import {
  Screen8_AccueilDashboard,
  Screen9_CarteIncidents,
  Screen10_SignalerIncident,
  Screen11_PrendrePhoto,
  Screen12_ChoixCategorie,
  Screen13_LocalisationGps,
  Screen14_Description,
  Screen15_Confirmation
} from './screens/Screen8to15_DashboardAndReport';

import {
  Screen16_MesSignalements,
  Screen17_DetailSignalement,
  Screen18_EvolutionSuivi,
  Screen19_Notifications,
  Screen20_Messagerie,
  Screen21_Badges,
  Screen22_Profil,
  Screen23_Parametres,
  Screen24_Historique,
  Screen25_APropos,
  Screen26_ModeSombre
} from './screens/Screen16to26_CitizenDetailsAndProfile';

export const MobileAppContainer: React.FC = () => {
  const { mobileScreen, setMobileScreen } = useViewStore();
  const { isAuthenticated } = useAuthStore();

  const renderScreenContent = () => {
    // Access control: if trying to access dashboard/app screens while not authenticated, prompt to login
    if (!isAuthenticated && mobileScreen >= 8) {
      return <Screen5_Connexion />;
    }

    switch (mobileScreen) {
      case 1: return <Screen1_Splash />;
      case 2: return <Screen2_Onboarding1 />;
      case 3: return <Screen3_Onboarding2 />;
      case 4: return <Screen4_Onboarding3 />;
      case 5: return <Screen5_Connexion />;
      case 6: return <Screen6_Inscription />;
      case 7: return <Screen7_MotDePasseOublie />;
      case 8: return <Screen8_AccueilDashboard />;
      case 9: return <Screen9_CarteIncidents />;
      case 10: return <Screen10_SignalerIncident />;
      case 11: return <Screen11_PrendrePhoto />;
      case 12: return <Screen12_ChoixCategorie />;
      case 13: return <Screen13_LocalisationGps />;
      case 14: return <Screen14_Description />;
      case 15: return <Screen15_Confirmation />;
      case 16: return <Screen16_MesSignalements />;
      case 17: return <Screen17_DetailSignalement />;
      case 18: return <Screen18_EvolutionSuivi />;
      case 19: return <Screen19_Notifications />;
      case 20: return <Screen20_Messagerie />;
      case 21: return <Screen21_Badges />;
      case 22: return <Screen22_Profil />;
      case 23: return <Screen23_Parametres />;
      case 24: return <Screen24_Historique />;
      case 25: return <Screen25_APropos />;
      case 26: return <Screen26_ModeSombre />;
      default: return <Screen8_AccueilDashboard />;
    }
  };

  // Hide bottom tab bar on auth / full camera screens, and when the user is redirected to login from a protected route.
  const hideBottomBar = [1, 2, 3, 4, 5, 6, 7, 11].includes(mobileScreen) || (!isAuthenticated && mobileScreen >= 8);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between items-center">
      <div className="w-full max-w-lg min-h-screen bg-white flex flex-col relative shadow-md border-x border-[#E5E7EB]">
        
        {/* Screen Content View */}
        <div className="flex-1 w-full relative overflow-y-auto">
          {renderScreenContent()}
        </div>

        {/* Bottom Navigation Bar */}
        {!hideBottomBar && (
          <div className="sticky bottom-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] flex items-center justify-around px-2 z-30 select-none shadow-lg">
            <button
              onClick={() => setMobileScreen(8)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
                mobileScreen === 8 ? 'text-[#1E5EFF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => setMobileScreen(16)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
                mobileScreen === 16 ? 'text-[#1E5EFF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ListOrdered className="w-5 h-5" />
              <span>Signalements</span>
            </button>

            {/* Central Floating Button */}
            <button
              onClick={() => setMobileScreen(10)}
              className="w-12 h-12 rounded-full bg-[#1E5EFF] text-white flex items-center justify-center shadow-lg -mt-6 ring-4 ring-white hover:bg-blue-700 transition active:scale-95"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>

            <button
              onClick={() => setMobileScreen(19)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
                mobileScreen === 19 ? 'text-[#1E5EFF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setMobileScreen(22)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
                mobileScreen === 22 ? 'text-[#1E5EFF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profil</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
