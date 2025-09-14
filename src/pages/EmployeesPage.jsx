import {
  Edit,
  Eye,
  Filter,
  Loader2,
  MoreVertical,
  PlusCircle,
  Search,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEmployees(data.employees || data); // Handle different response structures
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format role display
  const formatRole = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'team-lead': 'Team Lead',
      'emp': 'Employee'
    };
    return roleMap[role] || role;
  };

  // Get role color classes
  const getRoleClasses = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'team-lead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get leave count color classes
  const getLeaveClasses = (leaveCount) => {
    if (leaveCount === 0) return 'bg-blue-100 text-blue-800';
    if (leaveCount <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Mobile Employee Card Component
  const MobileEmployeeCard = ({ employee }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-lg">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.email}</p>
        </div>
        <div className="relative">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <span className="text-xs text-gray-500 block">Role</span>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRoleClasses(employee.role)}`}>
            {formatRole(employee.role)}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block">Leave Count</span>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getLeaveClasses(employee.leaveCount)}`}>
            {employee.leaveCount}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-xs text-gray-500 block">Mobile</span>
        <span className="text-sm text-gray-900">{employee.mobileNumber}</span>
      </div>

      <div className="flex space-x-2 pt-3 border-t border-gray-100">
        <button className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 px-3 rounded-md transition-colors flex items-center justify-center">
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        <button className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 px-3 rounded-md transition-colors flex items-center justify-center">
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded-md transition-colors flex items-center justify-center">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Employee Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading employees...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Employee Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-6 sm:p-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error Loading Employees</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Employee Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{employees.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Admins</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {employees.filter(emp => emp.role === 'admin').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Team Leads</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {employees.filter(emp => emp.role === 'team-lead').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Employees</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-600">
            {employees.filter(emp => emp.role === 'emp').length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Search and Filter */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredEmployees.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
          </div>
        ) : (
          <>
            {/* Mobile View - Cards */}
            <div className="block md:hidden p-4">
              {filteredEmployees.map((employee) => (
                <MobileEmployeeCard key={employee._id} employee={employee} />
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClasses(employee.role)}`}>
                          {formatRole(employee.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLeaveClasses(employee.leaveCount)}`}>
                          {employee.leaveCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="View Employee"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Employees;
