import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Building,
  Clock,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Palette,
  Save,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock settings data
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Development',
      position: 'Senior Developer',
      employeeId: 'EMP001',
      joinDate: '2022-01-15',
      avatar: null
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      taskReminders: true,
      leaveApprovals: true,
      attendanceAlerts: true,
      weeklyReports: false,
      systemUpdates: true
    },
    company: {
      companyName: 'SUH Tech Solutions',
      industry: 'Information Technology',
      size: '50-100',
      timezone: 'America/New_York',
      workingHours: {
        start: '09:00',
        end: '18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      holidays: [
        { name: 'New Year', date: '2024-01-01' },
        { name: 'Independence Day', date: '2024-07-04' },
        { name: 'Christmas', date: '2024-12-25' }
      ]
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 90,
      sessionTimeout: 30,
      loginAttempts: 5,
      ipWhitelist: false,
      allowedIPs: []
    },
    appearance: {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      sidebarCollapsed: false,
      compactMode: false
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: SettingsIcon }
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 2000);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }));
  };

  const SettingCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={settings.profile.firstName}
              onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={settings.profile.lastName}
              onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={settings.profile.department}
              onChange={(e) => handleInputChange('profile', 'department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={settings.profile.position}
              onChange={(e) => handleInputChange('profile', 'position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Employee Information" icon={Building}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              value={settings.profile.employeeId}
              onChange={(e) => handleInputChange('profile', 'employeeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
            <input
              type="date"
              value={settings.profile.joinDate}
              onChange={(e) => handleInputChange('profile', 'joinDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Notification Preferences" icon={Bell}>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications.emailNotifications}
            onChange={(value) => handleInputChange('notifications', 'emailNotifications', value)}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <ToggleSwitch
            enabled={settings.notifications.pushNotifications}
            onChange={(value) => handleInputChange('notifications', 'pushNotifications', value)}
            label="Push Notifications"
            description="Receive push notifications in browser"
          />
          <ToggleSwitch
            enabled={settings.notifications.smsNotifications}
            onChange={(value) => handleInputChange('notifications', 'smsNotifications', value)}
            label="SMS Notifications"
            description="Receive notifications via SMS"
          />
          <ToggleSwitch
            enabled={settings.notifications.taskReminders}
            onChange={(value) => handleInputChange('notifications', 'taskReminders', value)}
            label="Task Reminders"
            description="Get reminded about upcoming tasks"
          />
          <ToggleSwitch
            enabled={settings.notifications.leaveApprovals}
            onChange={(value) => handleInputChange('notifications', 'leaveApprovals', value)}
            label="Leave Approvals"
            description="Notifications for leave requests"
          />
          <ToggleSwitch
            enabled={settings.notifications.attendanceAlerts}
            onChange={(value) => handleInputChange('notifications', 'attendanceAlerts', value)}
            label="Attendance Alerts"
            description="Alerts for attendance issues"
          />
          <ToggleSwitch
            enabled={settings.notifications.weeklyReports}
            onChange={(value) => handleInputChange('notifications', 'weeklyReports', value)}
            label="Weekly Reports"
            description="Receive weekly performance reports"
          />
          <ToggleSwitch
            enabled={settings.notifications.systemUpdates}
            onChange={(value) => handleInputChange('notifications', 'systemUpdates', value)}
            label="System Updates"
            description="Notifications about system updates"
          />
        </div>
      </SettingCard>
    </div>
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <SettingCard title="Company Information" icon={Building}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={settings.company.companyName}
              onChange={(e) => handleInputChange('company', 'companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input
              type="text"
              value={settings.company.industry}
              onChange={(e) => handleInputChange('company', 'industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
            <select
              value={settings.company.size}
              onChange={(e) => handleInputChange('company', 'size', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-100">51-100 employees</option>
              <option value="101-500">101-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.company.timezone}
              onChange={(e) => handleInputChange('company', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Working Hours" icon={Clock}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={settings.company.workingHours.start}
              onChange={(e) => handleNestedInputChange('company', 'workingHours', 'start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={settings.company.workingHours.end}
              onChange={(e) => handleNestedInputChange('company', 'workingHours', 'end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.company.workingHours.days.includes(day)}
                  onChange={(e) => {
                    const days = e.target.checked
                      ? [...settings.company.workingHours.days, day]
                      : settings.company.workingHours.days.filter(d => d !== day);
                    handleNestedInputChange('company', 'workingHours', 'days', days);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <SettingCard title="Security Settings" icon={Shield}>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.security.twoFactorAuth}
            onChange={(value) => handleInputChange('security', 'twoFactorAuth', value)}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
            <input
              type="number"
              value={settings.security.passwordExpiry}
              onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={settings.security.loginAttempts}
              onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Appearance Settings" icon={Palette}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.appearance.theme}
              onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.appearance.language}
              onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={settings.appearance.dateFormat}
              onChange={(e) => handleInputChange('appearance', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select
              value={settings.appearance.timeFormat}
              onChange={(e) => handleInputChange('appearance', 'timeFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <ToggleSwitch
            enabled={settings.appearance.sidebarCollapsed}
            onChange={(value) => handleInputChange('appearance', 'sidebarCollapsed', value)}
            label="Collapsed Sidebar"
            description="Start with sidebar collapsed"
          />
          <ToggleSwitch
            enabled={settings.appearance.compactMode}
            onChange={(value) => handleInputChange('appearance', 'compactMode', value)}
            label="Compact Mode"
            description="Use compact spacing throughout the interface"
          />
        </div>
      </SettingCard>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <SettingCard title="System Information" icon={SettingsIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Application Version</h4>
            <p className="text-sm text-gray-600">v2.1.0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
            <p className="text-sm text-gray-600">December 15, 2024</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Database Status</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Server Status</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="System Actions" icon={RefreshCw}>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Backup Database</span>
            </div>
          </button>
          <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Clear Cache</span>
            </div>
          </button>
          <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">View System Logs</span>
            </div>
          </button>
        </div>
      </SettingCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'company': return renderCompanySettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      case 'system': return renderSystemSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {saved && (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
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

export default Settings;
