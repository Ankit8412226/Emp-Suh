import axios from "axios";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  GripVertical,
  Loader,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://admin-suh-production.up.railway.app/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  get: async (endpoint, params = {}) => {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },

  post: async (endpoint, data) => {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  },

  put: async (endpoint, data) => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  },

  delete: async (endpoint) => {
    const response = await apiClient.delete(endpoint);
    return response.data;
  },
};

const statusTabs = [
  "pending",
  "in-progress",
  "completed",
  "waiting-for-approval",
];
const statusLabels = {
  pending: "To Do",
  "in-progress": "In Progress",
  completed: "Done",
  "waiting-for-approval": "In Review",
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-2xl p-6 ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-sm`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  moveTask,
  updateStatus,
  onDelete,
  onApprove,
  onViewDescription,
  employees,
  isDragging,
  onDragStart,
  onDragEnd,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = (text, charLimit = 120) => {
    return text && text.length > charLimit;
  };

  const truncateText = (text, charLimit = 120) => {
    if (!text) return "";
    if (text.length <= charLimit) return text;
    return text.substring(0, charLimit) + "...";
  };

  const assignedEmployee = employees.find(
    (emp) => emp._id === (task.assignedTo?._id || task.assignedTo)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-800 bg-red-100 border-red-300";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityBorderClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-800";
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const getFirstLetter = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id: task._id,
            status: task.status,
          })
        );
        onDragStart && onDragStart(task);
      }}
      onDragEnd={() => onDragEnd && onDragEnd()}
      className={`group cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg bg-white rounded-xl border border-gray-200 ${
        isDragging ? "opacity-50 rotate-2 scale-105" : ""
      } ${getPriorityBorderClass(task.priority)} border-l-4 hover:scale-[1.02]`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-2 flex-1 min-w-0">
            <GripVertical className="text-gray-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
            <h4 className="font-semibold text-gray-800 text-sm leading-tight flex-1 break-words">
              {task.title}
            </h4>
          </div>
          <button className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-600 leading-relaxed break-words">
                {isExpanded ? task.description : truncateText(task.description)}
              </p>
              {shouldTruncate(task.description) && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                  <button
                    onClick={() => onViewDescription(task)}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    title="View in modal"
                  >
                    <Eye className="h-3 w-3 mr-1 cursor-pointer" />
                    View
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Avatar - FIXED THIS PART */}
            <div className="relative inline-flex items-center justify-center h-6 w-6 flex-shrink-0">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-green-600 text-white font-semibold text-xs">
                {assignedEmployee?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            </div>

            {/* Priority */}
            <div
              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                task.priority
              )} flex-shrink-0`}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {task.priority}
            </div>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div
              className={`flex items-center text-xs flex-shrink-0 ${
                isOverdue ? "text-red-600 font-medium" : "text-gray-600"
              }`}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions - Always visible on mobile, hover on desktop */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            {task.status !== "pending" &&
              task.status !== "waiting-for-approval" && (
                <button
                  title="Move Back"
                  onClick={() => moveTask(task, "backward")}
                  className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all duration-200 flex items-center justify-center"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
              )}
            {task.status !== "completed" &&
              task.status !== "waiting-for-approval" && (
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

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  updateStatus,
  onDelete,
  onApprove,
  onViewDescription,
  onAddTask,
  employees,
}) => {
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

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.status !== status) {
      updateStatus(data.id, status);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-50 border-gray-200";
      case "in-progress":
        return "bg-blue-50 border-blue-200";
      case "completed":
        return "bg-green-50 border-green-200";
      case "waiting-for-approval":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="flex-1 min-w-[300px] max-w-[350px]">
      <div
        className={`transition-all duration-200 bg-white rounded-2xl border shadow-sm ${
          isDragOver ? "border-green-500 bg-green-50" : getStatusStyles(status)
        }`}
      >
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
              <p className="text-green-600 text-center text-sm font-medium">
                Drop here to move task
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-green-600" />
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center p-8">
    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    <p className="text-red-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

const TaskManagementBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.tasks || response.data || response || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(
        "Failed to load tasks. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await api.get("/employees");
      setEmployees(response.employees || response.data || response || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks(), fetchEmployees()]);
    };
    loadData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesEmployee =
      !selectedEmployee ||
      task.assignedTo === selectedEmployee ||
      task.assignedTo?._id === selectedEmployee;
    const matchesSearch =
      !searchQuery ||
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEmployee && matchesSearch;
  });

  const moveTask = async (task, direction) => {
    const currentIndex = statusTabs.indexOf(task.status);
    let newIndex;

    if (direction === "forward") {
      newIndex = Math.min(currentIndex + 1, statusTabs.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    await updateStatus(task._id, statusTabs[newIndex]);
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      setActionLoading(true);
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTask = (taskId) => {
    setConfirmAction({ type: "delete", taskId });
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (confirmAction && confirmAction.type === "delete") {
      try {
        setActionLoading(true);
        await api.delete(`/tasks/${confirmAction.taskId}`);
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== confirmAction.taskId)
        );
        setShowConfirmModal(false);
        setConfirmAction(null);
      } catch (err) {
        console.error("Error deleting task:", err);
        setError("You don't have permission to delete tasks.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const approveTask = async (taskId, approved) => {
    const newStatus = approved ? "completed" : "in-progress";
    await updateStatus(taskId, newStatus);
  };

  const viewTaskDescription = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const addNewTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!newTask.assignedTo) {
      alert("Please assign the task to an employee");
      return;
    }

    try {
      setActionLoading(true);
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
      };

      const response = await api.post("/tasks", taskData);
      const createdTask = response.task || response.data || response;

      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });
      setShowAddTaskModal(false);
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
            fetchTasks();
            fetchEmployees();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Project Board
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track your team's work
          </p>
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
              disabled={employeesLoading}
            >
              <option value="">All assignees</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {statusTabs.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter((task) => task.status === status)}
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
            {/* Task Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2 break-words leading-tight">
                    {selectedTask.title}
                  </h4>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedTask.priority === "urgent"
                          ? "text-red-800 bg-red-100 border-red-300"
                          : selectedTask.priority === "high"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : selectedTask.priority === "medium"
                          ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                          : "text-green-600 bg-green-50 border-green-200"
                      }`}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {selectedTask.priority?.charAt(0).toUpperCase() +
                        selectedTask.priority?.slice(1)}{" "}
                      Priority
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {statusLabels[selectedTask.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedTask.description && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  <h5 className="font-semibold text-gray-800">Description</h5>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {selectedTask.description}
                  </p>
                </div>
              </div>
            )}

            {/* Task Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned To */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assigned To
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative inline-flex items-center justify-center h-10 w-10">
                    <div className="flex items-center justify-center w-full h-full rounded-full bg-green-600 text-white font-semibold">
                      {employees
                        .find(
                          (emp) =>
                            emp._id ===
                            (selectedTask.assignedTo?._id ||
                              selectedTask.assignedTo)
                        )
                        ?.name?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {employees.find(
                        (emp) =>
                          emp._id ===
                          (selectedTask.assignedTo?._id ||
                            selectedTask.assignedTo)
                      )?.name || "Unassigned"}
                    </p>
                    <p className="text-sm text-gray-500">Team Member</p>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              {selectedTask.dueDate && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Due Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(selectedTask.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      {new Date(selectedTask.dueDate) < new Date() &&
                        selectedTask.status !== "completed" && (
                          <p className="text-sm text-red-600 font-medium">
                            Overdue
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Created
                </label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedTask.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedTask.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              {selectedTask.updatedAt && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Last Updated
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(selectedTask.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedTask.updatedAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter a descriptive task title"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="Describe the task requirements and goals"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assign To *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      assignedTo: e.target.value,
                    }))
                  }
                  className="w-full appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  disabled={employeesLoading}
                >
                  <option value="">Select assignee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={addNewTask}
              disabled={actionLoading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center justify-center"
            >
              {actionLoading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : null}
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
              <h3 className="text-lg font-bold text-gray-800">
                Confirm Action
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={actionLoading}
                className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementBoard;
