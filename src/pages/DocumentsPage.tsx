import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Users,
  Building,
  DollarSign,
  FileCheck
} from 'lucide-react';
import { Document, DocumentFilter } from '../types/documents';
import { ViewMode } from '../types/workers';
import { documentsData, documentCategories, getDocumentsByCategory, getDocumentsByStatus } from '../data/documentsData';
import DataTable from '../components/common/DataTable';

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents] = useState<Document[]>(documentsData);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<DocumentFilter>({
    search: '',
    category: '',
    fileType: '',
    status: undefined,
    uploadedBy: ''
  });

  // Real-time stats calculation
  const realTimeStats = useMemo(() => {
    const totalDocuments = documents.length;
    const workerDocuments = getDocumentsByCategory('Worker Documents').length;
    const projectDocuments = getDocumentsByCategory('Project Documents').length;
    const financialDocuments = getDocumentsByCategory('Financial Documents').length;
    const companyDocuments = getDocumentsByCategory('Company/Legal Documents').length;
    
    // Calculate expiring documents (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringDocuments = documents.filter(doc => {
      if (!doc.expiryDate) return false;
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
    }).length;
    
    return {
      totalDocuments,
      workerDocuments,
      projectDocuments,
      financialDocuments,
      companyDocuments,
      expiringDocuments
    };
  }, [documents]);

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    return documents.filter(document => {
      const searchTerm = filters.search?.toLowerCase() || '';
      
      const matchesSearch = !searchTerm || 
        document.name.toLowerCase().includes(searchTerm) ||
        document.category.name.toLowerCase().includes(searchTerm) ||
        document.fileType.toLowerCase().includes(searchTerm) ||
        document.uploadedBy.name.toLowerCase().includes(searchTerm) ||
        document.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      const matchesCategory = !filters.category || document.category.id === filters.category;
      const matchesType = !filters.fileType || document.fileType.toLowerCase().includes(filters.fileType.toLowerCase());
      const matchesStatus = !filters.status || document.status === filters.status;
      const matchesUploadedBy = !filters.uploadedBy || document.uploadedBy.name.toLowerCase().includes(filters.uploadedBy.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesUploadedBy;
    });
  }, [documents, filters]);

  // DataTable columns configuration
  const columns = [
    {
      key: 'name',
      title: 'Document',
      dataIndex: 'name',
      sortable: true,
      render: (value: any, record: Document) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <Link
              to={`/documents/${record.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {record.name}
            </Link>
            <div className="text-sm text-gray-500">{record.fileType}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      sortable: true,
      render: (value: any, record: Document) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {record.category.name}
        </span>
      ),
    },
    {
      key: 'uploadedBy',
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      render: (value: any, record: Document) => (
        <div className="text-sm text-gray-900">
          {record.uploadedBy?.name || 'Unknown'}
        </div>
      ),
    },
    {
      key: 'uploadDate',
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      sortable: true,
      render: (value: any, record: Document) => (
        <div className="text-sm text-gray-900">
          {new Date(record.uploadDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value: any, record: Document) => (
        <div className="flex items-center">
          {record.status === 'active' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </span>
          ) : record.status === 'expired' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Expired
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Expiring Soon
            </span>
          )}
        </div>
      ),
    },
  ];

  // Bulk actions
  const bulkActions = [
    {
      key: 'download',
      label: 'Download Selected',
      icon: Download,
      onClick: (selectedRecords: Document[]) => {
        // Simulate bulk download by downloading each file
        selectedRecords.forEach((doc, index) => {
          setTimeout(() => {
            const link = document.createElement('a');
            link.href = doc.fileUrl || '#';
            link.download = doc.name;
            link.click();
          }, index * 500); // Stagger downloads to avoid browser blocking
        });
      },
      variant: 'default' as const,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      onClick: (selectedRecords: Document[]) => {
        const count = selectedRecords.length;
        if (window.confirm(`Are you sure you want to delete ${count} selected document${count > 1 ? 's' : ''}?`)) {
          console.log('Deleting documents:', selectedRecords.map(d => d.id));
          // Handle bulk delete - in a real app, this would call an API
        }
      },
      variant: 'danger' as const,
    },
  ];

  // Row actions
  const rowActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (record: Document) => {
        navigate(`/documents/${record.id}`);
      },
      variant: 'default' as const,
    },
    {
      key: 'edit',
      label: 'Edit Document',
      icon: Edit,
      onClick: (record: Document) => {
        navigate(`/documents/${record.id}/edit`);
      },
      variant: 'default' as const,
    },
    {
      key: 'download',
      label: 'Download',
      icon: Download,
      onClick: (record: Document) => {
        // Simulate file download
        const link = document.createElement('a');
        link.href = record.fileUrl || '#';
        link.download = record.name;
        link.click();
      },
      variant: 'default' as const,
    },
    {
      key: 'delete',
      label: 'Delete Document',
      icon: Trash2,
      onClick: (record: Document) => {
        if (window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
          console.log('Deleting document:', record.id);
          // Handle delete - in a real app, this would call an API
        }
      },
      variant: 'danger' as const,
    },
  ];

  const handleFilterChange = (key: keyof DocumentFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      fileType: '',
      status: undefined,
      uploadedBy: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DocumentCard: React.FC<{ document: Document }> = ({ document }) => {
    const [showActions, setShowActions] = useState(false);
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

    const handleDeleteDocument = () => {
      if (window.confirm(`Are you sure you want to delete ${document.name}?`)) {
        console.log(`Deleting document ${document.id}`);
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
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  document.status === 'active' ? 'bg-green-500' : 
                  document.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              </div>
              <div className="flex-1">
                <div className="h-20 flex flex-col justify-between">
                  <Link
                    to={`/documents/${document.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-tight"
                    title={document.name}
                  >
                    {document.name}
                  </Link>
                  <p className="text-sm text-gray-600">{document.fileType}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      document.status === 'active' ? 'bg-green-400' : 
                      document.status === 'expired' ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                    {document.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{document.category.name}</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Uploaded by {document.uploadedBy?.name || 'Unknown'} on {new Date(document.uploadDate).toLocaleDateString()}
                  </span>
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
                <div ref={dropdownRef} className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[140px]">
                  <Link
                    to={`/documents/${document.id}`}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                  <Link
                    to={`/documents/${document.id}/edit`}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowActions(false)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Document
                  </Link>
                  <button 
                    onClick={() => {
                // Simulate file download
                const link = document.createElement('a');
                link.href = document.fileUrl || '#';
                link.download = document.name;
                link.click();
                setShowActions(false);
              }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button 
                    onClick={handleDeleteDocument}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-6">
          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {document.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {document.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{document.tags.length - 3} more</span>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Link
              to={`/documents/${document.id}`}
              className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </Link>
            <button
              onClick={() => {
                // Simulate file download
                const link = document.createElement('a');
                link.href = document.fileUrl || '#';
                link.download = document.name;
                link.click();
                console.log('Downloading document:', document.name);
              }}
              className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Documents
                    </h1>
                    <p className="text-lg text-blue-100 mt-1">
                      Manage and organize all your important documents
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Document Management</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => console.log('Exporting data...')}
                  className="group relative inline-flex items-center px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <Link
                  to="/documents/upload"
                  className="group relative inline-flex items-center px-6 py-3 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Upload Document
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
                <p className="text-blue-100 text-sm font-medium">Total Documents</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.totalDocuments}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="text-sm">All Documents</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Worker Documents</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.workerDocuments}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Employee Files</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Project Documents</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.projectDocuments}</p>
                <div className="flex items-center mt-2 text-orange-100">
                  <Building className="h-4 w-4 mr-1" />
                  <span className="text-sm">Project Files</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Building className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Expiring Soon</p>
                <p className="text-3xl font-bold mt-2">{realTimeStats.expiringDocuments}</p>
                <div className="flex items-center mt-2 text-teal-100">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Need Attention</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <AlertCircle className="h-8 w-8" />
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
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Documents</h3>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg"
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
                placeholder="Search by document name, category, type, or tags..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* View Toggle Buttons - Bottom Right */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors border text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-md border-gray-300' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-200'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors border text-sm ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-md border-gray-300' 
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {documentCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Type</label>
                  <select
                     value={filters.fileType || ''}
                     onChange={(e) => handleFilterChange('fileType', e.target.value)}
                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   >
                     <option value="">All Types</option>
                     <option value="PDF">PDF</option>
                     <option value="Image">Image</option>
                     <option value="Document">Document</option>
                     <option value="Spreadsheet">Spreadsheet</option>
                   </select>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-gray-700">Status</label>
                   <select
                     value={filters.status || ''}
                     onChange={(e) => handleFilterChange('status', e.target.value)}
                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   >
                     <option value="">All Status</option>
                     <option value="active">Active</option>
                     <option value="expired">Expired</option>
                     <option value="expiring_soon">Expiring Soon</option>
                   </select>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-gray-700">Uploaded By</label>
                   <input
                     type="text"
                     placeholder="Filter by uploader..."
                     value={filters.uploadedBy || ''}
                     onChange={(e) => handleFilterChange('uploadedBy', e.target.value)}
                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   />
                 </div>
               </div>
               
               <div className="flex justify-end mt-6">
                 <button
                   onClick={clearFilters}
                   className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 text-sm font-medium"
                 >
                   Clear All
                 </button>
               </div>
             </div>
           )}
        </div>

        {/* Enhanced Documents List/Grid */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Enhanced Table Header */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Documents Library
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {filteredDocuments.length} of {documents.length} documents
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filters.search || Object.values(filters).some(f => f) 
                    ? "Try adjusting your search or filter criteria to find documents."
                    : "Get started by uploading your first document to the system."
                  }
                </p>
                <Link
                  to="/documents/upload"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Upload {documents.length === 0 ? 'First' : 'New'} Document</span>
                </Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            ) : (
              <DataTable
                data={filteredDocuments}
                columns={columns}
                bulkActions={bulkActions}
                rowActions={rowActions}
                onSearch={(searchText) => {
                  setFilters(prev => ({ ...prev, search: searchText }));
                }}
                searchPlaceholder="Search documents..."
                selectable={true}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredDocuments.length,
                  showSizeChanger: true,
                  pageSizeOptions: [10, 20, 50, 100]
                }}
                onPaginationChange={(page, pageSize) => {
                  setCurrentPage(page);
                  if (pageSize) setItemsPerPage(pageSize);
                }}
                loading={false}
                onSelectionChange={setSelectedDocuments}
                selectedRows={selectedDocuments}
                emptyText="No documents found"
                rowKey={(record) => record.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;