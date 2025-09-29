import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2, UserCheck } from 'lucide-react';
import { attendanceAPI } from '../services/api';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [markingAttendance, setMarkingAttendance] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchAttendanceData();
  }, [currentMonth, currentYear, fetchAttendanceData]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        window.location.href = '/login';
        return;
      }
      
      const response = await attendanceAPI.getEmployeeAttendance(
        user._id, 
        currentMonth + 1, // API expects 1-12 for months
        currentYear
      );
      
      if (response.data.success) {
        setAttendanceData(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      setMarkingAttendance(true);
      const response = await attendanceAPI.markAttendance({
        status: 'present',
        date: new Date().toISOString()
      });
      
      if (response.data.success) {
        // Refresh attendance data
        fetchAttendanceData();
      } else {
        setError(response.data.message || 'Failed to mark attendance');
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError('Failed to mark attendance. Please try again.');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if a date has attendance
  const getAttendanceStatus = (day) => {
    const attendance = attendanceData.find(a => {
      const attendanceDate = new Date(a.date);
      return attendanceDate.getDate() === day && 
             attendanceDate.getMonth() === currentMonth && 
             attendanceDate.getFullYear() === currentYear;
    });
    
    return attendance ? attendance.status : null;
  };

  // Check if today
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  // Generate calendar
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="h-12 border border-gray-100"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getAttendanceStatus(day);
      const today = isToday(day);
      
      let statusClass = '';
      let statusText = '';
      
      if (status === 'present') {
        statusClass = 'bg-green-100 text-green-800 border-green-200';
        statusText = 'Present';
      } else if (status === 'absent') {
        statusClass = 'bg-red-100 text-red-800 border-red-200';
        statusText = 'Absent';
      } else if (status === 'half-day') {
        statusClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        statusText = 'Half Day';
      } else if (status === 'leave') {
        statusClass = 'bg-blue-100 text-blue-800 border-blue-200';
        statusText = 'Leave';
      }
      
      calendar.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-2 ${today ? 'bg-blue-50' : ''} ${statusClass}`}
        >
          <div className="flex justify-between">
            <span className={`font-medium ${today ? 'text-blue-600' : ''}`}>{day}</span>
            {status && <span className="text-xs">{statusText}</span>}
          </div>
        </div>
      );
    }
    
    return calendar;
  };

  // Check if today's attendance is already marked
  const isTodayMarked = () => {
    const today = new Date();
    return getAttendanceStatus(today.getDate()) !== null;
  };

  if (loading && attendanceData.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading attendance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Attendance</h1>
        
        {!isTodayMarked() && (
          <button 
            onClick={markAttendance}
            disabled={markingAttendance}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto"
          >
            {markingAttendance ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Marking...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Mark Today's Attendance
              </>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Month Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={previousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-medium">
              {monthNames[currentMonth]} {currentYear}
            </h2>
          </div>
          
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-10 flex items-center justify-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {generateCalendar()}
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Monthly Summary
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="text-sm text-gray-500">Present</div>
            <div className="text-2xl font-bold text-green-700">
              {attendanceData.filter(a => a.status === 'present').length}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="text-sm text-gray-500">Absent</div>
            <div className="text-2xl font-bold text-red-700">
              {attendanceData.filter(a => a.status === 'absent').length}
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="text-sm text-gray-500">Half Day</div>
            <div className="text-2xl font-bold text-yellow-700">
              {attendanceData.filter(a => a.status === 'half-day').length}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="text-sm text-gray-500">Leave</div>
            <div className="text-2xl font-bold text-blue-700">
              {attendanceData.filter(a => a.status === 'leave').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;