import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuthStore } from './store/useAuthStore';
import { useEffect, useState } from 'react';
import type { IAuthStore } from './lib/types&interfaces/auth';
import RippleLoader from './components/RippleLoader';
import { Menu } from 'lucide-react';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import OfflinePage from './components/OfflinePage';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isOnline } = useOnlineStatus();

  const checkAuth = useAuthStore((state: IAuthStore) => state.checkAuth);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const location = useLocation();
  const hideSidebarRoutes = ['/sign-up', '/login', '/landing', '/join-mess', '/create-mess', '/entry-options'];
  const isAuthPage = hideSidebarRoutes.includes(location.pathname);

  if (isCheckingAuth) {
    return (
      <RippleLoader size="lg" />
    );
  }

  // Global Offline Check for Unauthenticated Users
  // If we are offline and don't have a user session, show the offline page
  // logic: if online is false AND no user, we can't do anything.
  if (!isOnline && !authUser) {
    return <OfflinePage />;
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#121b31] text-white">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex h-screen text-white relative">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-1 left-1 p-2 bg-[#0F1729] rounded-md z-50"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Divider */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300 hidden md:block" />

      {/* Main Content */}
      <main className="flex-1 bg-[#121b31] overflow-y-auto transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
export default App;