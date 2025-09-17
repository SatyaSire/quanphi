import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Briefcase,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  CreditCard
} from 'lucide-react';
import { Worker, WorkerFilters, ViewMode } from '../types/workers';
import { workersData, getWorkerFullName, getWorkerExperience } from '../data/workersData';
import DataTable from '../components/common/DataTable';

const WorkersPage: React.FC = () => {
  const [workers] = useState<Worker[]>(workersData);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<WorkerFilters>({
    search: '',
    role: '',
    department: '',
    status: undefined,
    project: ''
  });

  // Real-time stats calculation
  const realTimeStats = useMemo(() => {
    const totalWorkers = workers.length;
    const activeWorkers = workers.filter(w => w.status === 'active').length;
    const inactiveWorkers = workers.filter(w => w.status === 'inactive').length;
    
    // Calculate new joiners this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newJoinersThisMonth = workers.filter(w => {
      const joiningDate = new Date(w.jobInfo.joiningDate);
      return joiningDate.getMonth() === currentMonth && joiningDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate average experience
    const totalExperience = workers.reduce((sum, worker) => {
      return sum + getWorkerExperience(worker);
    }, 0);
    const averageExperience = totalWorkers > 0 ? (totalExperience / totalWorkers) : 0;
    
    // Mock attendance percentage (in real app, this would come from attendance data)
    const attendancePercentage = 87.5;
    
    return {
      totalWorkers,
      activeWorkers,
      inactiveWorkers,
      newJoinersThisMonth,
      attendancePercentage,
      averageExperience: Math.round(averageExperience * 10) / 10
    };
  }, [workers]);

  // Filter workers based on search and filters
  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      const fullName = getWorkerFullName(worker).toLowerCase();
      const searchTerm = filters.search?.toLowerCase() || '';
      
      const matchesSearch = !searchTerm || 
        fullName.includes(searchTerm) ||
        worker.jobInfo.role.toLowerCase().includes(searchTerm) ||
        worker.jobInfo.department.toLowerCase().includes(searchTerm) ||
        worker.personalInfo.phoneNumber.includes(searchTerm) ||
        worker.jobInfo.employeeId.toLowerCase().includes(searchTerm);
      
      const matchesRole = !filters.role || worker.jobInfo.role === filters.role;
      const matchesDepartment = !filters.department || worker.jobInfo.department === filters.department;
      const matchesStatus = !filters.status || worker.status === filters.status;
      const matchesProject = !filters.project || worker.jobInfo.currentProject?.includes(filters.project);
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesProject;
    });
  }, [workers, filters]);

  // DataTable columns configuration
  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      render: (value: any, record: Worker) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src={record.personalInfo.profilePicture || `https://ui-avatars.com/api/?name=${getWorkerFullName(record)}&background=6366f1&color=fff`}
              alt={getWorkerFullName(record)}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div>
            <Link
              to={`/workers/${record.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {getWorkerFullName(record)}
            </Link>
            <div className="text-sm text-gray-500">{record.jobInfo.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      dataIndex: 'contact',
      render: (value: any, record: Worker) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            {record.personalInfo.email}
          </div>
          <div className="flex items-center text-gray-500 mt-1">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            {record.personalInfo.phoneNumber}
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      sortable: true,
      render: (value: any, record: Worker) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {record.jobInfo.department}
        </span>
      ),
    },
    {
      key: 'experience',
      title: 'Experience',
      dataIndex: 'experience',
      render: (value: any, record: Worker) => (
        <div className="text-sm text-gray-900">
          {getWorkerExperience(record)} years
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value: any, record: Worker) => (
        <div className="flex items-center">
          {record.status === 'active' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              {record.status.replace('_', ' ').toUpperCase()}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'verification',
      title: 'Verification',
      dataIndex: 'verification',
      render: (value: any, record: Worker) => (
        <div className="flex items-center">
          {record.verificationStatus?.overallStatus === 'completed' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              {record.verificationStatus?.overallStatus === 'in_progress' ? 'In Progress' : 'Pending'}
            </span>
          )}
        </div>
      ),
    },
  ];

  // Bulk actions
  const bulkActions = [
    {
      key: 'activate',
      label: 'Activate Selected',
      icon: CheckCircle,
      onClick: (selectedRecords: Worker[]) => {
        console.log('Activating workers:', selectedRecords.map(w => w.id));
        // Handle bulk activation
      },
      variant: 'default' as const,
    },
    {
      key: 'deactivate',
      label: 'Deactivate Selected',
      icon: AlertCircle,
      onClick: (selectedRecords: Worker[]) => {
        console.log('Deactivating workers:', selectedRecords.map(w => w.id));
        // Handle bulk deactivation
      },
      variant: 'default' as const,
    },
    {
      key: 'export',
      label: 'Export Selected',
      icon: Download,
      onClick: (selectedRecords: Worker[]) => {
        console.log('Exporting workers:', selectedRecords.map(w => w.id));
        // Handle bulk export
      },
      variant: 'default' as const,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      onClick: (selectedRecords: Worker[]) => {
        console.log('Deleting workers:', selectedRecords.map(w => w.id));
        // Handle bulk delete
      },
      variant: 'danger' as const,
    },
  ];

  // Row actions
  const rowActions = [
    {
      key: 'view',
      label: 'View Profile',
      icon: Eye,
      onClick: (record: Worker) => {
        window.location.href = `/workers/${record.id}`;
      },
      variant: 'default' as const,
    },
    {
      key: 'edit',
      label: 'Edit Worker',
      icon: Edit,
      onClick: (record: Worker) => {
        window.location.href = `/workers/${record.id}/edit`;
      },
      variant: 'default' as const,
    },
    {
      key: 'verify',
      label: 'Toggle Verification',
      icon: Shield,
      onClick: (record: Worker) => {
        console.log('Toggle verification for:', record.id);
        // Handle verification toggle
      },
      variant: 'default' as const,
    },
    {
      key: 'delete',
      label: 'Delete Worker',
      icon: Trash2,
      onClick: (record: Worker) => {
        console.log('Deleting worker:', record.id);
        // Handle delete
      },
      variant: 'danger' as const,
    },
  ];

  const handleFilterChange = (key: keyof WorkerFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      department: '',
      status: undefined,
      project: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const WorkerCard: React.FC<{ worker: Worker }> = ({ worker }) => {
    const [showActions, setShowActions] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowActions(false);
        }
      };

      if (showActions) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [showActions]);

    const handleStatusToggle = async () => {
      setIsUpdatingStatus(true);
      setShowActions(false);
      // Simulate API call
      setTimeout(() => {
        // In a real app, this would update the worker status via API
        console.log(`Toggling status for worker ${worker.id} from ${worker.status}`);
        setIsUpdatingStatus(false);
      }, 1000);
    };

    const handleDeleteWorker = () => {
      if (window.confirm(`Are you sure you want to delete ${getWorkerFullName(worker)}?`)) {
        // In a real app, this would delete the worker via API
        console.log(`Deleting worker ${worker.id}`);
      }
      setShowActions(false);
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden group">
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={worker.personalInfo.profilePicture || `https://ui-avatars.com/api/?name=${getWorkerFullName(worker)}&background=6366f1&color=fff`}
                  alt={getWorkerFullName(worker)}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-all"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  worker.status === 'active' ? 'bg-green-500' : 
                  worker.status === 'inactive' ? 'bg-gray-400' :
                  worker.status === 'on_leave' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div className="flex-1">
                <Link
                  to={`/workers/${worker.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {getWorkerFullName(worker)}
                </Link>
                <p className="text-sm text-gray-600 mb-1">{worker.jobInfo.role}</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      worker.status === 'active' ? 'bg-green-400' : 
                      worker.status === 'inactive' ? 'bg-gray-400' :
                      worker.status === 'on_leave' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    {worker.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">ID: {worker.jobInfo.employeeId}</span>
                </div>
                <div className="flex items-center mt-2">
                   {worker.verificationStatus?.overallStatus === 'completed' ? (
                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       <CheckCircle className="w-3 h-3 mr-1" />
                       Verified
                     </span>
                   ) : (
                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       <Clock className="w-3 h-3 mr-1" />
                       {worker.verificationStatus?.overallStatus === 'in_progress' ? 'In Progress' : 'Pending'}
                     </span>
                   )}
                 </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {showActions && (
                <div ref={dropdownRef} className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                  <Link
                    to={`/workers/${worker.id}`}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                  <Link
                    to={`/workers/${worker.id}/edit`}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowActions(false)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Worker
                  </Link>
                  <button 
                    onClick={handleStatusToggle}
                    disabled={isUpdatingStatus}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-50 ${
                      worker.status === 'active' ? 'text-yellow-600' : 'text-green-600'
                    } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUpdatingStatus ? (
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-current"></div>
                    ) : (
                      <div className={`w-4 h-4 mr-2 rounded-full ${
                        worker.status === 'active' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    )}
                    {worker.status === 'active' ? 'Set Inactive' : 'Activate'}
                  </button>
                  <hr className="my-1" />

                  <hr className="my-1" />
                  <button 
                    onClick={handleDeleteWorker}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Worker
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
            <span>{worker.jobInfo.department}</span>
          </div>
          
          {worker.jobInfo.currentProject && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{worker.jobInfo.currentProject}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{worker.personalInfo.phoneNumber}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{getWorkerExperience(worker)} years experience</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          {/* Skills Section */}
          <div className="flex items-center space-x-2 mb-3">
            {worker.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {skill.name}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="text-xs text-gray-500">+{worker.skills.length - 3} more</span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => console.log(`Starting verification for worker ${worker.id}`)}
              className="w-full inline-flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Shield className="w-4 h-4 mr-2" />
              Start Verification
            </button>
            <Link
              to={`/workers/${worker.id}/id-card`}
              className="w-full inline-flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Create ID
            </Link>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white">
                        Workers
                      </h1>
                      <p className="text-xl text-blue-100 mt-2">
                        Manage and track your workforce and team members
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Workforce Management</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="group relative inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
                  <Download className="h-5 w-5 mr-2" />
                  Export Data
                </button>
                <Link
                  to="/workers/create"
                  className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  Add Worker
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Workers</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.totalWorkers}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">All Workers</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Workers</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.activeWorkers}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm">Currently Active</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          

          
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Attendance</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.attendancePercentage}%</p>
                <div className="flex items-center mt-2 text-orange-100">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span className="text-sm">Average</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Briefcase className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Avg Experience</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.averageExperience} yrs</p>
                <div className="flex items-center mt-2 text-teal-100">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm">Team Average</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 px-8 py-6 border-b border-blue-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Search & Filter Workers</h2>
                  <p className="text-gray-600 mt-1">Find and manage your workforce efficiently</p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-md'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-2xl">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search workers by name, role, skills, or department..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 focus:bg-white transition-all duration-200 placeholder-gray-500 text-lg shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors border ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-md border-gray-300' 
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-200'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors border ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-md border-gray-300' 
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              </div>
            </div>
          
            {/* Filter Options */}
            {showFilters && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Role</label>
                    <select
                      value={filters.role || ''}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 shadow-sm"
                    >
                      <option value="">All Roles</option>
                      <option value="Site Supervisor">Site Supervisor</option>
                      <option value="Architect">Architect</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Mason">Mason</option>
                      <option value="Carpenter">Carpenter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Department</label>
                    <select
                      value={filters.department || ''}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 shadow-sm"
                    >
                      <option value="">All Departments</option>
                      <option value="Construction">Construction</option>
                      <option value="Design">Design</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Finishing">Finishing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 shadow-sm"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => console.log('Applied filters:', filters)}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Apply Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Workers List/Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Enhanced Table Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Workers Directory
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Complete list of all workforce members and their details
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                  {filteredWorkers.length} of {workers.length} workers
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filters.search || Object.values(filters).some(f => f) 
                    ? "Try adjusting your search or filter criteria to find workers."
                    : "Get started by adding your first worker to the system."
                  }
                </p>
                <Link
                  to="/workers/create"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add {workers.length === 0 ? 'First' : 'New'} Worker</span>
                </Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            ) : (
              <DataTable
                data={filteredWorkers}
                columns={columns}
                bulkActions={bulkActions}
                rowActions={rowActions}
                onSearch={(searchText) => {
                  setFilters(prev => ({ ...prev, search: searchText }));
                }}
                searchPlaceholder="Search workers..."
                selectable={true}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredWorkers.length,
                  showSizeChanger: true,
                  pageSizeOptions: [10, 20, 50, 100]
                }}
                onPaginationChange={(page, pageSize) => {
                  setCurrentPage(page);
                  if (pageSize) setItemsPerPage(pageSize);
                }}
                loading={false}
                onSelectionChange={setSelectedWorkers}
                selectedRows={selectedWorkers}
                emptyText="No workers found"
                rowKey={(record) => record.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkersPage;