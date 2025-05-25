import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/sign-up', '/login','/landing'];
  const isAuthPage = hideSidebarRoutes.includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#121b31] text-white">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <div className="flex relative">
        <Sidebar />
        {/* Divider */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300 hidden md:block" />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-[#121b31] overflow-y-auto transition-all duration-300">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default App;
