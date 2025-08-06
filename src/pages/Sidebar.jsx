import {
  BarChart3,
  Calendar,
  CheckSquare,
  Clock,
  LayoutDashboard,
  LogOut,
  Settings,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const empData = localStorage.getItem('emp');
    if (empData) {
      try {
        setCurrentUser(JSON.parse(empData));
      } catch (err) {
        console.error("Failed to parse emp data", err);
      }
    }

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!currentUser || !currentUser.name) {
    return null;
  }

  const userRole = currentUser.role;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'employees', label: 'Employees', icon: Users, path: '/employees', roles: ['admin', 'team-lead'] },
    { id: 'attendance', label: 'Attendance', icon: Clock, path: '/attendance' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { id: 'leads', label: 'Leads', icon: UserPlus, path: '/leads' },
    { id: 'leaves', label: 'Leave Management', icon: Calendar, path: '/leaves' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const filteredItems = sidebarItems.filter(item => !item.roles || item.roles.includes(userRole));

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('emp');
    console.log('Logout clicked');
    // You can redirect to login page here
  };


  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 bg-white shadow-2xl border-r border-green-100 transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-full xs:w-80 sm:w-72 lg:w-64 xl:w-72 flex flex-col max-w-sm pt-[64px] sm:pt-[80px]`}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate">EMS</h2>
                <p className="text-xs text-gray-600 truncate">Employee Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1.5 -mr-1 rounded-lg hover:bg-gray-100 active:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {filteredItems.map(item => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200 shadow-sm scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100 hover:scale-102'
                } transform`}
              >
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 ${
                  isActive ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <span className="font-medium text-xs sm:text-sm truncate flex-1">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex-shrink-0 px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 border-t border-green-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-xs sm:text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 capitalize flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                {userRole}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full group flex items-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:py-3 text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-xs sm:text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
