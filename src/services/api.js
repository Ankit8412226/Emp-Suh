import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Employee API
export const employeeAPI = {
  getAllEmployees: () => api.get('/employees'),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  createEmployee: (employeeData) => api.post('/employees', employeeData),
  updateEmployee: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (attendanceData) => api.post('/attendance', attendanceData),
  getEmployeeAttendance: (employeeId, month, year) =>
    api.get(`/attendance/employee/${employeeId}`, { params: { month, year } }),
  getAllAttendance: (month, year) => api.get('/attendance', { params: { month, year } }),
};

// Leave API
export const leaveAPI = {
  applyLeave: (leaveData) => api.post('/leaves', leaveData),
  getEmployeeLeaves: (employeeId, status) =>
    api.get(`/leaves/employee/${employeeId}`, { params: { status } }),
  getAllLeaves: (status) => api.get('/leaves', { params: { status } }),
  updateLeaveStatus: (id, statusData) => api.put(`/leaves/${id}/status`, statusData),
};

// Task API
export const taskAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getAllTasks: (filters) => api.get('/tasks', { params: filters }),
  getEmployeeTasks: (employeeId, status) =>
    api.get(`/tasks/employee/${employeeId}`, { params: { status } }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  approveTask: (id) => api.put(`/tasks/${id}/approve`),
  addComment: (id, commentData) => api.post(`/tasks/${id}/comments`, commentData),
  getTaskStatistics: () => api.get('/tasks/statistics'),
};

// Lead API
export const leadAPI = {
  createLead: (leadData) => api.post('/leads', leadData),
  getAllLeads: (filters) => api.get('/leads', { params: filters }),
  getEmployeeLeads: (employeeId, filters) =>
    api.get(`/leads/employee/${employeeId}`, { params: filters }),
  getLeadById: (id) => api.get(`/leads/${id}`),
  updateLead: (id, leadData) => api.put(`/leads/${id}`, leadData),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  incrementReachCount: (id, contactData) => api.put(`/leads/${id}/reach`, contactData),
  addActivity: (id, activityData) => api.post(`/leads/${id}/activity`, activityData),
  getLeadStatistics: (filters) => api.get('/leads/statistics', { params: filters }),
};

// Salary API
export const salaryAPI = {
  createSalary: (salaryData) => api.post('/salaries', salaryData),
  getAllSalaries: ({ month, year } = {}) => api.get('/salaries', { params: { month, year } }),
  getEmployeeSalary: (employeeId, { month, year } = {}) =>
    api.get(`/salaries/employee/${employeeId}`, { params: { month, year } }),
  updateSalary: (id, salaryData) => api.put(`/salaries/${id}`, salaryData),
  deleteSalary: (id) => api.delete(`/salaries/${id}`),
  computeFromAttendance: (payload) => api.post('/salaries/compute', payload),
  downloadPayslip: (id) => api.get(`/salaries/${id}/payslip`, { responseType: 'blob' })
};

export default api;
