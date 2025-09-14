import axios from "axios";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/employees/dasboard`);

      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastUpdated(new Date(response.data.data.lastUpdated));
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Icon mapping for activities
  const getActivityIcon = (iconName) => {
    const iconMap = {
      CheckCircle,
      Calendar,
      CheckSquare,
      UserPlus,
      BarChart2,
      Activity,
      Users,
      Clock,
      AlertTriangle,
    };
    return iconMap[iconName] || Activity;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    trend,
    description,
  }) => (
    <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-gray-600 text-xs sm:text-sm font-medium uppercase tracking-wider truncate">
              {title}
            </p>
            {trend !== undefined && trend !== null && (
              <div
                className={`flex items-center px-2 py-1 rounded-full ${
                  trend >= 0 ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend >= 0 ? "+" : ""}
                  {trend}%
                </span>
              </div>
            )}
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    color,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className={`p-4 sm:p-5 lg:p-6 ${color} rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-left group w-full`}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-current mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
      <p className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2">
        {title}
      </p>
      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
    </button>
  );

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center bg-white rounded-2xl p-6 border border-red-200">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Failed to Load Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard render
  const { dashboardStats, trends, recentActivities, analytics } = dashboardData;

  return (
    <div className="sm:space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
            {lastUpdated && (
              <span className="block text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-3">
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center"
          >
            <RefreshCw
              className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span className="text-sm sm:text-base font-semibold">Refresh</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">View All</span>
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={Users}
          title="Total Employees"
          value={dashboardStats.totalEmployees}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={trends?.totalEmployees}
          description="Active workforce"
        />
        <StatCard
          icon={CheckCircle}
          title="Present Today"
          value={dashboardStats.presentToday}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={trends?.presentToday}
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
          trend={trends?.pendingTasks}
          description="Requires attention"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Activities */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Recent Activities
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities?.map((activity) => {
              const IconComponent = getActivityIcon(activity.icon);
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border-2 border-current ${activity.color}`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-800 text-sm sm:text-base font-medium truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
            <QuickActionCard
              icon={Clock}
              title="Mark Attendance"
              description="Check in/out"
              color="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
              onClick={() => navigate("/attendance")}
            />
            <QuickActionCard
              icon={CheckSquare}
              title="View Tasks"
              description="Pending work"
              color="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
              onClick={() => navigate("/tasks")}
            />
            <QuickActionCard
              icon={Calendar}
              title="Request Leave"
              description="Apply for time off"
              color="bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200"
              onClick={() => navigate("/leaves")}
            />
            <QuickActionCard
              icon={UserPlus}
              title="New Lead"
              description="Add prospect"
              color="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
              onClick={() => navigate("/leads")}
            />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">New Leads</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                {dashboardStats.newLeads}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-orange-600 text-sm">
                  This week{" "}
                  {trends?.newLeads &&
                    `(${trends.newLeads >= 0 ? "+" : ""}${trends.newLeads}%)`}
                </span>
              </div>
            </div>
            <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Pending Leaves
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                {dashboardStats.pendingLeaves}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-blue-600 text-sm">Awaiting approval</span>
              </div>
            </div>
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Attendance Rate
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                {dashboardStats.attendanceRate || analytics?.attendance?.rate}%
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 text-sm">Today</span>
              </div>
            </div>
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Analytics Section (if available) */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {analytics.tasks && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Task Analytics
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {analytics.tasks.completed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {analytics.tasks.inProgress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-sm font-semibold text-red-600">
                    {analytics.tasks.pending}
                  </span>
                </div>
              </div>
            </div>
          )}

          {analytics.leads && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Lead Analytics
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {analytics.leads.new}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interested:</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {analytics.leads.interested}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Converted:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {analytics.leads.converted}
                  </span>
                </div>
              </div>
            </div>
          )}

          {analytics.leaves && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Leave Analytics
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {analytics.leaves.pending}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approved:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {analytics.leaves.approved}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rejected:</span>
                  <span className="text-sm font-semibold text-red-600">
                    {analytics.leaves.rejected}
                  </span>
                </div>
              </div>
            </div>
          )}

          {analytics.attendance && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Attendance Analytics
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Present:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {analytics.attendance.present}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Absent:</span>
                  <span className="text-sm font-semibold text-red-600">
                    {analytics.attendance.absent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">On Leave:</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {analytics.attendance.onLeave}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
