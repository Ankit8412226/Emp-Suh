import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  User,
  XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const API_BASE_URL = 'https://erp.suhtech.shop/api/v1';

  // Get current user from localStorage
  useEffect(() => {
    const empData = localStorage.getItem('emp');
    if (empData) {
      setCurrentUser(JSON.parse(empData));
    }
  }, []);

  // Fetch leaves on component mount
  useEffect(() => {
    if (currentUser) {
      fetchLeaves();
    }
  }, [currentUser]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/leaves`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLeaves(data.leaves || data || []);
      } else {
        console.error('Error fetching leaves:', response.statusText);
        alert('Failed to fetch leaves');
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      alert('Error fetching leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const empData = JSON.parse(localStorage.getItem('emp'));
      const employeeId = empData?.id;

      if (!employeeId) {
        alert('Employee not found');
        return;
      }

      const payload = {
        employee: employeeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      };

      const response = await fetch(`${API_BASE_URL}/leaves/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormData({ startDate: '', endDate: '', reason: '' });
        fetchLeaves();
        setActiveTab('history');
        alert('Leave application submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to apply for leave');
      }
    } catch (error) {
      console.error('Error applying for leave:', error);
      alert('Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken'); // Fixed: was 'token', should be 'authToken'

      const response = await fetch(`${API_BASE_URL}/leaves/status/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await response.json();
        fetchLeaves(); // Refresh the list
        setShowConfirmModal(false);
        alert(`Leave ${status} successfully!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update leave status');
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      alert('Error updating leave status');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = (leaveId, status) => {
    setConfirmAction({ leaveId, status });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      handleStatusUpdate(confirmAction.leaveId, confirmAction.status);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = filters.status === 'all' || leave.status === filters.status;
    const matchesSearch = filters.search === '' ||
      leave.reason.toLowerCase().includes(filters.search.toLowerCase()) ||
      (leave.employee?.name && leave.employee.name.toLowerCase().includes(filters.search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const canManageLeaves = currentUser && (currentUser.role === 'admin' || currentUser.role === 'team-lead');

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage your time off requests and track leave status</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
              activeTab === 'apply'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Apply Leave
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Leave History
          </button>
          {canManageLeaves && (
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'manage'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Manage Leaves
            </button>
          )}
        </div>
      </div>

      {/* Apply Leave Form */}
      {activeTab === 'apply' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">
                    Total Days: {calculateDays(formData.startDate, formData.endDate)}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Leave
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                placeholder="Please provide a detailed reason for your leave request..."
                required
              />
            </div>

            <button
              onClick={handleApplyLeave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Leave Application'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Leave History & Management */}
      {(activeTab === 'history' || activeTab === 'manage') && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'history' ? 'Your Leave History' : 'Manage Leave Requests'}
              </h2>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leaves..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Leave List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading leaves...</p>
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No leave requests found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filters.status !== 'all' || filters.search
                    ? 'Try adjusting your filters'
                    : 'Apply for your first leave to get started'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeaves.map((leave) => {
                  const StatusIcon = getStatusIcon(leave.status);
                  return (
                    <div key={leave._id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {activeTab === 'manage' && leave.employee && (
                              <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                                <User className="w-4 h-4 mr-2" />
                                {leave.employee.name}
                              </div>
                            )}
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(leave.status)}`}>
                              <StatusIcon className="w-4 h-4 mr-1" />
                              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <CalendarDays className="w-4 h-4 mr-2" />
                              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {calculateDays(leave.startDate, leave.endDate)} day(s)
                            </div>
                          </div>

                          <div className="flex items-start">
                            <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                            <p className="text-sm text-gray-800">{leave.reason}</p>
                          </div>
                        </div>

                        {activeTab === 'manage' && canManageLeaves && leave.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => showConfirmation(leave._id, 'approved')}
                              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => showConfirmation(leave._id, 'rejected')}
                              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
                              disabled={loading}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}

                        {activeTab === 'history' && (
                          <button
                            onClick={() => {
                              setSelectedLeave(leave);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Confirm Action</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to <span className="font-semibold text-gray-800">{confirmAction.status}</span> this leave request?
              This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 py-2 px-4 rounded-xl transition-colors font-medium text-white ${
                  confirmAction.status === 'approved'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Yes, ${confirmAction.status.charAt(0).toUpperCase() + confirmAction.status.slice(1)}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Details Modal */}
      {showModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Leave Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getStatusColor(selectedLeave.status)}`}>
                  {React.createElement(getStatusIcon(selectedLeave.status), { className: "w-4 h-4 mr-1" })}
                  {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-gray-800 mt-1">
                  {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({calculateDays(selectedLeave.startDate, selectedLeave.endDate)} day(s))
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Reason</p>
                <p className="text-gray-800 mt-1">{selectedLeave.reason}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Applied On</p>
                <p className="text-gray-800 mt-1">{formatDate(selectedLeave.createdAt)}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
