import {
  Activity,
  AlertTriangle,
  BarChart2,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  PlusCircle,
  TrendingUp,
  UserPlus,
  Users
} from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 45,
    presentToday: 38,
    onLeave: 5,
    pendingTasks: 12,
    newLeads: 8,
    pendingLeaves: 3
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'attendance', message: 'Sarah Wilson checked in', time: '9:15 AM', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'leave', message: 'Mike Johnson requested leave', time: '8:30 AM', icon: Calendar, color: 'text-blue-500' },
    { id: 3, type: 'task', message: 'Task "Update Documentation" completed', time: '8:00 AM', icon: CheckSquare, color: 'text-purple-500' },
    { id: 4, type: 'lead', message: 'New lead assigned to team', time: '7:45 AM', icon: UserPlus, color: 'text-orange-500' },
    { id: 5, type: 'system', message: 'Monthly report generated', time: '7:30 AM', icon: BarChart2, color: 'text-gray-500' }
  ]);

  const StatCard = ({ icon: Icon, title, value, color, trend, description }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-5 lg:p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-gray-600 text-xs sm:text-sm font-medium uppercase tracking-wider truncate">{title}</p>
            {trend && (
              <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600 text-xs font-semibold">+{trend}%</span>
              </div>
            )}
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, color, onClick }) => (
    <button
      onClick={onClick}
      className={`p-4 sm:p-5 lg:p-6 ${color} rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-left group shadow-md hover:shadow-lg touch-manipulation w-full`}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-current mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
      <p className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2">{title}</p>
      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
    </button>
  );

  return (
    <div className=" sm:space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-3">
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 touch-manipulation">
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base font-semibold">Quick Action</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center touch-manipulation">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">View All</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={Users}
          title="Total Employees"
          value={dashboardStats.totalEmployees}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend="5"
          description="Active workforce"
        />
        <StatCard
          icon={CheckCircle}
          title="Present Today"
          value={dashboardStats.presentToday}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend="2"
          description="Currently online"
        />
        <StatCard
          icon={Calendar}
          title="On Leave"
          value={dashboardStats.onLeave}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          description="Away today"
        />
        <StatCard
          icon={AlertTriangle}
          title="Pending Tasks"
          value={dashboardStats.pendingTasks}
          color="bg-gradient-to-r from-red-500 to-red-600"
          description="Requires attention"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

        {/* Recent Activities - Takes 2 columns on XL screens */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activities</h3>
            <button className="text-sm text-green-600 hover:text-green-700 font-semibold">View All</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm border-2 border-current ${activity.color}`}>
                    <activity.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-800 text-sm sm:text-base font-medium truncate">{activity.message}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - Takes 1 column on XL screens */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
            <QuickActionCard
              icon={Clock}
              title="Mark Attendance"
              description="Check in/out"
              color="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
              onClick={() => console.log('Mark attendance')}
            />
            <QuickActionCard
              icon={CheckSquare}
              title="View Tasks"
              description="Pending work"
              color="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
              onClick={() => console.log('View tasks')}
            />
            <QuickActionCard
              icon={Calendar}
              title="Request Leave"
              description="Apply for time off"
              color="bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200"
              onClick={() => console.log('Request leave')}
            />
            <QuickActionCard
              icon={UserPlus}
              title="New Lead"
              description="Add prospect"
              color="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
              onClick={() => console.log('New lead')}
            />
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">New Leads</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{dashboardStats.newLeads}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-orange-600 text-sm">This week</span>
              </div>
            </div>
            <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Leaves</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{dashboardStats.pendingLeaves}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-blue-600 text-sm">Awaiting approval</span>
              </div>
            </div>
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">84%</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 text-sm">Today</span>
              </div>
            </div>
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
