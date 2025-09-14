import {
  Bell,
  Check,
  X,
  Filter,
  Search,
  MoreVertical,
  Clock,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  MessageCircle,
  FileText,
  Award,
  Settings,
  Trash2,
  Archive,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Leave Request Approved',
      message: 'Your leave request for January 20-22 has been approved by Sarah Wilson.',
      type: 'leave',
      priority: 'medium',
      isRead: false,
      isImportant: false,
      createdAt: '2024-01-15T10:30:00Z',
      actionUrl: '/leaves',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 2,
      title: 'Task Assignment',
      message: 'You have been assigned a new task: "Update user authentication module"',
      type: 'task',
      priority: 'high',
      isRead: false,
      isImportant: true,
      createdAt: '2024-01-15T09:15:00Z',
      actionUrl: '/tasks',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 3,
      title: 'Performance Review Due',
      message: 'Your quarterly performance review is due in 3 days. Please complete the self-assessment.',
      type: 'performance',
      priority: 'high',
      isRead: true,
      isImportant: true,
      createdAt: '2024-01-14T16:45:00Z',
      actionUrl: '/performance',
      icon: Award,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 4,
      title: 'Team Meeting Reminder',
      message: 'Sprint planning meeting starts in 15 minutes. Join the video call.',
      type: 'meeting',
      priority: 'medium',
      isRead: true,
      isImportant: false,
      createdAt: '2024-01-14T14:00:00Z',
      actionUrl: '/meetings',
      icon: Calendar,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 5,
      title: 'System Maintenance',
      message: 'Scheduled system maintenance will occur tonight from 11 PM to 2 AM. Some features may be unavailable.',
      type: 'system',
      priority: 'low',
      isRead: true,
      isImportant: false,
      createdAt: '2024-01-14T11:20:00Z',
      actionUrl: null,
      icon: Settings,
      color: 'text-gray-600 bg-gray-50'
    },
    {
      id: 6,
      title: 'New Team Member',
      message: 'Welcome Alex Johnson to the Development team! Alex will be joining us as a Junior Developer.',
      type: 'hr',
      priority: 'low',
      isRead: true,
      isImportant: false,
      createdAt: '2024-01-13T15:30:00Z',
      actionUrl: '/employees',
      icon: User,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      id: 7,
      title: 'Project Deadline Approaching',
      message: 'The E-commerce Platform project deadline is in 5 days. Please ensure all tasks are completed.',
      type: 'project',
      priority: 'high',
      isRead: false,
      isImportant: true,
      createdAt: '2024-01-13T10:15:00Z',
      actionUrl: '/projects',
      icon: AlertCircle,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: 8,
      title: 'Training Completed',
      message: 'Congratulations! You have successfully completed the AWS Fundamentals training course.',
      type: 'training',
      priority: 'medium',
      isRead: true,
      isImportant: false,
      createdAt: '2024-01-12T16:00:00Z',
      actionUrl: '/training',
      icon: Award,
      color: 'text-green-600 bg-green-50'
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { id: 'important', label: 'Important', count: notifications.filter(n => n.isImportant).length },
    { id: 'archived', label: 'Archived', count: 0 }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'task', label: 'Tasks' },
    { id: 'leave', label: 'Leave' },
    { id: 'meeting', label: 'Meetings' },
    { id: 'performance', label: 'Performance' },
    { id: 'system', label: 'System' },
    { id: 'hr', label: 'HR' },
    { id: 'project', label: 'Projects' },
    { id: 'training', label: 'Training' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return diffMinutes < 1 ? 'Just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && !notification.isRead) ||
                      (activeTab === 'important' && notification.isImportant) ||
                      (activeTab === 'archived' && notification.isArchived);
    
    return matchesSearch && matchesType && matchesTab;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAsUnread = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: false } : n
    ));
  };

  const toggleImportant = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isImportant: !n.isImportant } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const NotificationCard = ({ notification }) => {
    const Icon = notification.icon;

    return (
      <div className={`bg-white rounded-xl border-l-4 ${getPriorityColor(notification.priority)} border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    {notification.isImportant && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatTime(notification.createdAt)}</span>
                    <span className="capitalize">{notification.type}</span>
                    <span className="capitalize">{notification.priority} priority</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                  >
                    {notification.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleImportant(notification.id)}
                    className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                      notification.isImportant ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={notification.isImportant ? 'Remove from important' : 'Mark as important'}
                  >
                    <Star className={`w-4 h-4 ${notification.isImportant ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with important updates and activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => !n.isRead).length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Important</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.isImportant).length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => {
                  const today = new Date();
                  const notificationDate = new Date(n.createdAt);
                  return notificationDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
