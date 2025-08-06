import { Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const currentUser = { name: 'John Admin', email: 'admin@company.com' };

  // Safety check for currentUser
  if (!currentUser || !currentUser.name) {
    return <div>Loading...</div>;
  }

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-open sidebar on desktop, close on mobile
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={currentUser} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen && !isMobile ? 'lg:ml-64 xl:ml-72' : 'ml-0'
      } min-h-screen flex flex-col`}>

  {/* Top Bar */}
{!(isMobile && sidebarOpen) && (
  <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-20">
    <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
              EMS Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              Welcome back, {currentUser.name}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Mobile User Info */}
          <div className="sm:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">3</span>
            </span>
          </button>

          {/* Desktop User Profile */}
          <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs sm:text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="hidden md:block min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
)}


        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
