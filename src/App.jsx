import { Settings } from 'lucide-react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Announcements from './pages/Announcements';
import AttendancePage from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import Employees from './pages/EmployeesPage';
import LeadManagementSystem from './pages/Leads';
import LeaveManagement from './pages/Leaves';
import Login from './pages/login';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import TaskManagementBoard from './pages/Task';

// Function to check token validity
const isTokenValid = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// Wrapper for protected routes
const ProtectedRoute = () => {
  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="tasks" element={<TaskManagementBoard />} />
          <Route path="leads" element={<LeadManagementSystem />} />
          <Route path="leaves" element={<LeaveManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="employee-profile" element={<EmployeeProfile />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
