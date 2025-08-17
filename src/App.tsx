import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuthStore } from './store/useAuthStore';
import { useEffect, useState } from 'react';
import type { IAuthStore } from './lib/types&interfaces/auth';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Menu } from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const checkAuth = useAuthStore((state: IAuthStore) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const location = useLocation();
  const hideSidebarRoutes = ['/sign-up', '/login', '/landing', '/join-mess', '/create-mess', '/entry-options'];
  const isAuthPage = hideSidebarRoutes.includes(location.pathname);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl scale-150" />

          {/* Lottie animation */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-64 xl:h-64">
            <DotLottieReact
              src="https://lottie.host/26dfed0f-655e-4d48-bbd1-86cc7bdfd29c/Ia0U6ar4rU.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
        </div>
      </div>


    );
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