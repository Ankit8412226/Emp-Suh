import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Clock,
  TrendingUp,
  FileText,
  Edit,
  Camera,
  Download,
  Share,
  Star,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Bell
} from 'lucide-react';
import { useState } from 'react';

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Mock employee data
  const [employee, _setEmployee] = useState({
    id: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Full Stack Developer',
    department: 'Development',
    manager: 'Sarah Wilson',
    joinDate: '2022-01-15',
    location: 'New York, NY',
    avatar: null,
    bio: 'Experienced full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and mentoring junior developers.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
    certifications: [
      { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2023-06-15' },
      { name: 'React Professional', issuer: 'Meta', date: '2022-12-10' }
    ],
    performance: {
      overall: 4.5,
      technical: 4.8,
      communication: 4.2,
      leadership: 4.0,
      punctuality: 4.7
    },
    attendance: {
      present: 95,
      absent: 3,
      late: 2,
      onTime: 93
    },
    projects: [
      { name: 'E-commerce Platform', status: 'Completed', role: 'Lead Developer', duration: '6 months' },
      { name: 'Mobile App Redesign', status: 'In Progress', role: 'Frontend Developer', duration: '3 months' },
      { name: 'API Integration', status: 'Completed', role: 'Backend Developer', duration: '2 months' }
    ],
    recentActivities: [
      { type: 'task', message: 'Completed user authentication module', time: '2 hours ago', status: 'success' },
      { type: 'meeting', message: 'Attended sprint planning meeting', time: '4 hours ago', status: 'info' },
      { type: 'review', message: 'Code review completed for PR #123', time: '1 day ago', status: 'success' },
      { type: 'training', message: 'Completed AWS training module', time: '2 days ago', status: 'info' }
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const StatCard = ({ icon: _Icon, title, value, change, color, description }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <div className="flex items-center">
              <TrendingUp className={`w-3 h-3 mr-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  const PerformanceBar = ({ label, value, max = 5 }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-700 w-24">{label}</span>
      <div className="flex-1 mx-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(value / max) * 100}%` }}
          ></div>
        </div>
      </div>
      <span className="text-sm font-bold text-gray-900 w-8">{value}</span>
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
        case 'task': return CheckCircle;
        case 'meeting': return MessageCircle;
        case 'review': return FileText;
        case 'training': return Award;
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {employee.firstName[0]}{employee.lastName[0]}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-lg text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">{employee.department}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{employee.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{employee.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{employee.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">Reports to {employee.manager}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{employee.bio}</p>
          </div>
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
          <div className="space-y-3">
            {employee.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(cert.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-1">
          {employee.recentActivities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Star}
          title="Overall Rating"
          value={employee.performance.overall}
          change={5.2}
          color="bg-yellow-500"
          description="Out of 5.0"
        />
        <StatCard
          icon={Target}
          title="Goals Met"
          value="87%"
          change={12.5}
          color="bg-green-500"
          description="This quarter"
        />
        <StatCard
          icon={Award}
          title="Achievements"
          value="12"
          change={8.3}
          color="bg-purple-500"
          description="This year"
        />
        <StatCard
          icon={TrendingUp}
          title="Growth"
          value="+15%"
          change={3.2}
          color="bg-blue-500"
          description="vs last year"
        />
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6">Performance Breakdown</h3>
        <div className="space-y-4">
          <PerformanceBar label="Technical Skills" value={employee.performance.technical} />
          <PerformanceBar label="Communication" value={employee.performance.communication} />
          <PerformanceBar label="Leadership" value={employee.performance.leadership} />
          <PerformanceBar label="Punctuality" value={employee.performance.punctuality} />
        </div>
      </div>

      {/* Performance History */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Performance History</h3>
        <div className="h-64 flex items-end space-x-2">
          {[4.2, 4.3, 4.1, 4.4, 4.5, 4.3, 4.6, 4.5, 4.4, 4.7, 4.5, 4.5].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(value / 5) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {employee.projects.map((project, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600">Role: {project.role}</p>
                <p className="text-sm text-gray-600">Duration: {project.duration}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'Completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Started: Jan 2024</span>
              <span>Team Size: 5</span>
              <span>Technologies: React, Node.js, MongoDB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle}
          title="Present Days"
          value={employee.attendance.present}
          change={2.1}
          color="bg-green-500"
          description="This month"
        />
        <StatCard
          icon={AlertCircle}
          title="Absent Days"
          value={employee.attendance.absent}
          change={-1.5}
          color="bg-red-500"
          description="This month"
        />
        <StatCard
          icon={Clock}
          title="Late Arrivals"
          value={employee.attendance.late}
          change={-0.8}
          color="bg-yellow-500"
          description="This month"
        />
        <StatCard
          icon={Target}
          title="On Time"
          value={`${employee.attendance.onTime}%`}
          change={3.2}
          color="bg-blue-500"
          description="Punctuality rate"
        />
      </div>

      {/* Attendance Calendar */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Attendance Calendar</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                Math.random() > 0.1 
                  ? 'bg-green-100 text-green-800' 
                  : Math.random() > 0.05 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span className="text-gray-600">Late</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span className="text-gray-600">Absent</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Employment Contract', type: 'PDF', size: '2.4 MB', date: '2022-01-15' },
          { name: 'Performance Review 2023', type: 'PDF', size: '1.8 MB', date: '2023-12-15' },
          { name: 'Training Certificate', type: 'PDF', size: '0.9 MB', date: '2023-06-15' },
          { name: 'ID Document', type: 'JPG', size: '1.2 MB', date: '2022-01-10' },
          { name: 'Resume', type: 'PDF', size: '0.7 MB', date: '2022-01-05' },
          { name: 'Emergency Contact', type: 'PDF', size: '0.5 MB', date: '2022-01-12' }
        ].map((doc, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{doc.type} • {doc.size}</p>
            <p className="text-xs text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'performance': return renderPerformance();
      case 'projects': return renderProjects();
      case 'attendance': return renderAttendance();
      case 'documents': return renderDocuments();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
          <p className="text-gray-600 mt-1">Detailed view of employee information and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
