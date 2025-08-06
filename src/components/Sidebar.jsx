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
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen, currentUser }) => {
  const { pathname } = useLocation();
  const userRole = currentUser?.role; // You can fetch from localStorage/context

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

  return (
    <div className={`fixed inset-y-0 left-0  bg-white shadow-xl border-r border-green-100 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 flex flex-col`}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">EMS Dashboard</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link to={item.path} key={item.id} className="block">
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="flex-shrink-0 px-4 py-5 border-t border-green-100 bg-gray-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>

        <button
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          onClick={() => window.location.href = '/login'}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
