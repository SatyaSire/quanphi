import React, { useState, useMemo } from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, FileText, Send, Upload, Search, Filter, Plus, TrendingUp, AlertTriangle, Eye, X, Folder, Settings, Shield, Users } from 'lucide-react';
import { mockChangeRequests, requestTypes, priorityLevels } from '../data/changeRequestsData';

const ChangeRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'submit'>('list');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    type: '',
    priority: 'medium',
    category: '',
    
    // Project Details
    projectId: '',
    affectedModules: [] as string[],
    currentBehavior: '',
    expectedBehavior: '',
    
    // Business Impact
    businessJustification: '',
    impactLevel: 'medium',
    affectedUsers: '',
    riskAssessment: '',
    
    // Technical Details
    technicalRequirements: '',
    systemDependencies: '',
    dataRequirements: '',
    integrationNeeds: '',
    
    // Timeline & Budget
    estimatedBudget: '',
    budgetJustification: '',
    desiredStartDate: '',
    desiredEndDate: '',
    timeline: '',
    milestones: '',
    
    // Approval & Stakeholders
    requestedBy: '',
    department: '',
    approvalRequired: [] as string[],
    stakeholders: '',
    
    // Testing & Quality
    testingRequirements: '',
    acceptanceCriteria: '',
    rollbackPlan: '',
    
    // Additional Information
    alternativeSolutions: '',
    additionalNotes: '',
    attachments: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal state for viewing details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Filter options
  const statusOptions = ['pending', 'approved', 'rejected', 'in-progress'];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockChangeRequests.length;
    const pending = mockChangeRequests.filter(req => req.status === 'pending').length;
    const approved = mockChangeRequests.filter(req => req.status === 'approved').length;
    const rejected = mockChangeRequests.filter(req => req.status === 'rejected').length;
    const inProgress = mockChangeRequests.filter(req => req.status === 'in-progress').length;
    
    return { total, pending, approved, rejected, inProgress };
  }, []);
  
  // Filter requests
  const filteredRequests = useMemo(() => {
    return mockChangeRequests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || request.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [searchTerm, statusFilter, priorityFilter, typeFilter]);
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };
  
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      // Basic Information
      title: '',
      description: '',
      type: '',
      priority: 'medium',
      category: '',
      
      // Project Details
      projectId: '',
      affectedModules: [],
      currentBehavior: '',
      expectedBehavior: '',
      
      // Business Impact
      businessJustification: '',
      impactLevel: 'medium',
      affectedUsers: '',
      riskAssessment: '',
      
      // Technical Details
      technicalRequirements: '',
      systemDependencies: '',
      dataRequirements: '',
      integrationNeeds: '',
      
      // Timeline & Budget
      estimatedBudget: '',
      budgetJustification: '',
      desiredStartDate: '',
      desiredEndDate: '',
      timeline: '',
      milestones: '',
      
      // Approval & Stakeholders
      requestedBy: '',
      department: '',
      approvalRequired: [],
      stakeholders: '',
      
      // Testing & Quality
      testingRequirements: '',
      acceptanceCriteria: '',
      rollbackPlan: '',
      
      // Additional Information
      alternativeSolutions: '',
      additionalNotes: '',
      attachments: []
    });
    
    setIsSubmitting(false);
    alert('Change request submitted successfully!');
  };
  
  // Handle view details
  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <>
      {/* Main Header - Full Width Outside Grey Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-700 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-xl">
                <ClipboardList className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Change Requests
                </h1>
                <p className="text-white/90 text-lg font-medium">
                  Submit and track project modification requests
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">Approved</p>
                <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">Rejected</p>
                <p className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 group-hover:scale-110 transition-all duration-300">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        </div>

        {/* Dedicated Search and Filter Section */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Requests</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Bar */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Requests
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or requester..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="all">All Priorities</option>
                  {priorityLevels.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="all">All Types</option>
                  {requestTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="lg:col-span-3 flex items-end justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      // Apply filters logic (filters are applied automatically via useMemo)
                      console.log('Filters applied:', { searchTerm, statusFilter, priorityFilter, typeFilter });
                    }}
                    className="px-6 py-3 bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200 font-medium rounded-lg shadow-md hover:shadow-lg"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                      setTypeFilter('all');
                    }}
                    className="px-6 py-3 bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 font-medium rounded-lg shadow-md hover:shadow-lg"
                  >
                    Clear Filters
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {filteredRequests.length} of {mockChangeRequests.length} requests
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'list'
                      ? 'bg-white text-orange-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  Request History
                </button>
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'submit'
                      ? 'bg-white text-orange-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  Submit New Request
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'list' ? (
              <div className="space-y-6">
                {/* Request List */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* List Header */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-orange-800">Change Requests</h3>
                      <div className="text-sm text-orange-600 font-medium">
                        {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
                      </div>
                    </div>
                  </div>
                  
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <ClipboardList className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No requests found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                          ? 'Try adjusting your search criteria or filters to find what you\'re looking for'
                          : 'No change requests have been submitted yet. Create your first request to get started'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 space-y-6">
                      {filteredRequests.map((request) => {
                        const getStatusColor = (status: string) => {
                          switch (status) {
                            case 'pending':
                              return 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 shadow-amber-200';
                            case 'approved':
                              return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 shadow-emerald-200';
                            case 'rejected':
                              return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-red-200';
                            case 'in-progress':
                              return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 shadow-blue-200';
                            default:
                              return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-gray-200';
                          }
                        };
                        
                        const getPriorityColor = (priority: string) => {
                          switch (priority) {
                            case 'high':
                              return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-red-300';
                            case 'medium':
                              return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-600 shadow-yellow-300';
                            case 'low':
                              return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-green-300';
                            default:
                              return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600 shadow-gray-300';
                          }
                        };
                        
                        return (
                          <div key={request.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl hover:border-orange-300 hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {/* Title and Badges */}
                                <div className="flex items-center space-x-3 mb-4">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    {request.title}
                                  </h3>
                                  <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 shadow-lg ${getPriorityColor(request.priority)}`}>
                                    {request.priority.toUpperCase()} PRIORITY
                                  </span>
                                  <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 shadow-lg ${getStatusColor(request.status)}`}>
                                    {request.status.toUpperCase()}
                                  </span>
                                </div>
                                
                                {/* Description */}
                                <p className="text-gray-700 mb-4 leading-relaxed text-base">{request.description}</p>
                                
                                {/* Request Information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center space-x-3 text-gray-600 bg-blue-50 p-3 rounded-lg">
                                    <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                                      <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-900">Requester:</span>
                                      <span className="ml-1 text-blue-700 font-medium">{request.requestedBy}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 text-gray-600 bg-green-50 p-3 rounded-lg">
                                    <div className="p-2 bg-green-500 rounded-lg shadow-md">
                                      <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-900">Created:</span>
                                      <span className="ml-1 text-green-700 font-medium">{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 text-gray-600 bg-purple-50 p-3 rounded-lg">
                                    <div className="p-2 bg-purple-500 rounded-lg shadow-md">
                                      <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-900">Type:</span>
                                      <span className="ml-1 text-purple-700 font-medium">{request.type}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Estimated Cost */}
                                {request.estimatedCost && (
                                  <div className="mt-4 pt-4 border-t-2 border-gray-200">
                                    <div className="flex items-center space-x-3 bg-emerald-50 p-3 rounded-lg">
                                      <div className="p-2 bg-emerald-500 rounded-lg shadow-md">
                                        <span className="text-white font-bold text-sm">$</span>
                                      </div>
                                      <span className="text-sm font-semibold text-gray-900">
                                        Estimated Cost: <span className="text-emerald-600 font-bold text-lg">${request.estimatedCost.toLocaleString()}</span>
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Action Button and Status */}
                              <div className="ml-6 flex flex-col items-end space-y-3">
                                <button 
                                  onClick={() => handleViewDetails(request)}
                                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold rounded-xl shadow-lg hover:shadow-xl group-hover:scale-110 transform"
                                >
                                  View Details
                                </button>
                                {request.status === 'pending' && (
                                  <div className="flex items-center space-x-2 bg-amber-100 px-3 py-2 rounded-full">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    <span className="text-xs text-amber-700 font-semibold">Awaiting Review</span>
                                  </div>
                                )}
                                {request.status === 'approved' && (
                                  <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-2 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    <span className="text-xs text-emerald-700 font-semibold">Approved</span>
                                  </div>
                                )}
                                {request.status === 'rejected' && (
                                  <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-full">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-xs text-red-700 font-semibold">Rejected</span>
                                  </div>
                                )}
                                {request.status === 'in-progress' && (
                                  <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs text-blue-700 font-semibold">Under Review</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-orange-500 mr-2" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2 lg:col-span-3">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Request Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Brief description of your change request"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                        Request Type *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select a type</option>
                        {requestTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="ui-ux">UI/UX Enhancement</option>
                        <option value="functionality">New Functionality</option>
                        <option value="performance">Performance Improvement</option>
                        <option value="security">Security Enhancement</option>
                        <option value="integration">System Integration</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="compliance">Compliance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level *
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {priorityLevels.map(priority => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Provide a detailed description of the changes you're requesting..."
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Folder className="h-5 w-5 text-blue-500 mr-2" />
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                        Related Project ID
                      </label>
                      <input
                        type="text"
                        id="projectId"
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., PRJ-2024-001"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="affectedModules" className="block text-sm font-medium text-gray-700 mb-2">
                        Affected Modules/Components
                      </label>
                      <input
                        type="text"
                        id="affectedModules"
                        name="affectedModules"
                        value={formData.affectedModules.join(', ')}
                        onChange={(e) => setFormData({...formData, affectedModules: e.target.value.split(', ').filter(m => m.trim())})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., User Management, Payment Gateway, Dashboard"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="currentBehavior" className="block text-sm font-medium text-gray-700 mb-2">
                        Current System Behavior
                      </label>
                      <textarea
                        id="currentBehavior"
                        name="currentBehavior"
                        value={formData.currentBehavior}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe how the system currently works..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700 mb-2">
                        Expected New Behavior *
                      </label>
                      <textarea
                        id="expectedBehavior"
                        name="expectedBehavior"
                        value={formData.expectedBehavior}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the desired outcome after implementation..."
                      />
                    </div>
                  </div>
                </div>

                {/* Business Impact Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    Business Impact & Justification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="businessJustification" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Justification *
                      </label>
                      <textarea
                        id="businessJustification"
                        name="businessJustification"
                        value={formData.businessJustification}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Explain the business value and reasons for this change..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="impactLevel" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Impact Level *
                      </label>
                      <select
                        id="impactLevel"
                        name="impactLevel"
                        value={formData.impactLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="low">Low - Minor improvement</option>
                        <option value="medium">Medium - Moderate impact</option>
                        <option value="high">High - Significant impact</option>
                        <option value="critical">Critical - Business critical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="affectedUsers" className="block text-sm font-medium text-gray-700 mb-2">
                        Affected Users/Departments
                      </label>
                      <input
                        type="text"
                        id="affectedUsers"
                        name="affectedUsers"
                        value={formData.affectedUsers}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., All users, Sales team, Admin users"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="riskAssessment" className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Assessment
                      </label>
                      <textarea
                        id="riskAssessment"
                        name="riskAssessment"
                        value={formData.riskAssessment}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Identify potential risks and mitigation strategies..."
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-5 w-5 text-purple-500 mr-2" />
                    Technical Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="technicalRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Requirements
                      </label>
                      <textarea
                        id="technicalRequirements"
                        name="technicalRequirements"
                        value={formData.technicalRequirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Specify technical requirements, technologies, frameworks..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="systemDependencies" className="block text-sm font-medium text-gray-700 mb-2">
                        System Dependencies
                      </label>
                      <textarea
                        id="systemDependencies"
                        name="systemDependencies"
                        value={formData.systemDependencies}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="List external systems, APIs, databases that will be affected..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dataRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                        Data Requirements
                      </label>
                      <textarea
                        id="dataRequirements"
                        name="dataRequirements"
                        value={formData.dataRequirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe data migration, new fields, database changes..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="integrationNeeds" className="block text-sm font-medium text-gray-700 mb-2">
                        Integration Needs
                      </label>
                      <textarea
                        id="integrationNeeds"
                        name="integrationNeeds"
                        value={formData.integrationNeeds}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Third-party integrations, API connections, webhooks..."
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline & Budget Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                    Timeline & Budget
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Budget
                      </label>
                      <input
                        type="number"
                        id="estimatedBudget"
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="desiredStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Desired Start Date
                      </label>
                      <input
                        type="date"
                        id="desiredStartDate"
                        name="desiredStartDate"
                        value={formData.desiredStartDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="desiredEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Desired End Date
                      </label>
                      <input
                        type="date"
                        id="desiredEndDate"
                        name="desiredEndDate"
                        value={formData.desiredEndDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                      <label htmlFor="budgetJustification" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Justification
                      </label>
                      <textarea
                        id="budgetJustification"
                        name="budgetJustification"
                        value={formData.budgetJustification}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Explain the budget requirements and cost breakdown..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Timeline
                      </label>
                      <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., 2 weeks, 1 month, 3 months"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="milestones" className="block text-sm font-medium text-gray-700 mb-2">
                        Key Milestones
                      </label>
                      <textarea
                        id="milestones"
                        name="milestones"
                        value={formData.milestones}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="List key milestones and deliverables..."
                      />
                    </div>
                  </div>
                </div>

                {/* Approval & Stakeholders Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-cyan-500 mr-2" />
                    Approval & Stakeholders
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-2">
                        Requested By *
                      </label>
                      <input
                        type="text"
                        id="requestedBy"
                        name="requestedBy"
                        value={formData.requestedBy}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your name or requester name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department/Team *
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select department</option>
                        <option value="it">IT Department</option>
                        <option value="sales">Sales</option>
                        <option value="marketing">Marketing</option>
                        <option value="finance">Finance</option>
                        <option value="hr">Human Resources</option>
                        <option value="operations">Operations</option>
                        <option value="customer-service">Customer Service</option>
                        <option value="management">Management</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="approvalRequired" className="block text-sm font-medium text-gray-700 mb-2">
                        Approval Required From
                      </label>
                      <input
                        type="text"
                        id="approvalRequired"
                        name="approvalRequired"
                        value={formData.approvalRequired.join(', ')}
                        onChange={(e) => setFormData({...formData, approvalRequired: e.target.value.split(', ').filter(a => a.trim())})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., IT Manager, Finance Director, CEO"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stakeholders" className="block text-sm font-medium text-gray-700 mb-2">
                        Key Stakeholders
                      </label>
                      <textarea
                        id="stakeholders"
                        name="stakeholders"
                        value={formData.stakeholders}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="List people who will be affected or involved in this change..."
                      />
                    </div>
                  </div>
                </div>

                {/* Testing & Quality Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                    Testing & Quality Assurance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="testingRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                        Testing Requirements
                      </label>
                      <textarea
                        id="testingRequirements"
                        name="testingRequirements"
                        value={formData.testingRequirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe testing scenarios, environments, and requirements..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-gray-700 mb-2">
                        Acceptance Criteria *
                      </label>
                      <textarea
                        id="acceptanceCriteria"
                        name="acceptanceCriteria"
                        value={formData.acceptanceCriteria}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Define clear criteria for when this change is considered complete..."
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="rollbackPlan" className="block text-sm font-medium text-gray-700 mb-2">
                        Rollback Plan
                      </label>
                      <textarea
                        id="rollbackPlan"
                        name="rollbackPlan"
                        value={formData.rollbackPlan}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the plan to revert changes if issues arise..."
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="h-5 w-5 text-gray-500 mr-2" />
                    Additional Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="alternativeSolutions" className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative Solutions Considered
                      </label>
                      <textarea
                        id="alternativeSolutions"
                        name="alternativeSolutions"
                        value={formData.alternativeSolutions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe other solutions you considered and why this approach was chosen..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Any additional information, constraints, or special considerations..."
                      />
                    </div>
                  </div>
                </div>
                
                {/* File Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 text-orange-500 mr-2" />
                    Attachments
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload files or drag and drop</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xlsx,.pptx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT, XLSX, PPTX (Max 10MB each)</p>
                  </div>
                  
                  {/* File List */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.type}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Request Header */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedRequest.title}</h3>
                    <p className="text-gray-600 mb-4">{selectedRequest.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{selectedRequest.requestedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{selectedRequest.dateSubmitted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedRequest.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      selectedRequest.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      selectedRequest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedRequest.priority === 'high' ? 'bg-red-100 text-red-800' :
                      selectedRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Request Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedRequest.estimatedBudget}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedRequest.timeline}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedRequest.status === 'pending' && 'Awaiting review by project manager'}
                      {selectedRequest.status === 'approved' && 'Approved and ready for implementation'}
                      {selectedRequest.status === 'rejected' && 'Request has been declined'}
                      {selectedRequest.status === 'in-progress' && 'Currently being implemented'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              {selectedRequest.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 font-medium rounded-lg shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ChangeRequestsPage;