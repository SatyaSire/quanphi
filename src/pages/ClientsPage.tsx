import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useGetClientsQuery, useDeleteClientMutation } from '../api/apiService'; // Will reconnect when backend is ready
import DataTable from '../components/common/DataTable';
import { LoadingState } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/Modal';
import { InputField, SelectField } from '../components/common/FormField';
import { getAllClients } from '../data/clientsData';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  TagIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon as BuildingOfficeSolid,
  UserGroupIcon as UserGroupSolid,
  CurrencyDollarIcon as CurrencyDollarSolid,
  ChartBarIcon as ChartBarSolid,
} from '@heroicons/react/24/solid';
// Local type definitions to avoid import issues
type ClientStatus = 'active' | 'archived' | 'blacklisted';
type CompanyType = 'individual' | 'company' | 'government';
type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'sms';
type RiskLevel = 'low' | 'medium' | 'high';

interface ClientAddress {
  id: string;
  type: 'headquarters' | 'site' | 'billing';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: boolean;
}

interface ClientContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface ClientTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface ClientFinancialSummary {
  totalProjects: number;
  totalInvoices: number;
  totalAmountInvoiced: number;
  totalAmountPaid: number;
  outstandingAmount: number;
  overdueAmount: number;
  creditLimit?: number;
  averagePaymentDelay: number;
  lastPaymentDate?: string;
}

interface ClientNote {
  id: string;
  content: string;
  type: 'general' | 'warning' | 'legal' | 'payment';
  isInternal: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

interface Client {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  businessName?: string;
  companyType: CompanyType;
  primaryContact: ClientContact;
  additionalContacts: ClientContact[];
  preferredContactMethod: ContactMethod;
  addresses: ClientAddress[];
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  status: ClientStatus;
  riskLevel: RiskLevel;
  tags: ClientTag[];
  financialSummary: ClientFinancialSummary;
  notes: ClientNote[];
  internalComments?: string;
  lastActivity?: string;
  createdBy: string;
  assignedManager?: string;
}

interface ClientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ClientStatus;
  riskLevel?: RiskLevel;
  companyType?: CompanyType;
  hasOutstanding?: boolean;
  region?: string;
  assignedManager?: string;
  createdAfter?: string;
  createdBefore?: string;
  lastActivityAfter?: string;
  lastActivityBefore?: string;
  tags?: string[];
  sortBy?: 'name' | 'createdAt' | 'lastActivity' | 'outstandingAmount';
  sortOrder?: 'asc' | 'desc';
}

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<ClientsQueryParams>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  // Using shared client data from centralized data file
  const allClients = getAllClients();

  // Apply real-time filtering
  const filteredClients = allClients.filter(client => {
    if (!client) return false;
    
    // Search filter
    if (queryParams.search) {
      const searchTerm = queryParams.search.toLowerCase();
      const searchableFields = [
        client.name,
        client.businessName,
        client.primaryContact?.name,
        client.primaryContact?.email,
        client.primaryContact?.phone,
        client.addresses?.[0]?.city,
        client.addresses?.[0]?.state,
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchableFields.includes(searchTerm)) {
        return false;
      }
    }
    
    // Status filter
    if (queryParams.status && client.status !== queryParams.status) {
      return false;
    }
    
    // Risk level filter
    if (queryParams.riskLevel && client.riskLevel !== queryParams.riskLevel) {
      return false;
    }
    
    // Company type filter
    if (queryParams.companyType && client.companyType !== queryParams.companyType) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!queryParams.sortBy) return 0;
    
    let aValue: any;
    let bValue: any;
    
    switch (queryParams.sortBy) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'riskLevel':
        const riskOrder = { low: 1, medium: 2, high: 3 };
        aValue = riskOrder[a.riskLevel] || 0;
        bValue = riskOrder[b.riskLevel] || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return queryParams.sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return queryParams.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Apply pagination
  const startIndex = (queryParams.page - 1) * queryParams.limit;
  const endIndex = startIndex + queryParams.limit;
  const paginatedClients = sortedClients.slice(startIndex, endIndex);
  
  const data = {
    data: paginatedClients,
    pagination: { 
      current: queryParams.page, 
      pageSize: queryParams.limit, 
      total: filteredClients.length,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 50]
    }
  };
  const isLoading = false;
  const error = null;
  const isDeleting = false;

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams(prev => ({ ...prev, page, limit: pageSize }));
  };

  const handleSearch = (searchText: string) => {
    setQueryParams(prev => ({ ...prev, search: searchText, page: 1 }));
  };

  const handleFilterChange = (filters: any) => {
    setQueryParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handleSortChange = (sort: { field: string; order: 'asc' | 'desc' } | null) => {
    if (sort) {
      setQueryParams(prev => ({ ...prev, sortBy: sort.field, sortOrder: sort.order }));
    } else {
      setQueryParams(prev => ({ ...prev, sortBy: undefined, sortOrder: undefined }));
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteClient) return;
    
    // Simulate API call - will be replaced with actual API when backend is ready
    console.log('Would delete client:', deleteClient.id);
    setDeleteClient(null);
    setSelectedClients(prev => prev.filter(id => id !== deleteClient.id));
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) return;
    
    // Simulate API call - will be replaced with actual API when backend is ready
    console.log('Would delete clients:', selectedClients);
    setSelectedClients([]);
  };

  const handleArchiveClient = (client: Client) => {
    // Simulate API call - will be replaced with actual API when backend is ready
    console.log('Would archive client:', client.id);
  };

  const handleExportClients = () => {
    // Simulate export functionality
    console.log('Would export clients with current filters:', queryParams);
  };

  const getStatusBadge = (status: ClientStatus) => {
    const statusConfig = {
      active: {
        color: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300',
        label: 'Active',
        icon: <CheckCircleIcon className="w-3 h-3 mr-1" />
      },
      archived: {
        color: 'bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 border border-gray-300',
        label: 'Archived',
        icon: <ClockIcon className="w-3 h-3 mr-1" />
      },
      blacklisted: {
        color: 'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-300',
        label: 'Blacklisted',
        icon: <XCircleIcon className="w-3 h-3 mr-1" />
      },
    };
    
    const config = statusConfig[status] || {
      color: 'bg-gray-100 text-gray-800 border border-gray-300',
      label: 'Unknown',
      icon: <ClockIcon className="w-3 h-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getRiskBadge = (riskLevel: RiskLevel) => {
    const riskConfig = {
      low: {
        color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        label: 'Low Risk',
        icon: <ShieldCheckIcon className="w-3 h-3 mr-1" />
      },
      medium: {
        color: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white',
        label: 'Medium Risk',
        icon: <ExclamationCircleIcon className="w-3 h-3 mr-1" />
      },
      high: {
        color: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
        label: 'High Risk',
        icon: <ShieldExclamationIcon className="w-3 h-3 mr-1" />
      },
    };
    
    const config = riskConfig[riskLevel] || {
      color: 'bg-gray-500 text-white',
      label: 'Unknown Risk',
      icon: <ExclamationCircleIcon className="w-3 h-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold shadow-sm ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getCompanyTypeBadge = (companyType: CompanyType) => {
    const typeConfig = {
      individual: { color: 'bg-blue-100 text-blue-800', label: 'Individual' },
      company: { color: 'bg-purple-100 text-purple-800', label: 'Company' },
      government: { color: 'bg-gray-100 text-gray-800', label: 'Government' },
    };
    
    const config = typeConfig[companyType] || {
      color: 'bg-gray-100 text-gray-800',
      label: 'Unknown'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      title: 'Company Name',
      dataIndex: 'name',
      sortable: true,
      render: (value: any, client: Client) => (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <BuildingOfficeSolid className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate(`/clients/${client?.id}`)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 truncate cursor-pointer transition-colors"
              >
                {client?.name || 'Unknown Client'}
              </button>
              {getCompanyTypeBadge(client?.companyType)}
            </div>
            <p className="text-sm text-gray-600 truncate">{client?.businessName || client?.name || 'No business name'}</p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-xs text-gray-500">
                <UserGroupIcon className="h-3 w-3 mr-1" />
                {client?.primaryContact?.name || 'No contact'}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <MapPinIcon className="h-3 w-3 mr-1" />
                {client?.addresses?.[0]?.city || 'No city'}, {client?.addresses?.[0]?.state || 'No state'}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status / Tags',
      dataIndex: 'status',
      sortable: true,
      render: (value: any, client: Client) => (
        <div className="space-y-2">
          {getStatusBadge(client?.status)}
          <div className="flex flex-wrap gap-1 mt-2">
            {client.tags?.slice(0, 2).map((tag) => (
              <span key={tag?.id || Math.random()} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tag?.color || 'bg-gray-100 text-gray-800'}`}>
                <TagIcon className="w-2 h-2 mr-1" />
                {tag?.name || 'Unknown'}
              </span>
            )) || []}
            {(client.tags?.length || 0) > 2 && (
              <span className="text-xs text-gray-500">+{(client.tags?.length || 0) - 2} more</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'riskLevel',
      title: 'Risk',
      dataIndex: 'riskLevel',
      sortable: true,
      render: (value: any, client: Client) => (
        <div className="flex justify-center">
          {getRiskBadge(client?.riskLevel)}
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Details',
      dataIndex: 'primaryContact',
      render: (value: any, client: Client) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">{client.primaryContact?.email || 'No email'}</div>
              <div className="text-xs text-gray-500">{client.primaryContact?.designation || 'No designation'}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-700">{client.primaryContact?.phone || 'No phone'}</div>
              <div className="text-xs text-gray-500">Preferred: {client.preferredContactMethod || 'Not specified'}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'financial',
      title: 'Finance',
      dataIndex: 'financialSummary',
      sortable: true,
      render: (value: any, client: Client) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CurrencyDollarSolid className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                ₹{(client?.financialSummary?.totalAmountInvoiced || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Invoiced</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChartBarSolid className="h-4 w-4 text-blue-600" />
            <div>
              <div className={`text-sm font-medium ${
                (client?.financialSummary?.outstandingAmount || 0) > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ₹{(client?.financialSummary?.outstandingAmount || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Outstanding {(client?.financialSummary?.overdueAmount || 0) > 0 && `(₹${(client?.financialSummary?.overdueAmount || 0).toLocaleString()} overdue)`}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'projects',
      title: 'Projects',
      dataIndex: 'projects',
      sortable: true,
      render: (value: any, client: Client) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-4 w-4 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">{client?.financialSummary?.totalProjects || 0}</div>
              <div className="text-xs text-gray-500">Total Projects</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-4 w-4 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-gray-700">
                {client?.lastActivity ? new Date(client.lastActivity).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Last Activity</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: EyeIcon,
      onClick: (client: Client) => navigate(`/clients/${client?.id}`),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: PencilIcon,
      onClick: (client: Client) => navigate(`/clients/${client?.id}/edit`),
    },
    {
      key: 'archive',
      label: (client: Client) => client?.status === 'active' ? 'Archive' : 'Activate',
      icon: ClockIcon,
      onClick: handleArchiveClient,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: TrashIcon,
      onClick: (client: Client) => setDeleteClient(client),
      variant: 'danger' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Archive Selected',
      onClick: () => console.log('Archive selected:', selectedClients),
    },
    {
      label: 'Delete Selected',
      onClick: handleBulkDelete,
      variant: 'danger' as const,
    },
  ];

  if (isLoading) {
    return <LoadingState message="Loading clients..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load clients</p>
      </div>
    );
  }

  // Calculate statistics from filtered data
  const totalClients = filteredClients.length;
  const activeClients = filteredClients.filter(c => c.status === 'active').length;
  const totalOutstanding = filteredClients.reduce((sum, c) => sum + (c.financialSummary?.outstandingAmount || 0), 0) || 0;
  const totalOverdue = filteredClients.reduce((sum, c) => sum + (c.financialSummary?.overdueAmount || 0), 0) || 0;
  const highRiskClients = filteredClients.filter(c => c.riskLevel === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header with Title and Buttons in Desktop View */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <UserGroupSolid className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Client Management</h1>
                  <p className="text-xl text-blue-100 max-w-2xl">
                    Manage your client relationships, track financial status, and monitor project activities
                  </p>
                </div>
              </div>
              
              {/* Action Buttons - Inline with title in desktop */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold rounded-xl text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Advanced Filters
                </button>
                <button
                  onClick={handleExportClients}
                  className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold rounded-xl text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => navigate('/clients/new')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-sm font-semibold rounded-xl text-white hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add New Client
                </button>
              </div>
            </div>
            
            {/* Stats Cards - Below header and buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <UserGroupSolid className="h-6 w-6 text-blue-300" />
                  <div>
                    <p className="text-2xl font-bold text-white">{totalClients}</p>
                    <p className="text-sm text-blue-200">Total Clients</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-300" />
                  <div>
                    <p className="text-2xl font-bold text-white">{activeClients}</p>
                    <p className="text-sm text-blue-200">Active Clients</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <CurrencyDollarSolid className="h-6 w-6 text-yellow-300" />
                  <div>
                    <p className="text-2xl font-bold text-white">₹{(totalOutstanding / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-blue-200">Outstanding</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-300" />
                  <div>
                    <p className="text-2xl font-bold text-white">₹{(totalOverdue / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-blue-200">Overdue</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <ShieldExclamationIcon className="h-6 w-6 text-orange-300" />
                  <div>
                    <p className="text-2xl font-bold text-white">{highRiskClients}</p>
                    <p className="text-sm text-blue-200">High Risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <FunnelIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Advanced Client Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Search Clients</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, phone..."
                      value={queryParams.search || ''}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Client Status</label>
                  <select
                    value={queryParams.status || ''}
                    onChange={(e) => handleFilterChange({ status: e.target.value as ClientStatus || undefined })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">✅ Active</option>
                    <option value="archived">📁 Archived</option>
                    <option value="blacklisted">🚫 Blacklisted</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Risk Level</label>
                  <select
                    value={queryParams.riskLevel || ''}
                    onChange={(e) => handleFilterChange({ riskLevel: e.target.value as RiskLevel || undefined })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="low">🟢 Low Risk</option>
                    <option value="medium">🟡 Medium Risk</option>
                    <option value="high">🔴 High Risk</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Company Type</label>
                  <select
                    value={queryParams.companyType || ''}
                    onChange={(e) => handleFilterChange({ companyType: e.target.value as CompanyType || undefined })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Types</option>
                    <option value="individual">👤 Individual</option>
                    <option value="company">🏢 Company</option>
                    <option value="government">🏛️ Government</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredClients.length} of {allClients.length} clients
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setQueryParams({ page: 1, limit: 10 });
                      setShowFilters(false);
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Clients Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <UserGroupSolid className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Client Directory</h3>
                    <p className="text-sm text-gray-600">Comprehensive client management and relationship tracking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">{filteredClients.length} Filtered Clients</span>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <DataTable
              data={data?.data || []}
              columns={columns}
              loading={isLoading}
              pagination={data?.pagination || { current: 1, pageSize: 10, total: 0 }}
              onPaginationChange={handlePageChange}
              onSortChange={handleSortChange}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              rowActions={rowActions}
              bulkActions={bulkActions}
              rowKey="id"
              selectable={true}
              selectedRows={selectedClients}
              onSelectionChange={setSelectedClients}
              searchPlaceholder="Search clients by name, email, phone, or location..."
              rowClassName={(client: Client) => {
                const isPremium = client?.tags?.some(tag => tag?.name?.toLowerCase().includes('premium'));
                return isPremium ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-400' : 'bg-white';
              }}
              emptyState={
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6">
                    <UserGroupSolid className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Clients Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start building your client base by adding your first client. 
                    Track relationships, manage projects, and monitor financial activities.
                  </p>
                  <button
                    onClick={() => navigate('/clients/new')}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Your First Client
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteClient}
        onClose={() => setDeleteClient(null)}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete "${deleteClient?.name}"? This action cannot be undone and will remove all associated data, projects, invoices, and communication history.`}
        confirmText="Delete Client"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ClientsPage;