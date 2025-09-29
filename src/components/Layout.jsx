import { Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch logged-in user from localStorage
  useEffect(() => {
    const empData = localStorage.getItem('user');
    if (empData) {
      try {
        const user = JSON.parse(empData);
        setCurrentUser(user);
      } catch (err) {
        console.error("Error parsing emp from localStorage", err);
      }
    }
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-toggle sidebar
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Set default user if not found in localStorage
  useEffect(() => {
    // If after 2 seconds we still don't have user data, use the hardcoded data
    const timer = setTimeout(() => {
      if (!currentUser) {
        const defaultUser = {
          id: "68da4c8ed554c46a66dacafa",
          name: "Ankit Kumar",
          email: "ankit.kumar@suhtech.com",
          role: "admin",
          designation: "Chief Technical Officer",
          department: "Technology"
        };
        setCurrentUser(defaultUser);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentUser]);
  
  // Skip loading screen - render with default values if needed
  if (!currentUser) {
    // Instead of showing loading, initialize with empty values
    // This will be replaced when user data loads
    const tempUser = { name: "User", role: "employee" };
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={tempUser} />
        <div className="transition-all duration-300 ease-in-out ml-0 min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2">
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-4 md:p-4 lg:p-8 overflow-x-hidden">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-20 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-20 bg-gray-200 rounded col-span-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={currentUser} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen && !isMobile ? 'lg:ml-64 xl:ml-72' : 'ml-0'
      } min-h-screen flex flex-col`}>

        {/* Top Bar */}
        {!(isMobile && sidebarOpen) && (
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                {/* Left */}
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

                {/* Right */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  {/* Mobile Avatar */}
                  <div className="sm:hidden flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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

                  {/* Desktop User */}
                  <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="hidden md:block min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
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
