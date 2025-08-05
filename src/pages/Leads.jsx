
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  User,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

const LeadManagementSystem = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock employees data for assignment
  const [employees] = useState([
    { _id: '1', name: 'John Doe', email: 'john@company.com' },
    { _id: '2', name: 'Jane Smith', email: 'jane@company.com' },
    { _id: '3', name: 'Mike Johnson', email: 'mike@company.com' }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    source: '',
    projectName: '',
    projectDescription: '',
    assignedTo: '',
    status: 'new',
    notes: ''
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockLeads = [
      {
        _id: '1',
        name: 'Acme Corporation',
        contactNumber: '+1-555-0123',
        email: 'contact@acme.com',
        source: 'Website',
        projectName: 'E-commerce Platform',
        projectDescription: 'Need a complete e-commerce solution with payment integration',
        reachCount: 3,
        assignedTo: { _id: '1', name: 'John Doe' },
        status: 'interested',
        notes: 'Interested in React-based solution',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        _id: '2',
        name: 'Tech Startup Inc',
        contactNumber: '+1-555-0124',
        email: 'hello@techstartup.com',
        source: 'LinkedIn',
        projectName: 'Mobile App Development',
        projectDescription: 'iOS and Android app for food delivery',
        reachCount: 1,
        assignedTo: { _id: '2', name: 'Jane Smith' },
        status: 'contacted',
        notes: 'Initial meeting scheduled',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
      },
      {
        _id: '3',
        name: 'Global Solutions Ltd',
        contactNumber: '+1-555-0125',
        email: 'info@globalsolutions.com',
        source: 'Referral',
        projectName: 'CRM System',
        projectDescription: 'Custom CRM with reporting dashboard',
        reachCount: 0,
        assignedTo: null,
        status: 'new',
        notes: '',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
      }
    ];
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
  }, []);

  // Filter leads based on search and status
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactNumber: '',
      email: '',
      source: '',
      projectName: '',
      projectDescription: '',
      assignedTo: '',
      status: 'new',
      notes: ''
    });
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newLead = {
        _id: Date.now().toString(),
        ...formData,
        reachCount: 0,
        assignedTo: formData.assignedTo ? employees.find(emp => emp._id === formData.assignedTo) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setLeads(prev => [newLead, ...prev]);
      setSuccess('Lead created successfully!');
      resetForm();
      setCurrentView('list');
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateLead = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setLeads(prev => prev.map(lead =>
        lead._id === selectedLead._id
          ? {
              ...lead,
              ...formData,
              assignedTo: formData.assignedTo ? employees.find(emp => emp._id === formData.assignedTo) : null,
              updatedAt: new Date()
            }
          : lead
      ));
      setSuccess('Lead updated successfully!');
      setCurrentView('list');
      setSelectedLead(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(prev => prev.filter(lead => lead._id !== leadId));
      setSuccess('Lead deleted successfully!');
    }
  };

  const handleIncrementReachCount = (leadId) => {
    setLeads(prev => prev.map(lead =>
      lead._id === leadId
        ? { ...lead, reachCount: lead.reachCount + 1, updatedAt: new Date() }
        : lead
    ));
    setSuccess('Reach count updated!');
  };

  const startEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      contactNumber: lead.contactNumber,
      email: lead.email || '',
      source: lead.source || '',
      projectName: lead.projectName,
      projectDescription: lead.projectDescription || '',
      assignedTo: lead.assignedTo?._id || '',
      status: lead.status,
      notes: lead.notes || ''
    });
    setCurrentView('edit');
  };

  const viewLead = (lead) => {
    setSelectedLead(lead);
    setCurrentView('view');
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'text-blue-700 bg-blue-50 border-blue-200',
      contacted: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      interested: 'text-purple-700 bg-purple-50 border-purple-200',
      converted: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      closed: 'text-slate-700 bg-slate-50 border-slate-200'
    };
    return colors[status] || colors.new;
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: <Plus className="w-3 h-3" />,
      contacted: <Phone className="w-3 h-3" />,
      interested: <Eye className="w-3 h-3" />,
      converted: <CheckCircle className="w-3 h-3" />,
      closed: <Clock className="w-3 h-3" />
    };
    return icons[status] || icons.new;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setCurrentView('list');
                  setSelectedLead(null);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-bold text-slate-800">
                {currentView === 'create' ? 'Create New Lead' : 'Edit Lead'}
              </h1>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-emerald-800 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={currentView === 'create' ? handleCreateLead : handleUpdateLead} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Lead Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assign To</label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select employee</option>
                    {employees.map(employee => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Description</label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the project requirements"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any additional notes"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('list');
                  setSelectedLead(null);
                  resetForm();
                }}
                className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{currentView === 'create' ? 'Creating...' : 'Updating...'}</span>
                  </div>
                ) : (
                  currentView === 'create' ? 'Create Lead' : 'Update Lead'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (currentView === 'view' && selectedLead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setCurrentView('list');
                  setSelectedLead(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-bold text-slate-800">Lead Details</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(selectedLead)}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Lead Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedLead.name}</h2>
                  <p className="text-slate-600">{selectedLead.projectName}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center space-x-1 ${getStatusColor(selectedLead.status)}`}>
                {getStatusIcon(selectedLead.status)}
                <span className="capitalize">{selectedLead.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700">{selectedLead.contactNumber}</span>
                  </div>
                  {selectedLead.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">{selectedLead.email}</span>
                    </div>
                  )}
                  {selectedLead.source && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">Source: {selectedLead.source}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Project Name</p>
                    <p className="font-medium text-slate-700">{selectedLead.projectName}</p>
                  </div>
                  {selectedLead.projectDescription && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Description</p>
                      <p className="text-slate-700 text-sm">{selectedLead.projectDescription}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment & Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Assignment & Stats</h3>
                <div className="space-y-3">
                  {selectedLead.assignedTo && (
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-700">{selectedLead.assignedTo.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700">Reach Count: {selectedLead.reachCount}</span>
                    <button
                      onClick={() => handleIncrementReachCount(selectedLead._id)}
                      className="p-1 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      title="Increment reach count"
                    >
                      <RefreshCw className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700 text-sm">Created: {formatDate(selectedLead.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700 text-sm">Updated: {formatDate(selectedLead.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedLead.notes && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-slate-800 mb-3">Notes</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700">{selectedLead.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Lead Management</h1>
          </div>
          <button
            onClick={() => setCurrentView('create')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-emerald-800 text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{leads.length}</p>
                <p className="text-xs text-slate-600">Total Leads</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {leads.filter(lead => lead.status === 'new').length}
                </p>
                <p className="text-xs text-slate-600">New Leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, project, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Leads ({filteredLeads.length})
            </h2>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No leads found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first lead.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Lead</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Reach Count
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">{lead.name}</p>
                          {lead.source && (
                            <p className="text-xs text-slate-500">via {lead.source}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{lead.projectName}</p>
                        {lead.projectDescription && (
                          <p className="text-sm text-slate-600 truncate max-w-xs">
                            {lead.projectDescription}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-700">{lead.contactNumber}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="text-sm text-slate-700">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.assignedTo ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm text-slate-700">{lead.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          <span className="ml-1 capitalize">{lead.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-700">{lead.reachCount}</span>
                          <button
                            onClick={() => handleIncrementReachCount(lead._id)}
                            className="p-1 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="Increment reach count"
                          >
                            <RefreshCw className="w-3 h-3 text-blue-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {formatDate(lead.updatedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => viewLead(lead)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="View lead"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => startEdit(lead)}
                            className="p-2 hover:bg-yellow-100 rounded-lg transition-all duration-200"
                            title="Edit lead"
                          >
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadManagementSystem;
