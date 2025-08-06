import { Route, Routes } from 'react-router-dom';
import ComingSoon from './components/ComingSoon';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/EmployeesPage';
import Login from './pages/login';

import {
  BarChart3,
  Settings
} from 'lucide-react';
import AttendancePage from './pages/Attendance';
import LeadManagementSystem from './pages/Leads';
import LeaveManagement from './pages/Leaves';
import TaskManagementBoard from './pages/Task';

const App = () => {
  return (
    <Routes>
      {/* Login route (outside layout) */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route
          path="attendance"
          element={
       <AttendancePage/>
          }
        />
        <Route
          path="tasks"
          element={
        <TaskManagementBoard/>
          }
        />
        <Route
          path="leads"
          element={
            <LeadManagementSystem
            />
          }
        />
        <Route
          path="leaves"
          element={
     <LeaveManagement/>
          }
        />
        <Route
          path="reports"
          element={
            <ComingSoon
              icon={BarChart3}
              title="Reports & Analytics"
              description="Generate insights, performance metrics, and detailed reports"
            />
          }
        />
        <Route
          path="settings"
          element={
            <ComingSoon
              icon={Settings}
              title="System Settings"
              description="Configure system preferences, user roles, and application settings"
            />
          }
        />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a
                href="/"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
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
