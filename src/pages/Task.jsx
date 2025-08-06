import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Eye,
  Filter,
  GripVertical,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  X
} from "lucide-react";
import { useState } from 'react';

const statusTabs = ["pending", "in-progress", "completed", "waiting-for-approval"];
const statusLabels = {
  "pending": "To Do",
  "in-progress": "In Progress",
  "completed": "Done",
  "waiting-for-approval": "In Review"
};

// Mock employees data
const mockEmployees = [
  { _id: "1", name: "John Doe", email: "john@company.com", avatar: "JD" },
  { _id: "2", name: "Jane Smith", email: "jane@company.com", avatar: "JS" },
  { _id: "3", name: "Mike Johnson", email: "mike@company.com", avatar: "MJ" },
  { _id: "4", name: "Sarah Wilson", email: "sarah@company.com", avatar: "SW" },
  { _id: "5", name: "David Brown", email: "david@company.com", avatar: "DB" }
];

// Mock initial tasks with priority and better data
const initialTasks = [
  {
    _id: "1",
    title: "Design Homepage Layout",
    description: "Create a modern and responsive homepage layout with hero section, features, and testimonials. Include mobile optimization and accessibility considerations. This task requires careful attention to user experience and brand consistency.",
    assignedTo: "1",
    status: "pending",
    priority: "high",
    dueDate: "2025-08-15",
    createdAt: "2025-08-01",
    tags: ["Design", "Frontend"]
  },
  {
    _id: "2",
    title: "API Integration",
    description: "Integrate payment gateway API with the checkout system and handle error scenarios",
    assignedTo: "2",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-08-20",
    createdAt: "2025-08-02",
    tags: ["Backend", "Integration"]
  },
  {
    _id: "3",
    title: "Database Optimization",
    description: "Optimize database queries for better performance and reduce load times",
    assignedTo: "3",
    status: "completed",
    priority: "medium",
    dueDate: "2025-08-10",
    createdAt: "2025-07-25",
    tags: ["Database", "Performance"]
  },
  {
    _id: "4",
    title: "User Authentication System",
    description: "Implement JWT-based authentication system with password reset functionality",
    assignedTo: "4",
    status: "waiting-for-approval",
    priority: "high",
    dueDate: "2025-08-18",
    createdAt: "2025-08-03",
    tags: ["Security", "Backend"]
  }
];

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl p-6 ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-sm`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const TaskCard = ({ task, moveTask, updateStatus, onDelete, onApprove, onViewDescription, employees, isDragging, onDragStart, onDragEnd }) => {
  const truncateDescription = (text, wordLimit = 15) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const shouldShowViewIcon = task.description.split(' ').length > 15;
  const assignedEmployee = employees.find(emp => emp._id === task.assignedTo);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBorderClass = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
          id: task._id,
          status: task.status
        }));
        onDragStart && onDragStart(task);
      }}
      onDragEnd={() => onDragEnd && onDragEnd()}
      className={`group cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md bg-white rounded-xl border border-gray-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      } ${getPriorityBorderClass(task.priority)} border-l-4`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <GripVertical className="text-gray-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="font-semibold text-gray-800 text-sm leading-tight flex-1">{task.title}</h4>
          </div>
          <button className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-3">
          <div className="flex items-start gap-2">
            <p className="text-xs text-gray-600 flex-1 leading-relaxed">{truncateDescription(task.description)}</p>
            {shouldShowViewIcon && (
              <button
                onClick={() => onViewDescription(task)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all duration-200"
                title="View full description"
              >
                <Eye className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative inline-flex items-center justify-center h-6 w-6">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-green-600 text-white font-semibold text-xs">
                {assignedEmployee?.avatar || assignedEmployee?.name?.charAt(0) || '?'}
              </div>
            </div>

            {/* Priority */}
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {task.priority}
            </div>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {/* Action Buttons - Only show on hover */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            {task.status !== "pending" && task.status !== "waiting-for-approval" && (
              <button
                title="Move Back"
                onClick={() => moveTask(task, "backward")}
                className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
            )}
            {task.status !== "completed" && task.status !== "waiting-for-approval" && (
              <button
                title="Move Forward"
                onClick={() => moveTask(task, "forward")}
                className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all duration-200 flex items-center justify-center"
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex gap-1">
            {task.status === "waiting-for-approval" && (
              <>
                <button
                  title="Approve Task"
                  onClick={() => onApprove(task._id, true)}
                  className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all duration-200 flex items-center justify-center"
                >
                  <Check className="h-3 w-3" />
                </button>
                <button
                  title="Reject Task"
                  onClick={() => onApprove(task._id, false)}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            )}
            <button
              title="Delete"
              onClick={() => onDelete(task._id)}
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200 flex items-center justify-center"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ status, tasks, moveTask, updateStatus, onDelete, onApprove, onViewDescription, onAddTask, employees }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (data.status !== status) {
      updateStatus(data.id, status);
    }
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'waiting-for-approval':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className={`transition-all duration-200 bg-white rounded-2xl border shadow-sm ${
        isDragOver
          ? 'border-green-500 bg-green-50'
          : getStatusStyles(status)
      }`}>
        {/* Column Header */}
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                {statusLabels[status]}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 min-w-[24px] text-center">
                {tasks.length}
              </span>
            </div>

            {status === "pending" && (
              <button
                onClick={() => onAddTask()}
                className="h-8 w-8 p-0 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200 flex items-center justify-center"
                title="Add new task"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="p-6 pt-0 min-h-[500px]"
        >
          {/* Add Task Button */}
          {status === "pending" && (
            <button
              onClick={() => onAddTask()}
              className="w-full mb-3 h-auto py-4 border-2 border-dashed border-gray-300 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-xl text-gray-600 font-medium flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create issue
            </button>
          )}

          {/* Tasks */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                moveTask={moveTask}
                updateStatus={updateStatus}
                onDelete={onDelete}
                onApprove={onApprove}
                onViewDescription={onViewDescription}
                employees={employees}
                isDragging={false}
                onDragStart={() => {}}
                onDragEnd={() => {}}
              />
            ))}
          </div>

          {/* Drop Indicator */}
          {isDragOver && (
            <div className="border-2 border-dashed border-green-500 rounded-xl p-4 mt-3 bg-green-50">
              <p className="text-green-600 text-center text-sm font-medium">Drop here to move task</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskManagementBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [employees] = useState(mockEmployees);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    tags: []
  });

  const filteredTasks = tasks.filter(task => {
    const matchesEmployee = !selectedEmployee || task.assignedTo === selectedEmployee;
    const matchesSearch = !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEmployee && matchesSearch;
  });

  const moveTask = (task, direction) => {
    const currentIndex = statusTabs.indexOf(task.status);
    let newIndex;

    if (direction === "forward") {
      newIndex = Math.min(currentIndex + 1, statusTabs.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    updateStatus(task._id, statusTabs[newIndex]);
  };

  const updateStatus = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setConfirmAction({ type: 'delete', taskId });
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (confirmAction && confirmAction.type === 'delete') {
      setTasks(prevTasks => prevTasks.filter(task => task._id !== confirmAction.taskId));
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const approveTask = (taskId, approved) => {
    const newStatus = approved ? "completed" : "in-progress";
    updateStatus(taskId, newStatus);
  };

  const viewTaskDescription = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const addNewTask = () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!newTask.assignedTo) {
      alert("Please assign the task to an employee");
      return;
    }

    const task = {
      _id: Date.now().toString(),
      ...newTask,
      status: "pending",
      createdAt: new Date().toISOString(),
      tags: newTask.tags.filter(tag => tag.trim() !== '')
    };

    setTasks(prevTasks => [...prevTasks, task]);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
      tags: []
    });
    setShowAddTaskModal(false);
  };

  const addTag = (tagText) => {
    if (tagText.trim() && !newTask.tags.includes(tagText.trim())) {
      setNewTask(prev => ({
        ...prev,
        tags: [...prev.tags, tagText.trim()]
      }));
    }
  };

  const removeTag = (indexToRemove) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Project Board</h1>
          <p className="text-gray-600 mt-1">Manage and track your team's work</p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All assignees</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusTabs.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter(task => task.status === status)}
            moveTask={moveTask}
            updateStatus={updateStatus}
            onDelete={deleteTask}
            onApprove={approveTask}
            onViewDescription={viewTaskDescription}
            onAddTask={() => setShowAddTaskModal(true)}
            employees={employees}
          />
        ))}
      </div>

      {/* View Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedTask.title}</h4>
              <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p>
            </div>

            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned To</label>
                <div className="flex items-center space-x-2">
                  <div className="relative inline-flex items-center justify-center h-8 w-8">
                    <div className="flex items-center justify-center w-full h-full rounded-full bg-green-600 text-white font-semibold text-sm">
                      {employees.find(emp => emp._id === selectedTask.assignedTo)?.avatar || '?'}
                    </div>
                  </div>
                  <span className="text-gray-800">{employees.find(emp => emp._id === selectedTask.assignedTo)?.name || 'Unassigned'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {statusLabels[selectedTask.status]}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                  selectedTask.priority === 'high' ? 'text-red-600 bg-red-50 border-red-200' :
                  selectedTask.priority === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                  'text-green-600 bg-green-50 border-green-200'
                }`}>
                  {selectedTask.priority?.charAt(0).toUpperCase() + selectedTask.priority?.slice(1)}
                </span>
              </div>

              {selectedTask.dueDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <p className="text-gray-600">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created</label>
                <p className="text-gray-600">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Create New Task"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a descriptive task title"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="Describe the task requirements and goals"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Select assignee</option>
                  {employees.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {newTask.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-2 h-4 w-4 p-0 hover:bg-transparent text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (press Enter)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target;
                    addTag(target.value);
                    target.value = '';
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={addNewTask}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold"
            >
              Create Task
            </button>
            <button
              onClick={() => setShowAddTaskModal(false)}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Confirm Action</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementBoard
