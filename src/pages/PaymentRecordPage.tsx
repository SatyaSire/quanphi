import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Tag,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  ChevronDown,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Banknote,
  Smartphone,
  Grid3X3,
  List,
  Send,
  Calculator,
  Receipt,
  Bell,
  Settings,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { workersData } from '../data/workersData';
import { mockAttendanceRecords } from '../data/attendanceData';
import { projects } from '../data/projectsData';
import { Worker } from '../types/workers';
import { AttendanceRecord } from '../types/attendance';
import DataTable from '../components/common/DataTable';

import {
  generateWorkerPayment,
  generateBatchPayments,
  validatePaymentData,
  PaymentCalculationResult,
  PaymentPeriod
} from '../utils/paymentCalculations';

// Payment Types
interface PaymentRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerRole: string;
  profilePicture?: string;
  payrollPeriod: string;
  hoursWorked: number;
  overtimeHours: number;
  grossPay: number;
  deductions: number;
  advances: number;
  netPay: number;
  paymentStatus: 'paid' | 'pending' | 'partial' | 'overdue';
  paymentMethod: 'cash' | 'bank_transfer' | 'upi' | 'mixed';
  paymentDate?: string;
  projectId: string;
  projectName: string;
  wageType: 'daily' | 'hourly' | 'fixed';
  dailyWage?: number;
  hourlyRate?: number;
  fixedSalary?: number;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  upiId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentFilters {
  search?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  projectId?: string;
  wageType?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface PaymentStats {
  totalWorkers: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalPayroll: number;
  avgSalary: number;
}

const PaymentRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBulkPayModal, setShowBulkPayModal] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [payrollPeriod, setPayrollPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Current payroll period
  const currentPeriod: PaymentPeriod = {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    type: 'monthly'
  };
  
  // Generate payment data using worker profiles and attendance integration
  const generatePaymentRecords = (): PaymentRecord[] => {
    const activeWorkers = workersData.filter(worker => worker.status === 'active');
    const workerIds = activeWorkers.map(worker => worker.id);
    
    // Generate payments with real worker profile integration
    const payments = generateBatchPayments(workerIds, currentPeriod);
    
    // Add some mock status variations for demo
    const paymentStatuses = ['paid', 'pending', 'partial', 'overdue'] as const;
    const paymentMethods = ['cash', 'bank_transfer', 'upi', 'mixed'] as const;
    
    return payments.map((payment, index) => ({
      ...payment,
      id: `pay-${payment.workerId}`,
      paymentStatus: paymentStatuses[index % 4],
      paymentMethod: paymentMethods[index % 4],
      paymentDate: index % 2 === 0 ? '2024-01-31' : undefined,
      notes: index % 3 === 0 ? 'Bonus included for excellent performance' : undefined
    }));
  };

  // Generate payment records using worker profile integration
  const mockPayments = useMemo(() => {
    return generatePaymentRecords();
  }, []);

  // Workers data for modals
  const workers = workersData.filter(worker => worker.status === 'active');

  // Calculate stats
  const paymentStats: PaymentStats = useMemo(() => {
    const totalWorkers = mockPayments.length;
    const paidRecords = mockPayments.filter(p => p.paymentStatus === 'paid');
    const pendingRecords = mockPayments.filter(p => p.paymentStatus === 'pending');
    const overdueRecords = mockPayments.filter(p => p.paymentStatus === 'overdue');
    const totalPayroll = mockPayments.reduce((sum, p) => sum + p.netPay, 0);
    const avgSalary = totalPayroll / totalWorkers;

    return {
      totalWorkers,
      totalPaid: paidRecords.length,
      totalPending: pendingRecords.length,
      totalOverdue: overdueRecords.length,
      totalPayroll,
      avgSalary
    };
  }, [mockPayments]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let filtered = mockPayments;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.workerName.toLowerCase().includes(searchLower) ||
        payment.workerRole.toLowerCase().includes(searchLower) ||
        payment.projectName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(payment => payment.paymentStatus === filters.paymentStatus);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }

    if (filters.projectId) {
      filtered = filtered.filter(payment => payment.projectId === filters.projectId);
    }

    if (filters.wageType) {
      filtered = filtered.filter(payment => payment.wageType === filters.wageType);
    }

    return filtered;
  }, [mockPayments, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'overdue': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4 text-green-500" />;
      case 'bank_transfer': return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'upi': return <Smartphone className="h-4 w-4 text-purple-500" />;
      case 'mixed': return <DollarSign className="h-4 w-4 text-orange-500" />;
      default: return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const handlePayment = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleBulkPayment = () => {
    setShowBulkPayModal(true);
  };

  const handleViewDetails = (payment: PaymentRecord) => {
    navigate(`/workers/${payment.workerId}`, { state: { activeTab: 'payments' } });
  };

  const handleGenerateSlip = (payment: PaymentRecord) => {
    // Navigate to salary slip page
    navigate(`/salary-slip/${payment.workerId}`);
  };

  const handleExportPayroll = () => {
    navigate('/export-payroll');
  };

  const handleReports = () => {
    navigate('/reports');
  };

  const handleAdvanceManagement = () => {
    navigate('/advances');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleAuditTrail = () => {
    navigate('/audit-trail');
  };

  const handlePayrollSettings = () => {
    navigate('/payroll-settings');
  };

  // Table columns for list view
  const paymentColumns = [
    {
      key: 'worker',
      title: 'Worker Details',
      dataIndex: 'workerName',
      sortable: true,
      render: (value: any, payment: PaymentRecord) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {payment.profilePicture ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={payment.profilePicture}
                alt={payment.workerName}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{payment.workerName}</div>
            <div className="text-xs text-gray-500">{payment.workerRole}</div>
            <div className="text-xs text-blue-600">{payment.projectName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'hours',
      title: 'Hours & Wage',
      dataIndex: 'hoursWorked',
      sortable: true,
      render: (value: any, payment: PaymentRecord) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900">
              {payment.hoursWorked}h
            </span>
            {payment.overtimeHours > 0 && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                +{payment.overtimeHours}h OT
              </span>
            )}
          </div>
          <div className="text-xs text-gray-600">
            {payment.wageType === 'daily' && `₹${payment.dailyWage}/day`}
            {payment.wageType === 'hourly' && `₹${payment.hourlyRate}/hour`}
            {payment.wageType === 'fixed' && `₹${payment.fixedSalary}/month`}
          </div>
        </div>
      ),
    },
    {
      key: 'payment',
      title: 'Payment Details',
      dataIndex: 'netPay',
      sortable: true,
      render: (value: any, payment: PaymentRecord) => (
        <div className="space-y-1">
          <div className="text-sm font-bold text-gray-900">
            {formatCurrency(payment.netPay)}
          </div>
          <div className="text-xs text-gray-600">
            Gross: {formatCurrency(payment.grossPay)}
          </div>
          {payment.deductions > 0 && (
            <div className="text-xs text-red-600">
              Deductions: -{formatCurrency(payment.deductions)}
            </div>
          )}
          {payment.advances > 0 && (
            <div className="text-xs text-orange-600">
              Advances: -{formatCurrency(payment.advances)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status & Method',
      dataIndex: 'paymentStatus',
      sortable: true,
      render: (value: any, payment: PaymentRecord) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon(payment.paymentStatus)}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(payment.paymentStatus)}`}>
              {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getPaymentMethodIcon(payment.paymentMethod)}
            <span className="text-xs text-gray-600">
              {payment.paymentMethod.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      sortable: false,
      render: (value: any, payment: PaymentRecord) => (
        <div className="flex items-center space-x-2">
          {payment.paymentStatus !== 'paid' && (
            <button
              onClick={() => handlePayment(payment)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Process Payment"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleViewDetails(payment)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleGenerateSlip(payment)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Generate Slip"
          >
            <Receipt className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col space-y-6">
              {/* Header with Bulk Payment Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Workers Payment
                    </h1>
                    <p className="text-xl text-blue-100 mt-2">
                      Manage payroll and worker payments for all workforce
                    </p>
                  </div>
                </div>
                
                {/* Bulk Payment button - top right aligned with header */}
                <button
                  onClick={handleBulkPayment}
                  className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
                >
                  <Send className="h-4 w-4 mr-1 lg:mr-2" />
                  Bulk Payment
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Management</span>
                  </div>
                </div>
                
                {/* Action buttons - single row on desktop, 3 per row on mobile */}
                <div className="grid grid-cols-3 lg:flex lg:flex-wrap items-center justify-start gap-2 lg:gap-3">
                  <button
                    onClick={handleExportPayroll}
                    className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
                  >
                    <Download className="h-4 w-4 mr-1 lg:mr-2" />
                    Export Payroll
                  </button>
                  <button
                    onClick={handleReports}
                    className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
                  >
                    <BarChart3 className="h-4 w-4 mr-1 lg:mr-2" />
                    Reports
                  </button>
                  <button
                    onClick={handleAdvanceManagement}
                    className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
                  >
                    <CreditCard className="h-4 w-4 mr-1 lg:mr-2" />
                    Advances
                  </button>
                  <button
                    onClick={handleNotifications}
                    className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
                  >
                    <Bell className="h-4 w-4 mr-1 lg:mr-2" />
                    Notifications
                  </button>
                  <button
                    onClick={handleAuditTrail}
                    className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
                  >
                    <FileText className="h-4 w-4 mr-1 lg:mr-2" />
                    Audit Trail
                  </button>
                  <button
                    onClick={handlePayrollSettings}
                    className="group relative inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm lg:text-base"
                  >
                    <Settings className="h-4 w-4 mr-1 lg:mr-2" />
                    Payroll Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Workers</p>
                <p className="text-3xl font-bold mt-2">{paymentStats.totalWorkers}</p>
                <p className="text-green-100 text-xs mt-1">Active payroll</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Paid Workers</p>
                <p className="text-3xl font-bold mt-2">{paymentStats.totalPaid}</p>
                <p className="text-blue-100 text-xs mt-1">This period</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Payments</p>
                <p className="text-3xl font-bold mt-2">{paymentStats.totalPending}</p>
                <p className="text-yellow-100 text-xs mt-1">Awaiting processing</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Clock className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Payroll</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(paymentStats.totalPayroll)}</p>
                <p className="text-purple-100 text-xs mt-1">This period</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
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
                  <h2 className="text-xl font-bold text-gray-900">Search & Filter Payments</h2>
                  <p className="text-gray-600 mt-1">Find and manage payment records efficiently</p>
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
                    placeholder="Search payments by worker name, employee ID, or payment details..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Status</label>
                    <select
                      value={filters.paymentStatus || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 shadow-sm"
                    >
                      <option value="">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <select
                      value={filters.paymentMethod || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 shadow-sm"
                    >
                      <option value="">All Methods</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Project</label>
                    <select
                      value={filters.projectId || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 shadow-sm"
                    >
                      <option value="">All Projects</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setFilters({})}
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

        {/* Enhanced Payment Records Directory */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Enhanced Table Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Payment Records Directory
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Complete list of all worker payments and salary records
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                  {filteredPayments.length} of {mockPayments.length} records
                </p>
              </div>
            </div>
          </div>

          {/* Payment Records Content */}
          <div className="p-8">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No payment records found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filters.search || Object.values(filters).some(f => f) 
                    ? "Try adjusting your search or filter criteria to find payment records."
                    : "Get started by processing your first worker payment."
                  }
                </p>
                <button
                  onClick={() => setShowBulkPayModal(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Process {mockPayments.length === 0 ? 'First' : 'New'} Payment</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPayments.map((payment) => (
                  <div key={payment.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      {payment.profilePicture ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={payment.profilePicture}
                          alt={payment.workerName}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{payment.workerName}</h3>
                        <p className="text-sm text-gray-600">{payment.workerRole}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(payment.paymentStatus)}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(payment.paymentStatus)}`}>
                          {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Net Pay</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(payment.netPay)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Hours Worked</span>
                        <span className="text-sm font-medium text-gray-900">{payment.hoursWorked}h</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <div className="flex items-center space-x-1">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="text-sm text-gray-900">
                            {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Project</span>
                        <span className="text-sm text-blue-600 font-medium">{payment.projectName}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                      {payment.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handlePayment(payment)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <Send className="h-4 w-4" />
                          <span>Pay Now</span>
                        </button>
                      )}
                      <button 
                        onClick={() => handleGenerateSlip(payment)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Receipt className="h-4 w-4" />
                        <span>Slip</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DataTable
                columns={paymentColumns}
                data={paginatedPayments}
                loading={false}
                onSort={() => {}}
                sortField=""
                sortDirection="asc"
              />
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contractor/Supervisor Payment Management Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Contractor & Supervisor Payments
                </h3>
                <p className="text-gray-600 mt-1">
                  Manage payments for contractors, subcontractors, and supervisors
                </p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4" />
              <span>New Contractor Payment</span>
            </button>
          </div>
        </div>

        {/* Contractor Payment Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Contractor Payment Cards */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">ABC Construction Co.</h4>
                    <p className="text-purple-100 text-sm">Main Contractor</p>
                  </div>
                </div>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-100 text-sm">Contract Value</span>
                  <span className="text-white font-semibold">₹15,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100 text-sm">Paid Amount</span>
                  <span className="text-white font-semibold">₹12,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100 text-sm">Pending</span>
                  <span className="text-yellow-200 font-semibold">₹3,00,000</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-white text-purple-600 hover:bg-gray-100 py-2 px-3 rounded-lg text-sm transition-colors font-medium">
                  Pay Now
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Rajesh Kumar</h4>
                    <p className="text-blue-100 text-sm">Site Supervisor</p>
                  </div>
                </div>
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Pending</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-100 text-sm">Monthly Salary</span>
                  <span className="text-white font-semibold">₹45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100 text-sm">Bonus</span>
                  <span className="text-white font-semibold">₹5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100 text-sm">Total Due</span>
                  <span className="text-yellow-200 font-semibold">₹50,000</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-white text-blue-600 hover:bg-gray-100 py-2 px-3 rounded-lg text-sm transition-colors font-medium">
                  Pay Now
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">XYZ Electrical Works</h4>
                    <p className="text-green-100 text-sm">Subcontractor</p>
                  </div>
                </div>
                <span className="bg-green-400 text-white text-xs px-2 py-1 rounded-full">Paid</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-100 text-sm">Contract Value</span>
                  <span className="text-white font-semibold">₹8,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-100 text-sm">Paid Amount</span>
                  <span className="text-white font-semibold">₹8,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-100 text-sm">Status</span>
                  <span className="text-green-200 font-semibold">Completed</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-white text-green-600 hover:bg-gray-100 py-2 px-3 rounded-lg text-sm transition-colors font-medium">
                  Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats for Contractors */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Contractors</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Supervisors</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">₹8.5L</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid This Month</p>
                  <p className="text-2xl font-bold text-gray-900">₹25.2L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Payment</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {selectedPayment.profilePicture ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={selectedPayment.profilePicture}
                    alt={selectedPayment.workerName}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">{selectedPayment.workerName}</div>
                  <div className="text-sm text-gray-600">{selectedPayment.workerRole}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gross Pay</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedPayment.grossPay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deductions</span>
                  <span className="text-sm font-medium text-red-600">-{formatCurrency(selectedPayment.deductions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Advances</span>
                  <span className="text-sm font-medium text-orange-600">-{formatCurrency(selectedPayment.advances)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Net Pay</span>
                  <span className="font-bold text-green-600">{formatCurrency(selectedPayment.netPay)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Payment Modal */}
      {showBulkPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Payment Processing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Workers</label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                  {filteredPayments.filter(p => p.paymentStatus !== 'paid').map(payment => (
                    <label key={payment.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPayments(prev => [...prev, payment.id]);
                          } else {
                            setSelectedPayments(prev => prev.filter(id => id !== payment.id));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-900">{payment.workerName}</span>
                      <span className="text-sm text-gray-600">({formatCurrency(payment.netPay)})</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Total Amount</span>
                  <span className="font-bold text-blue-900">
                    {formatCurrency(
                      selectedPayments.reduce((sum, id) => {
                        const payment = filteredPayments.find(p => p.id === id);
                        return sum + (payment?.netPay || 0);
                      }, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-blue-800">Selected Workers</span>
                  <span className="text-sm font-medium text-blue-900">{selectedPayments.length}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBulkPayModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={selectedPayments.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Process {selectedPayments.length} Payments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Management Modal */}

    </div>
  );
};

export default PaymentRecordPage;