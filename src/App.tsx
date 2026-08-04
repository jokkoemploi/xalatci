import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useViewStore } from './store/useViewStore';
import { useThemeStore } from './store/useThemeStore';
import { MobileAppContainer } from './components/mobile/MobileAppContainer';
import { AdminPortal } from './components/admin/AdminPortal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const {
    activePortal,
    mobileScreen,
    selectedIncidentId,
    setPortal,
    setMobileScreen,
    setSelectedIncidentId,
    setAdminTab,
  } = useViewStore();
  const { theme } = useThemeStore();
  const { isOnline } = useNetworkStatus();

  const screenToPath = (screen: number, incidentId?: string | null) => {
    switch (screen) {
      case 1: return '/';
      case 2: return '/onboarding-1';
      case 3: return '/onboarding-2';
      case 4: return '/onboarding-3';
      case 5: return '/login';
      case 6: return '/register';
      case 7: return '/forgot-password';
      case 8: return '/dashboard';
      case 9: return '/map';
      case 10: return '/report';
      case 11: return '/camera';
      case 12: return '/report/category';
      case 13: return '/report/location';
      case 14: return '/report/details';
      case 15: return '/report/confirm';
      case 16: return '/signalements';
      case 17: return incidentId ? `/incident/${incidentId}` : '/signalements';
      case 18: return incidentId ? `/incident/${incidentId}/follow-up` : '/signalements';
      case 19: return '/notifications';
      case 20: return '/messages';
      case 21: return '/badges';
      case 22: return '/profile';
      case 23: return '/settings';
      case 24: return '/history';
      case 25: return '/about';
      case 26: return '/theme';
      default: return '/dashboard';
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Real URL path synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncRouteFromPath = () => {
      const path = window.location.pathname.toLowerCase();

      if (path.startsWith('/admin')) {
        setPortal('web_admin');
        if (path === '/admin/incidents') setAdminTab('incidents');
        else if (path === '/admin/users') setAdminTab('users');
        else if (path === '/admin/agents') setAdminTab('agents');
        else if (path === '/admin/categories') setAdminTab('categories');
        else if (path === '/admin/statistics' || path === '/admin/analytics') setAdminTab('analytics');
        else if (path === '/admin/reports') setAdminTab('reports');
        else if (path === '/admin/map') setAdminTab('map_heatmap');
        else if (path === '/admin/settings') setAdminTab('settings');
        else setAdminTab('dashboard');
        return;
      }

      setPortal('mobile_citoyen');
      const routeMap: Record<string, number> = {
        '/': 8,
        '/dashboard': 8,
        '/login': 5,
        '/register': 6,
        '/forgot-password': 7,
        '/map': 9,
        '/report': 10,
        '/camera': 11,
        '/report/category': 12,
        '/report/location': 13,
        '/report/details': 14,
        '/report/confirm': 15,
        '/signalements': 16,
        '/notifications': 19,
        '/messages': 20,
        '/badges': 21,
        '/profile': 22,
        '/settings': 23,
        '/history': 24,
        '/about': 25,
        '/theme': 26,
      };

      const directMatch = Object.entries(routeMap).find(([route]) => route === path);
      if (directMatch) {
        setMobileScreen(directMatch[1] as number);
        return;
      }

      const incidentMatch = path.match(/^\/incident\/([^/]+)(?:\/follow-up)?$/);
      if (incidentMatch) {
        const incidentId = incidentMatch[1];
        setSelectedIncidentId(incidentId);
        setMobileScreen(path.includes('/follow-up') ? 18 : 17);
        return;
      }

      setMobileScreen(8);
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, [setPortal, setMobileScreen, setSelectedIncidentId, setAdminTab]);

  useEffect(() => {
    if (typeof window === 'undefined' || activePortal !== 'mobile_citoyen') return;

    const targetPath = screenToPath(mobileScreen, selectedIncidentId);
    const currentPath = window.location.pathname.toLowerCase();

    if (currentPath !== targetPath) {
      window.history.replaceState({}, '', targetPath);
    }
  }, [activePortal, mobileScreen, selectedIncidentId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans transition-colors duration-200 relative">
      {!isOnline && (
        <div className="sticky top-0 z-50 bg-amber-500 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Mode Hors Ligne : Connexion Internet perdue. L'application tentera de se resynchroniser automatiquement.</span>
        </div>
      )}
      {activePortal === 'mobile_citoyen' ? (
        <MobileAppContainer />
      ) : (
        <AdminPortal />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

