import {
  AlertCircle,
  Bookmark,
  Building,
  Calendar,
  CheckCircle,
  Eye,
  Info,
  Megaphone,
  MessageCircle,
  Monitor,
  MoreVertical,
  Pin,
  Plus,
  Search,
  Share,
  ThumbsUp,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';

const Announcements = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Company Holiday Schedule 2024',
      content: 'We are pleased to announce the official holiday schedule for 2024. Please review the attached calendar and plan your time off accordingly. All employees are entitled to 15 paid holidays throughout the year.',
      author: 'HR Department',
      authorAvatar: 'HR',
      category: 'company',
      priority: 'high',
      isPinned: true,
      createdAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-12-31T23:59:59Z',
      readBy: 45,
      totalEmployees: 50,
      likes: 12,
      comments: 3,
      attachments: ['holiday-calendar-2024.pdf']
    },
    {
      id: 2,
      title: 'New Employee Onboarding Program',
      content: 'We have launched a comprehensive onboarding program for new employees. This program includes orientation sessions, mentorship assignments, and structured learning paths to help new team members integrate smoothly.',
      author: 'Sarah Wilson',
      authorAvatar: 'SW',
      category: 'hr',
      priority: 'medium',
      isPinned: false,
      createdAt: '2024-01-14T14:30:00Z',
      expiresAt: '2024-02-14T23:59:59Z',
      readBy: 38,
      totalEmployees: 50,
      likes: 8,
      comments: 5,
      attachments: ['onboarding-guide.pdf', 'mentorship-program.docx']
    },
    {
      id: 3,
      title: 'Office Renovation Update',
      content: 'The office renovation is progressing well. The new conference rooms will be available starting next week. Please note that the main entrance will be temporarily relocated to the side entrance during the final phase.',
      author: 'Mike Johnson',
      authorAvatar: 'MJ',
      category: 'facilities',
      priority: 'medium',
      isPinned: false,
      createdAt: '2024-01-13T09:15:00Z',
      expiresAt: '2024-01-20T23:59:59Z',
      readBy: 42,
      totalEmployees: 50,
      likes: 6,
      comments: 2,
      attachments: []
    },
    {
      id: 4,
      title: 'Monthly Team Building Event',
      content: 'Join us for our monthly team building event this Friday at 3 PM. We will have pizza, games, and team activities. This is a great opportunity to connect with colleagues and have some fun!',
      author: 'Lisa Chen',
      authorAvatar: 'LC',
      category: 'events',
      priority: 'low',
      isPinned: false,
      createdAt: '2024-01-12T16:45:00Z',
      expiresAt: '2024-01-19T18:00:00Z',
      readBy: 35,
      totalEmployees: 50,
      likes: 15,
      comments: 8,
      attachments: []
    },
    {
      id: 5,
      title: 'IT Security Awareness Training',
      content: 'All employees are required to complete the IT Security Awareness Training by the end of this month. This training covers best practices for password management, phishing prevention, and data protection.',
      author: 'IT Department',
      authorAvatar: 'IT',
      category: 'training',
      priority: 'high',
      isPinned: true,
      createdAt: '2024-01-11T11:20:00Z',
      expiresAt: '2024-01-31T23:59:59Z',
      readBy: 28,
      totalEmployees: 50,
      likes: 4,
      comments: 1,
      attachments: ['security-training-module.pdf']
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'company',
    priority: 'medium',
    expiresAt: '',
    attachments: []
  });

  const categories = [
    { id: 'all', label: 'All Announcements', icon: Megaphone },
    { id: 'company', label: 'Company News', icon: Building },
    { id: 'hr', label: 'HR Updates', icon: User },
    { id: 'training', label: 'Training', icon: Bookmark },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'facilities', label: 'Facilities', icon: Building },
    { id: 'it', label: 'IT Updates', icon: Monitor }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Info;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Megaphone;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'pinned' && announcement.isPinned) ||
                      (activeTab === 'unread' && announcement.readBy < announcement.totalEmployees);

    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleCreateAnnouncement = () => {
    const announcement = {
      id: announcements.length + 1,
      ...newAnnouncement,
      author: 'Current User',
      authorAvatar: 'CU',
      isPinned: false,
      createdAt: new Date().toISOString(),
      readBy: 0,
      totalEmployees: 50,
      likes: 0,
      comments: 0,
      attachments: newAnnouncement.attachments
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      category: 'company',
      priority: 'medium',
      expiresAt: '',
      attachments: []
    });
    setShowCreateModal(false);
  };

  const AnnouncementCard = ({ announcement }) => {
    const PriorityIcon = getPriorityIcon(announcement.priority);
    const CategoryIcon = getCategoryIcon(announcement.category);

    return (
      <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
        announcement.isPinned ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {announcement.authorAvatar}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  {announcement.isPinned && (
                    <Pin className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{announcement.author}</span>
                  <span>•</span>
                  <span>{formatDate(announcement.createdAt)}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <CategoryIcon className="w-4 h-4" />
                    <span className="capitalize">{announcement.category}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                <PriorityIcon className="w-3 h-3 inline mr-1" />
                {announcement.priority}
              </span>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{announcement.content}</p>

          {announcement.attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
              <div className="flex flex-wrap gap-2">
                {announcement.attachments.map((attachment, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {attachment}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{announcement.readBy}/{announcement.totalEmployees} read</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{announcement.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{announcement.comments}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateAnnouncementModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Announcement</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter announcement content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newAnnouncement.category}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="company">Company News</option>
                <option value="hr">HR Updates</option>
                <option value="training">Training</option>
                <option value="events">Events</option>
                <option value="facilities">Facilities</option>
                <option value="it">IT Updates</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expires At (Optional)</label>
            <input
              type="datetime-local"
              value={newAnnouncement.expiresAt}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, expiresAt: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAnnouncement}
            disabled={!newAnnouncement.title || !newAnnouncement.content}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Announcement
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest company news and updates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex space-x-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'pinned', label: 'Pinned' },
            { id: 'unread', label: 'Unread' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && <CreateAnnouncementModal />}
    </div>
  );
};

export default Announcements;
