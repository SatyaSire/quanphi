import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  MoreVertical,
  Download,
  Send,
  Calendar,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  getAllQuotations, 
  getFilteredQuotations, 
  getQuotationStats,
  duplicateQuotation,
  deleteQuotation
} from '../data/quotationsData';
import DataTable from '../components/common/DataTable';
// Using local types from quotationsData to avoid import issues
type QuotationStatus = 'draft' | 'finalized' | 'sent' | 'accepted' | 'rejected' | 'expired';

interface QuotationLineItem {
  id: string;
  category: string;
  description: string;
  unit: 'Sqft' | 'Nos' | 'Rft' | 'Lumpsum' | 'Day' | 'Kg' | 'Meter' | 'Hour';
  quantity: number;
  rate: number;
  amount: number;
  discount?: number;
  discountAmount?: number;
}

interface QuotationPaymentTerms {
  advance: number;
  milestone1: number;
  milestone2?: number;
  final: number;
  description: string;
}

interface QuotationTermsConditions {
  id: string;
  title: string;
  content: string;
  isDefault: boolean;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  siteAddress: string;
  workDescription: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  totalDiscount: number;
  totalAmount: number;
  termsConditions: QuotationTermsConditions[];
  paymentTerms: QuotationPaymentTerms;
  validityPeriod: number;
  validUntil: string;
  status: QuotationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  attachments: any[];
  sendHistory: any[];
  versions: any[];
  currentVersion: number;
  aiGenerated: boolean;
  originalInput?: string;
  companyLogo?: string;
  companyName: string;
  companyAddress: string;
  companyGSTIN?: string;
  companyPhone: string;
  companyEmail: string;
  followUpDate?: string;
  followUpNotes?: string;
  convertedToProject: boolean;
  convertedProjectId?: string;
  convertedAt?: string;
}

interface QuotationStats {
  totalQuotations: number;
  quotationsSentThisMonth: number;
  quotationsAccepted: number;
  quotationsRejected: number;
  averageQuotationAmount: number;
  conversionRate: number;
  totalValue: number;
  pendingFollowUps: number;
}

