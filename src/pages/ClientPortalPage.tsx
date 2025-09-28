import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import ChangeRequestsPage from './ChangeRequestsPage';
import {
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  CheckCircle,
  Building,
  CreditCard,
  ClipboardList,
  Home,
  FolderOpen,
  Mail,
  Download,
  Clock,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  Bot,
  Paperclip,
  Calendar as CalendarIcon,
  Target,
  Users,
  ArrowRight,
  Play,
  Pause,
  MoreHorizontal,
  ChevronRight,
  Star,
  Zap,
  Plus,
  X
} from 'lucide-react';

type ActiveSection = 'dashboard' | 'projects' | 'change-requests' | 'payments' | 'invoices' | 'messages' | 'approvals';

const ClientPortalPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    category: 'web-development'
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const navigate = useNavigate();
  const { drawerOpen } = useAppSelector((state) => state.ui);

  // Mock projects data
  const allProjects = [
    {
      id: 'PRJ-001',
      name: 'Office Complex Renovation',
      location: 'Downtown Business District',
      status: 'active',
      priority: 'high',
      category: 'renovation',
      workProgress: 75,
      paymentProgress: 60,
      budget: 85000,
      spent: 63750,
      dueDate: 'Mar 15, 2024',
      daysLeft: 45,
      manager: 'Sarah Johnson',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'PRJ-002',
      name: 'Residential Villa Construction',
      location: 'Hillside Gardens',
      status: 'active',
      priority: 'medium',
      category: 'construction',
      workProgress: 45,
      paymentProgress: 30,
      budget: 120000,
      spent: 54000,
      dueDate: 'Jun 20, 2024',
      daysLeft: 89,
      manager: 'Mike Chen',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'PRJ-003',
      name: 'Shopping Mall Interior',
      location: 'Central Plaza',
      status: 'completed',
      priority: 'low',
      category: 'interior',
      workProgress: 100,
      paymentProgress: 100,
      budget: 95000,
      spent: 95000,
      dueDate: 'Completed',
      daysLeft: 0,
      manager: 'Lisa Wang',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  // Filter projects based on selected filters
  const filteredProjects = allProjects.filter(project => {
    if (filterOptions.status !== 'all' && project.status !== filterOptions.status) {
      return false;
    }
    if (filterOptions.priority !== 'all' && project.priority !== filterOptions.priority) {
      return false;
    }
    if (filterOptions.category !== 'all' && project.category !== filterOptions.category) {
      return false;
    }
    return true;
  });

  // Mock client data
  const clientData = {
    name: 'John Smith',
    company: 'Smith Construction Ltd.',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567'
  };

  // Mock stats data
  const stats = {
    activeProjects: 3,
    totalSpent: 125000,
    pendingInvoices: 2,
    completedTasks: 47,
    pendingApprovals: 1,
    unreadMessages: 5,
    totalContractValue: 180000,
    remainingBudget: 55000,
    overallProgress: 68
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Form validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Project name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.budget.trim()) {
      errors.budget = 'Budget is required';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      errors.budget = 'Please enter a valid budget amount';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    return errors;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmitProject = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        budget: '',
        startDate: '',
        endDate: '',
        priority: 'medium',
        category: 'web-development'
      });
      setFormErrors({});
      setShowNewProjectModal(false);
      
      // Show success message (you could add a toast notification here)
      alert('Project created successfully!');
      
    } catch (error) {
      alert('Error creating project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowNewProjectModal(false);
    setFormData({
      name: '',
      description: '',
      budget: '',
      startDate: '',
      endDate: '',
      priority: 'medium',
      category: 'web-development'
    });
    setFormErrors({});
  };

  // Filter functionality
  const handleFilterChange = (filterType: string, value: string) => {
    setFilterOptions(prev => ({ ...prev, [filterType]: value }));
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);
  };

  // Dropdown menu handlers
  const toggleDropdown = (projectId: string) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  const handleProjectAction = (action: string, projectId: string) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'edit':
        // Navigate to edit project page
        navigate(`/client-portal/project/${projectId}/edit`);
        break;
      case 'duplicate':
        // Handle project duplication
        alert(`Duplicating project ${projectId}`);
        break;
      case 'archive':
        // Handle project archiving
        if (confirm('Are you sure you want to archive this project?')) {
          alert(`Project ${projectId} archived`);
        }
        break;
      case 'delete':
        // Handle project deletion
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
          alert(`Project ${projectId} deleted`);
        }
        break;
      case 'viewReport':
        // Navigate to project report page
        navigate(`/client-portal/project/${projectId}/report`);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'On Track', color: 'bg-green-500' };
      case 'completed':
        return { text: 'Completed', color: 'bg-green-500' };
      case 'on-hold':
        return { text: 'On Hold', color: 'bg-red-500' };
      default:
        return { text: 'In Progress', color: 'bg-yellow-500' };
    }
  };

  // Helper function to get button color based on gradient
  const getButtonColor = (gradient: string) => {
    if (gradient.includes('blue')) return 'bg-blue-600 hover:bg-blue-700';
    if (gradient.includes('yellow')) return 'bg-yellow-600 hover:bg-yellow-700';
    if (gradient.includes('green')) return 'bg-green-600 hover:bg-green-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  // Helper function to get border color based on gradient
  const getBorderColor = (gradient: string) => {
    if (gradient.includes('blue')) return 'hover:border-blue-300';
    if (gradient.includes('yellow')) return 'hover:border-yellow-300';
    if (gradient.includes('green')) return 'hover:border-green-300';
    return 'hover:border-blue-300';
  };

  const navigationButtons = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: Building,
      color: 'from-green-500 to-emerald-600'
    },
    {
      key: 'change-requests',
      label: 'Change Requests',
      icon: ClipboardList,
      color: 'from-orange-500 to-amber-600'
    },
    {
      key: 'payments',
      label: 'Payments',
      icon: CreditCard,
      color: 'from-purple-500 to-violet-600'
    },
    {
      key: 'invoices',
      label: 'Invoices',
      icon: FileText,
      color: 'from-red-500 to-pink-600'
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      key: 'approvals',
      label: 'Approvals',
      icon: CheckCircle,
      color: 'from-teal-500 to-green-600'
    }
  ];

  const getSectionContent = (section: ActiveSection) => {
    const contents = {
      dashboard: {
        title: "Satya's Dashboard",
        content: (
          <div className="space-y-8">
            {/* Beautiful Colorful Header - Full Width with Rounded Corners */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 via-pink-500 to-orange-500 rounded-2xl p-8 mb-8 shadow-2xl -mx-8 -mt-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              <div className="relative z-10 flex items-center justify-between px-8">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-xl">
                    <Home className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                      Satya's Dashboard
                    </h1>
                    <p className="text-white/90 text-lg font-medium">
                      Welcome to your project management hub
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Progress */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">Overall Progress</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2 group-hover:text-blue-800 transition-colors duration-300">{stats.overallProgress}%</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                    <TrendingUp className="h-12 w-12 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.overallProgress}%` }}></div>
                </div>
              </div>

              {/* Budget Overview */}
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-2xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-green-600 text-sm font-medium group-hover:text-green-700 transition-colors duration-300">Budget Spent</p>
                    <p className="text-2xl font-bold text-green-900 mt-1 group-hover:text-green-800 transition-colors duration-300">{formatCurrency(stats.totalSpent)}</p>
                    <p className="text-xs text-green-600 group-hover:text-green-700 transition-colors duration-300">of {formatCurrency(stats.totalContractValue)}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                    <PieChart className="h-12 w-12 text-green-500 group-hover:text-green-600 transition-colors duration-300" />
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(stats.totalSpent / stats.totalContractValue) * 100}%` }}></div>
                </div>
              </div>

              {/* Active Projects */}
              <div className="group bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium group-hover:text-purple-700 transition-colors duration-300">Active Projects</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2 group-hover:text-purple-800 transition-colors duration-300">{stats.activeProjects}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                    <Building className="h-12 w-12 text-purple-500 group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects - Full Width */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[600px]">
                {/* Section Header with Colored Background */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Recent Projects</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 transform hover:scale-105">
                        <Search className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 transform hover:scale-105">
                        <Filter className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">Office Complex Renovation</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
                              On Track
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 group-hover:text-gray-700 transition-colors duration-300">Complete renovation of the main office building</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>Sarah Johnson</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Mar 15, 2024</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(63750)} / {formatCurrency(85000)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105">
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">Warehouse Extension</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 group-hover:shadow-md transition-all duration-300">
                              In Progress
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 group-hover:text-gray-700 transition-colors duration-300">Adding 2000 sq ft extension to existing warehouse</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>Mike Chen</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Apr 20, 2024</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(29250)} / {formatCurrency(65000)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105">
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications - Full Width Section Below Recent Projects */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[500px]">
                {/* Section Header with Colored Background */}
                <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Notifications</h3>
                    </div>
                    <button className="text-xs text-white/80 hover:text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all duration-200 font-medium">Mark all read</button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-3">
                    <div className="group p-4 rounded-xl border bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200">Milestone Due Tomorrow</h4>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 mb-2">Electrical Installation Complete is due tomorrow</p>
                          <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200">2 hours ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="group p-4 rounded-xl border bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-200">Invoice #245 Pending</h4>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 mb-2">Payment of $15,000 is due in 3 days</p>
                          <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200">4 hours ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="group p-4 rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Document Approved</h4>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 mb-2">Construction permit has been approved</p>
                          <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200">1 day ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="group p-4 rounded-xl border bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">Payment Received</h4>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 mb-2">Payment of $25,000 has been processed</p>
                          <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant - Full Width Section Below */}
            <div className="space-y-8 mt-8">
              {/* AI Chat Assistant - Full Width */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[500px]">
                {/* Section Header with Colored Background */}
                <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 h-[calc(100%-80px)] flex flex-col">
                  <div className="bg-white rounded-xl p-4 mb-4 flex-1 overflow-y-auto shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-full">
                          <Bot className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm">
                          Hello! I can help you with project updates, payment status, and more. What would you like to know?
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm">
                          What's the status of my Office Complex Renovation project?
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-full">
                          <Bot className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm">
                          Your Office Complex Renovation is 75% complete and on track! The electrical installation milestone is due tomorrow. Budget spent: $63,750 of $85,000.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="Ask about your projects..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
                    />
                    <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-white text-indigo-600 text-xs rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 transform hover:scale-105 font-medium">
                      Project status
                    </button>
                    <button className="px-4 py-2 bg-white text-indigo-600 text-xs rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 transform hover:scale-105 font-medium">
                      Payment due
                    </button>
                    <button className="px-4 py-2 bg-white text-indigo-600 text-xs rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 transform hover:scale-105 font-medium">
                      Milestones
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Milestones Panel - Full Width */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[500px]">
                {/* Section Header with Colored Background */}
                <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Upcoming Milestones</h3>
                    </div>
                    <button className="text-xs text-white/80 hover:text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all duration-200 font-medium">View All</button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Clock className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Electrical Installation</h4>
                            <p className="text-xs text-gray-500">Office Complex Renovation</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Due Tomorrow</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Progress: 85%</span>
                        <span>Mar 15, 2024</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Foundation Completion</h4>
                            <p className="text-xs text-gray-500">Warehouse Extension</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">5 days left</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Progress: 60%</span>
                        <span>Mar 20, 2024</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Interior Design</h4>
                            <p className="text-xs text-gray-500">Retail Store Fit-out</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Progress: 100%</span>
                        <span>Feb 28, 2024</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Documents Panel - Full Width */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[500px]">
                {/* Section Header with Colored Background */}
                <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Recent Documents</h3>
                    </div>
                    <button className="text-xs text-white/80 hover:text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all duration-200 font-medium">View All</button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-3">
                    <div className="group flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">Construction Permit.pdf</h4>
                        <p className="text-xs text-gray-500">Office Complex Renovation • 2.4 MB</p>
                        <p className="text-xs text-gray-400">Uploaded 2 hours ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="group flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">Blueprint_v2.dwg</h4>
                        <p className="text-xs text-gray-500">Warehouse Extension • 5.1 MB</p>
                        <p className="text-xs text-gray-400">Uploaded 1 day ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="group flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">Invoice_245.pdf</h4>
                        <p className="text-xs text-gray-500">Payment Invoice • 1.2 MB</p>
                        <p className="text-xs text-gray-400">Uploaded 2 days ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="group flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">Safety_Report.pdf</h4>
                        <p className="text-xs text-gray-500">Safety Inspection • 3.7 MB</p>
                        <p className="text-xs text-gray-400">Uploaded 3 days ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      projects: {
        title: 'My Projects',
        content: (
          <div className="space-y-8">
            {/* Beautiful Projects Header - Matching Dashboard Style */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 via-teal-500 to-cyan-500 rounded-2xl p-8 mb-8 shadow-2xl -mx-8 -mt-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              <div className="relative z-10 flex items-center justify-between px-8">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-xl">
                    <Building className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                      My Projects
                    </h1>
                    <p className="text-white/90 text-lg font-medium">
                      Track progress and manage your construction projects
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 text-white font-medium shadow-lg"
                  >
                    <Filter className="h-5 w-5" />
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                  </button>
                  <button 
                    onClick={() => navigate('/client-portal/projects/new')}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-white/90 transition-all duration-200 font-medium shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Project</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Filter Section */}
            {showFilters && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Bar */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Projects
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by project name, description..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterOptions.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="all">All Status</option>
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Under Review</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={filterOptions.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Additional Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterOptions.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="all">All Categories</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="consulting">Consulting</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date From
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date To
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setFilterOptions({ status: 'all', priority: 'all', category: 'all' });
                      }}
                      className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-200 font-medium rounded-lg"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => {
                        // Apply filters logic (currently filters are applied automatically)
                        console.log('Filters applied:', filterOptions);
                      }}
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium rounded-lg"
                    >
                      Apply Filters
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Showing {filteredProjects.length} of {allProjects.length} projects
                  </div>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Building className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl font-medium">No projects found</p>
                    <p className="text-sm">Try adjusting your filters or create a new project.</p>
                  </div>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const statusBadge = getStatusBadge(project.status);
                  const buttonColor = getButtonColor(project.gradient);
                  const borderColor = getBorderColor(project.gradient);
                  
                  return (
                    <div key={project.id} className={`group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl ${borderColor} transition-all duration-300 transform hover:-translate-y-2`}>
                      <div className="relative">
                        <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 ${statusBadge.color} text-white text-xs font-medium rounded-full shadow-lg`}>
                              {statusBadge.text}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(project.id);
                              }}
                              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {activeDropdown === project.id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <button
                                  onClick={() => handleProjectAction('edit', project.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit Project</span>
                                </button>
                                <button
                                  onClick={() => handleProjectAction('duplicate', project.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>Duplicate</span>
                                </button>
                                <button
                                  onClick={() => handleProjectAction('archive', project.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>Archive</span>
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleProjectAction('delete', project.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                            <p className="text-white/80 text-sm">{project.location}</p>
                          </div>
                        </div>
                      </div>
                
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Building className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Project Manager</p>
                              <p className="text-xs text-gray-500">{project.manager}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(project.spent)}</p>
                            <p className="text-xs text-gray-500">of {formatCurrency(project.budget)}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4 space-y-3">
                          {/* Work Progress */}
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Work Progress</span>
                              <span className="font-medium text-gray-900">{project.workProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${project.workProgress}%` }}></div>
                            </div>
                          </div>
                          
                          {/* Payment Progress */}
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Payment Progress</span>
                              <span className="font-medium text-gray-900">{project.paymentProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${project.paymentProgress}%` }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Due: {project.dueDate}</span>
                          </div>
                          {project.daysLeft > 0 && (
                            <span className="text-orange-600 font-medium">{project.daysLeft} days left</span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <button 
            onClick={() => navigate(`/client-portal/project/${project.id}`)}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 ${buttonColor} text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-md`}
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
                          <button 
                            onClick={() => handleProjectAction('viewReport', project.id)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-md"
                          >
                            <Download className="h-4 w-4" />
                            <span>View Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        
        )
      },
      'change-requests': {
        title: 'Change Requests',
        content: <ChangeRequestsPage />
      },
      payments: {
        title: 'Payment History',
        content: <div className="p-6 text-gray-600">Payment history content will be implemented here.</div>
      },
      invoices: {
        title: 'Invoices',
        content: <div className="p-6 text-gray-600">Invoices content will be implemented here.</div>
      },
      messages: {
        title: 'Messages',
        content: <div className="p-6 text-gray-600">Messages content will be implemented here.</div>
      },
      approvals: {
        title: 'Pending Approvals',
        content: <div className="p-6 text-gray-600">Approvals content will be implemented here.</div>
      }
    };
    
    return contents[section];
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
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {clientData.name}</h1>
                      <p className="text-blue-100 text-lg">{clientData.company}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="group relative inline-flex items-center px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Download className="h-5 w-5 mr-2" />
                  Export Data
                </button>
                <button className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Mail className="h-6 w-6 mr-2" />
                  Contact Support
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-300 ${
          drawerOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-4'
        }`}>
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Projects</p>
                <p className="text-3xl font-bold mt-2">{stats.activeProjects}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Building className="h-4 w-4 mr-1" />
                  <span className="text-sm">In Progress</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Building className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalSpent)}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">This Year</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Pending Invoices</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingInvoices}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="text-sm">Awaiting Payment</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Unread Messages</p>
                <p className="text-3xl font-bold mt-2">{stats.unreadMessages}</p>
                <div className="flex items-center mt-2 text-red-100">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-sm">New Updates</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <MessageSquare className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {navigationButtons.map((button) => {
              const IconComponent = button.icon;
              const isActive = activeSection === button.key;
              
              return (
                <button
                  key={button.key}
                  onClick={() => setActiveSection(button.key as ActiveSection)}
                  className={`group relative p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-br ${button.color} text-white shadow-2xl border-2 border-white/30`
                      : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow-xl border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <IconComponent className={`h-6 w-6 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 text-center ${
                      isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                    }`}>
                      {button.label}
                    </span>
                  </div>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ease-in-out">
            <div className="transition-all duration-300 ease-in-out transform">
              {getSectionContent(activeSection)?.content}
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <p className="text-gray-600 mt-1">Fill in the details to start your new project</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter project name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    formErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Describe your project requirements and goals"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Budget and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {formErrors.budget && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handleInputChange('priority', priority)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium capitalize ${
                        formData.priority === priority
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProject}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Filter Projects</h2>
              <button
                onClick={closeFilterModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="p-6 space-y-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                <div className="space-y-2">
                  {['all', 'active', 'completed', 'on-hold'].map((status) => (
                    <label key={status} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={filterOptions.status === status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{status === 'all' ? 'All Status' : status.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Priority</label>
                <div className="space-y-2">
                  {['all', 'low', 'medium', 'high'].map((priority) => (
                    <label key={priority} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={filterOptions.priority === priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{priority === 'all' ? 'All Priorities' : priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <div className="space-y-2">
                  {['all', 'renovation', 'construction', 'interior', 'maintenance'].map((category) => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filterOptions.category === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{category === 'all' ? 'All Categories' : category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeFilterModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={closeFilterModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortalPage;