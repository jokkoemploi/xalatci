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
  const { activePortal, setPortal, setMobileScreen, setAdminTab } = useViewStore();
  const { theme } = useThemeStore();
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Real URL path synchronization
  useEffect(() => {
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
      } else {
        setPortal('mobile_citoyen');
        if (path === '/login') setMobileScreen(5);
        else if (path === '/register') setMobileScreen(6);
        else if (path === '/map') setMobileScreen(9);
        else if (path === '/report') setMobileScreen(10);
        else if (path === '/history') setMobileScreen(24);
        else if (path === '/profile') setMobileScreen(22);
        else if (path === '/settings') setMobileScreen(23);
        else if (path === '/notifications') setMobileScreen(19);
        else if (path === '/messages') setMobileScreen(20);
        else if (path === '/about') setMobileScreen(25);
        else if (path === '/badges') setMobileScreen(21);
        else if (path === '/dashboard') setMobileScreen(8);
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, [setPortal, setMobileScreen, setAdminTab]);

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