interface QuotationFilters {
  clientId?: string;
  status?: QuotationStatus;
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>(getAllQuotations());
  const [filters, setFilters] = useState<QuotationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);
  const [sortInfo, setSortInfo] = useState<{field: string; order: 'asc' | 'desc'} | null>(null);
  // Calculate dynamic stats from quotations data
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthQuotations = quotations.filter(q => {
      const quotationDate = new Date(q.createdAt);
      return quotationDate.getMonth() === currentMonth && quotationDate.getFullYear() === currentYear;
    });
    
    const acceptedQuotations = quotations.filter(q => q.status === 'accepted');
    const rejectedQuotations = quotations.filter(q => q.status === 'rejected');
    const totalValue = quotations.reduce((sum, q) => sum + q.totalAmount, 0);
    const conversionRate = quotations.length > 0 ? (acceptedQuotations.length / quotations.length) * 100 : 0;
    const averageAmount = quotations.length > 0 ? totalValue / quotations.length : 0;
    
    return {
      totalQuotations: quotations.length,
      quotationsSentThisMonth: thisMonthQuotations.length,
      quotationsAccepted: acceptedQuotations.length,
      quotationsRejected: rejectedQuotations.length,
      averageQuotationAmount: averageAmount,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      totalValue: totalValue,
      pendingFollowUps: quotations.filter(q => q.followUpDate && new Date(q.followUpDate) <= new Date()).length
    };
  }, [quotations]);

  // Define columns for DataTable
  const quotationColumns = [
    {
      key: 'quotationNumber',
      title: 'Quotation No.',
      dataIndex: 'quotationNumber',
      sortable: true,
      render: (value: any, quotation: Quotation) => (
        <div className="space-y-1">
          <button
            onClick={() => navigate(`/quotations/${quotation.id}`)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
          >
            {quotation.quotationNumber}
          </button>
          <div className="text-xs text-gray-500">ID: {quotation.id.slice(0, 8)}</div>
        </div>
      ),
    },
    {
      key: 'client',
      title: 'Client / Project',
      dataIndex: 'clientName',
      sortable: true,
      render: (value: any, quotation: Quotation) => (
        <div className="space-y-1">
          <button
            onClick={() => navigate(`/quotations/${quotation.id}`)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
          >
            {quotation.clientName}
          </button>
          <div className="text-xs text-gray-500">{quotation.projectName}</div>
        </div>
      ),
    },
    {
      key: 'date',
      title: 'Date / Validity',
      dataIndex: 'createdAt',
      sortable: true,
      render: (value: any, quotation: Quotation) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">{formatDate(quotation.createdAt)}</div>
          <div className="text-xs text-gray-500">Valid till: {formatDate(quotation.validUntil)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value: any, quotation: Quotation) => getStatusBadge(quotation.status),
    },
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'totalAmount',
      sortable: true,
      render: (value: any, quotation: Quotation) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">{formatCurrency(quotation.totalAmount)}</div>
          <div className="text-xs text-gray-500">{quotation.lineItems?.length || 0} items</div>
        </div>
      ),
    },
  ];

  // Define row actions
  const quotationRowActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (quotation: Quotation) => navigate(`/quotations/${quotation.id}`),
      className: 'text-blue-600 hover:text-blue-900',
    },
    {
      key: 'edit',
      label: 'Edit Quotation',
      icon: Edit,
      onClick: (quotation: Quotation) => navigate(`/quotations/${quotation.id}/edit`),
      className: 'text-green-600 hover:text-green-900',
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      onClick: (quotation: Quotation) => handleDuplicate(quotation.id),
      className: 'text-purple-600 hover:text-purple-900',
    },
  ];

  // Define bulk actions
  const quotationBulkActions = [
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      onClick: (selectedIds: string[]) => {
        console.log('Delete quotations:', selectedIds);
        // Implement bulk delete logic
      },
      className: 'text-red-600 hover:text-red-900',
      variant: 'danger' as const,
    },
    {
      key: 'export',
      label: 'Export Selected',
      icon: Download,
      onClick: (selectedIds: string[]) => {
        console.log('Export quotations:', selectedIds);
        // Implement bulk export logic
      },
      className: 'text-blue-600 hover:text-blue-900',
    },
    {
      key: 'send',
      label: 'Send Selected',
      icon: Send,
      onClick: (selectedIds: string[]) => {
        console.log('Send quotations:', selectedIds);
        // Implement bulk send logic
      },
      className: 'text-green-600 hover:text-green-900',
    },
  ];

  // Filter and search quotations
  const filteredQuotations = useMemo(() => {
    const searchFilters = { ...filters, search: searchTerm };
    let filtered = getFilteredQuotations(searchFilters);
    
    // Apply sorting if sortInfo exists
    if (sortInfo) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortInfo.field as keyof Quotation];
        let bValue = b[sortInfo.field as keyof Quotation];
        
        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortInfo.order === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (aValue < bValue) return sortInfo.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortInfo.order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [filters, searchTerm, sortInfo]);

  // Pagination
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: keyof QuotationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDuplicate = (quotationId: string) => {
    const duplicated = duplicateQuotation(quotationId);
    if (duplicated) {
      setQuotations(getAllQuotations());
    }
  };

  const handleDelete = (quotationId: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      const success = deleteQuotation(quotationId);
      if (success) {
        setQuotations(getAllQuotations());
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { 
        bg: 'bg-gray-100 border border-gray-300', 
        text: 'text-gray-700', 
        label: 'Draft',
        icon: '📝',
        pulse: false
      },
      finalized: { 
        bg: 'bg-blue-100 border border-blue-300', 
        text: 'text-blue-800', 
        label: 'Finalized',
        icon: '✅',
        pulse: false
      },
      sent: { 
        bg: 'bg-yellow-100 border border-yellow-300', 
        text: 'text-yellow-800', 
        label: 'Sent',
        icon: '📤',
        pulse: true
      },
      accepted: { 
        bg: 'bg-green-100 border border-green-300', 
        text: 'text-green-800', 
        label: 'Accepted',
        icon: '🎉',
        pulse: false
      },
      rejected: { 
        bg: 'bg-red-100 border border-red-300', 
        text: 'text-red-800', 
        label: 'Rejected',
        icon: '❌',
        pulse: false
      },
      expired: { 
        bg: 'bg-orange-100 border border-orange-300', 
        text: 'text-orange-700', 
        label: 'Expired',
        icon: '⏰',
        pulse: false
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${
        config.pulse ? 'animate-pulse' : ''
      }`}>
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Quotations 📋
                    </h1>
                    <p className="text-xl text-blue-100 mt-2">
                      Manage and track your project quotations
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quotation Management</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/quotations/new"
                  className="group relative inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  New Quotation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {/* Total Quotations Card */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Quotations</p>
                <p className="text-3xl font-bold mt-2">{stats.totalQuotations}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+5 this week</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* This Month Card */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold mt-2">{stats.quotationsSentThisMonth}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Conversion Rate Card */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold mt-2">{stats.conversionRate}%</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Industry avg: 45%</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Total Value Card */}
          <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalValue / 100000)}L</p>
                <div className="flex items-center mt-2 text-yellow-100">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">+₹2.5L this month</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Quotations</h3>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by client, project, quotation number, or amount..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Quotation Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">📝 Draft</option>
                    <option value="finalized">✅ Finalized</option>
                    <option value="sent">📤 Sent</option>
                    <option value="accepted">🎉 Accepted</option>
                    <option value="rejected">❌ Rejected</option>
                    <option value="expired">⏰ Expired</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Amount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Amount"
                      value={filters.amountMin || ''}
                      onChange={(e) => handleFilterChange('amountMin', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="number"
                      placeholder="Max Amount"
                      value={filters.amountMax || ''}
                      onChange={(e) => handleFilterChange('amountMax', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredQuotations.length} of {quotations.length} quotations
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setFilters({});
                      setSearchTerm('');
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      // Apply current filters - this will trigger the filtering logic
                      console.log('Filters applied:', filters);
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Enhanced Quotations Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quotation Directory</h3>
                <p className="text-sm text-gray-600">Comprehensive quotation management and tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">{filteredQuotations.length} Filtered Quotations</span>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <DataTable
          data={paginatedQuotations}
          columns={quotationColumns}
          loading={false}
          selectable={true}
          selectedRows={selectedQuotations}
          onSelectionChange={setSelectedQuotations}
          rowActions={quotationRowActions}
          bulkActions={quotationBulkActions}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: filteredQuotations.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50]
          }}
          onPaginationChange={(page, pageSize) => {
             setCurrentPage(page);
             if (pageSize !== itemsPerPage) {
               setItemsPerPage(pageSize);
               setCurrentPage(1); // Reset to first page when page size changes
             }
           }}
          onSortChange={(newSortInfo) => {
            setSortInfo(newSortInfo);
            setCurrentPage(1); // Reset to first page when sorting changes
          }}
          rowClassName={(quotation) => `hover:bg-gray-50 transition-colors ${
            quotation.totalAmount > 500000 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' : 'bg-white'
          }`}
          emptyState={
            <div className="flex flex-col items-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Quotations Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your quotation pipeline by creating your first quotation. 
                Track proposals, manage client communications, and monitor conversion rates.
              </p>
              <Link
                to="/quotations/new"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Quotation
              </Link>
            </div>
          }
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredQuotations.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredQuotations.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default QuotationsPage;