import axios from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Timer,
  User,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

const AttendancePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState(null); // null, 'checked-in', 'checked-out'
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [location, setLocation] = useState('Office - Main Building');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceType, setAttendanceType] = useState('full'); // 'full' or 'half'

  // Employee data from localStorage
  const [employee, setEmployee] = useState(null);
  const [isFullDayLoading, setIsFullDayLoading] = useState(false);
const [isHalfDayLoading, setIsHalfDayLoading] = useState(false);


  // Get employee data from localStorage on component mount
  useEffect(() => {
    try {
      const empData = JSON.parse(localStorage.getItem('emp'));
      if (empData) {
        setEmployee(empData);
      } else {
        setError('Employee data not found. Please login again.');
      }
    } catch (err) {
      setError('Invalid employee data. Please login again.');
    }
  }, []);

  // API base URL
  const API_BASE_URL = 'https://erp.suhtech.shop/api/v1';

  // Configure axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Full day check-in (10:15 AM - 10:30 AM)
  const handleFullDayCheckIn = async () => {
    setIsFullDayLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/attendance/checkin', {
        employeeId: employee?._id || employee?.id
      });

      if (response.status === 200) {
        const now = new Date();
        setCheckInTime(now);
        setAttendanceStatus('checked-in');
        setAttendanceType('full');
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed. Please try again.');
    } finally {
      setIsFullDayLoading(false);
    }
  };

  const handleHalfDayCheckIn = async () => {
    setIsHalfDayLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/attendance/halfday-checkin', {
        employeeId: employee?._id || employee?.id
      });

      if (response.status === 200) {
        const now = new Date();
        setCheckInTime(now);
        setAttendanceStatus('checked-in');
        setAttendanceType('half');
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Half-day check-in failed. Please try again.');
    } finally {
      setIsHalfDayLoading(false);
    }
  };


  // Check out
  const handleCheckOut = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/attendance/checkout', {
        employeeId: employee?._id || employee?.id
      });

      if (response.status === 200) {
        const now = new Date();
        setCheckOutTime(now);
        setAttendanceStatus('checked-out');
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWorkingHours = () => {
    if (checkInTime && checkOutTime) {
      const diff = checkOutTime - checkInTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return '0h 0m';
  };

  const getStatusColor = () => {
    switch (attendanceStatus) {
      case 'checked-in':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'checked-out':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getCurrentHour = () => {
    return currentTime.getHours();
  };

  const getCurrentMinute = () => {
    return currentTime.getMinutes();
  };

  const canCheckInFullDay = () => {
    const hour = getCurrentHour();
    const minute = getCurrentMinute();
    return hour === 10 && minute >= 15 && minute <= 30;
  };

  const canCheckInHalfDay = () => {
    return getCurrentHour() >= 11;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Mark Attendance</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">{formatDate(currentTime)}</p>
            <p className="text-xl font-bold text-slate-800">{formatTime(currentTime)}</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-emerald-800 text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Employee Info Card */}
        {employee ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">{employee.name}</h2>
                <p className="text-sm text-slate-600">ID: {employee.employeeId || employee.id?.slice(-8)}</p>
                <p className="text-sm text-slate-600">{employee.department || employee.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Shift Time</p>
                <p className="font-semibold text-slate-800">{employee.shift || '9:00 AM - 6:00 PM'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-red-800 mb-2">Employee Data Not Found</h3>
            <p className="text-red-700 text-sm">Please login again to access attendance features.</p>
          </div>
        )}

        {/* Current Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Today's Attendance</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
              {attendanceStatus === 'checked-in' && `Checked In (${attendanceType === 'full' ? 'Full Day' : 'Half Day'})`}
              {attendanceStatus === 'checked-out' && 'Checked Out'}
              {!attendanceStatus && 'Not Marked'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Check In */}
            <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-emerald-700 font-medium mb-1">Check In</p>
              <p className="text-sm font-bold text-emerald-800">
                {checkInTime ? formatTime(checkInTime) : '--:--'}
              </p>
            </div>

            {/* Check Out */}
            <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-blue-700 font-medium mb-1">Check Out</p>
              <p className="text-sm font-bold text-blue-800">
                {checkOutTime ? formatTime(checkOutTime) : '--:--'}
              </p>
            </div>

            {/* Working Hours */}
            <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-purple-700 font-medium mb-1">Duration</p>
              <p className="text-sm font-bold text-purple-800">{calculateWorkingHours()}</p>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Current Location</p>
              <p className="font-semibold text-slate-800">{location}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {employee && (
          <div className="space-y-3">
            {!attendanceStatus && (
              <>
                {/* Full Day Check In Button */}
         {/* Full Day Check In Button */}
<button
  onClick={handleFullDayCheckIn}
  disabled={isFullDayLoading || !canCheckInFullDay()}
  className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm ${
    canCheckInFullDay() && !isFullDayLoading
      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200'
      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
  }`}
>
  {isFullDayLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <>
      <CheckCircle className="w-5 h-5" />
      <span>Full Day Check In (10:15-10:30 AM)</span>
    </>
  )}
</button>

{/* Half Day Check In Button */}
<button
  onClick={handleHalfDayCheckIn}
  disabled={isHalfDayLoading || !canCheckInHalfDay()}
  className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm ${
    canCheckInHalfDay() && !isHalfDayLoading
      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-200'
      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
  }`}
>
  {isHalfDayLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <>
      <CheckCircle className="w-5 h-5" />
      <span>Half Day Check In (After 11:00 AM)</span>
    </>
  )}
</button>

              </>
            )}

            {attendanceStatus === 'checked-in' && (
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Check Out</span>
                  </>
                )}
              </button>
            )}

            {attendanceStatus === 'checked-out' && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Attendance Complete!</h3>
                <p className="text-sm text-slate-600">
                  You've successfully marked your {attendanceType === 'full' ? 'full day' : 'half day'} attendance for today.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-amber-800 font-semibold text-sm">Important Notice</p>
              <ul className="text-amber-700 text-xs mt-2 space-y-1">
                <li>• Full-day check-in: Only between 10:15 AM - 10:30 AM</li>
                <li>• Half-day check-in: Only after 11:00 AM</li>
                <li>• Please ensure you are within the office premises</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
