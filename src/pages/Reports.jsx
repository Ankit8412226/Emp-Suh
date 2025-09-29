import {
    Activity,
    Award,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileText,
    RefreshCw,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data for reports
  const mockData = {
    attendance: {
      totalEmployees: 45,
      presentToday: 42,
      absentToday: 3,
      onLeave: 2,
      averageAttendance: 94.2,
      monthlyTrend: [92, 94, 96, 93, 95, 94, 97, 96, 94, 95, 96, 94]
    },
    performance: {
      highPerformers: 12,
      averagePerformers: 28,
      lowPerformers: 5,
      completedTasks: 156,
      pendingTasks: 23,
      overdueTasks: 7
    },
    departments: [
      { name: 'Development', employees: 18, attendance: 96.5, productivity: 92 },
      { name: 'Design', employees: 8, attendance: 94.2, productivity: 88 },
      { name: 'Marketing', employees: 6, attendance: 91.8, productivity: 85 },
      { name: 'HR', employees: 4, attendance: 98.1, productivity: 90 },
      { name: 'Finance', employees: 3, attendance: 95.5, productivity: 87 },
      { name: 'Operations', employees: 6, attendance: 93.2, productivity: 89 }
    ],
    recentActivities: [
      { type: 'attendance', message: 'John Doe checked in late', time: '2 hours ago', status: 'warning' },
      { type: 'task', message: 'Project Alpha completed', time: '3 hours ago', status: 'success' },
      { type: 'leave', message: 'Sarah Wilson applied for leave', time: '5 hours ago', status: 'info' },
      { type: 'performance', message: 'Mike Johnson exceeded targets', time: '1 day ago', status: 'success' }
    ]
  };

  const StatCard = ({ icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <div className="flex items-center">
              <TrendingUp className={`w-4 h-4 mr-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Details
        </button>
      </div>
      {children}
    </div>
  );

  const SimpleBarChart = ({ data, labels, color = "bg-blue-500" }) => (
    <div className="space-y-3">
      {data.map((value, index) => (
        <div key={index} className="flex items-center">
          <div className="w-20 text-sm text-gray-600 truncate">{labels[index]}</div>
          <div className="flex-1 mx-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${(value / Math.max(...data)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 text-sm font-medium text-gray-900">{value}%</div>
        </div>
      ))}
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'success': return 'text-green-600 bg-green-50';
        case 'warning': return 'text-yellow-600 bg-yellow-50';
        case 'error': return 'text-red-600 bg-red-50';
        default: return 'text-blue-600 bg-blue-50';
      }
    };

    const getIcon = (type) => {
      switch (type) {
        case 'attendance': return Clock;
        case 'task': return CheckCircle;
        case 'leave': return Calendar;
        case 'performance': return Award;
        default: return Activity;
      }
    };

    const Icon = getIcon(activity.type);

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  const handleExport = async (entity, format) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/export/${entity}?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${entity}.${format === 'json' ? 'json' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert(e.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your workforce</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
            <option value="operations">Operations</option>
          </select>
          <button
            onClick={() => handleExport('employees', 'csv')}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Employees CSV
          </button>
          <button
            onClick={() => handleExport('attendance', 'csv')}
            disabled={loading}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Attendance CSV
          </button>
          <button
            onClick={() => handleExport('leads', 'csv')}
            disabled={loading}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Leads CSV
          </button>
          <button
            onClick={() => handleExport('salaries', 'csv')}
            disabled={loading}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Salaries CSV
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Employees"
          value={mockData.attendance.totalEmployees}
          change={5.2}
          color="bg-blue-500"
          description="Active workforce"
        />
        <StatCard
          icon={CheckCircle}
          title="Attendance Rate"
          value={`${mockData.attendance.averageAttendance}%`}
          change={2.1}
          color="bg-green-500"
          description="Monthly average"
        />
        <StatCard
          icon={Target}
          title="Productivity"
          value="89.3%"
          change={-1.2}
          color="bg-purple-500"
          description="Overall performance"
        />
        <StatCard
          icon={Briefcase}
          title="Active Projects"
          value="12"
          change={8.5}
          color="bg-orange-500"
          description="In progress"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <ChartCard title="Attendance Trend">
          <div className="h-64 flex items-end space-x-2">
            {mockData.attendance.monthlyTrend.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(value / 100) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Department Performance */}
        <ChartCard title="Department Performance">
          <SimpleBarChart
            data={mockData.departments.map(d => d.productivity)}
            labels={mockData.departments.map(d => d.name)}
            color="bg-green-500"
          />
        </ChartCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <ChartCard title="Department Breakdown" className="lg:col-span-2">
          <div className="space-y-4">
            {mockData.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                    <p className="text-sm text-gray-600">{dept.employees} employees</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{dept.attendance}%</p>
                  <p className="text-xs text-gray-500">attendance</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{dept.productivity}%</p>
                  <p className="text-xs text-gray-500">productivity</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activities */}
        <ChartCard title="Recent Activities">
          <div className="space-y-1">
            {mockData.recentActivities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Task Completion">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {mockData.performance.completedTasks}
            </div>
            <p className="text-sm text-gray-600 mb-4">Completed this month</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium">{mockData.performance.pendingTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overdue</span>
                <span className="font-medium text-red-600">{mockData.performance.overdueTasks}</span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Performance Distribution">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Performers</span>
              <span className="font-medium text-green-600">{mockData.performance.highPerformers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average</span>
              <span className="font-medium text-blue-600">{mockData.performance.averagePerformers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Needs Improvement</span>
              <span className="font-medium text-red-600">{mockData.performance.lowPerformers}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Generate Payroll Report</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Attendance Summary</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Performance Review</span>
              </div>
            </button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Reports;
