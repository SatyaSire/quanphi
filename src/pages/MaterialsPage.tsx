import React, { useState, useMemo } from 'react';
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
  Package,
  Truck,
  Layers
} from 'lucide-react';
import {
  Material,
  MaterialFilters,
  MaterialSortOptions,
  MaterialCategory,
  PaymentMode,
  PaidBy
} from '../types/materials';
import DataTable from '../components/common/DataTable';
import {
  mockMaterials,
  getAllMaterials,
  materialCategories,
  mockMaterialStats,
  formatCurrency,
  getPaymentModeColor,
  getPaidByColor,
  getCategoryById
} from '../data/materialsData';
import { projects } from '../data/projectsData';

const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);

  // Load materials on component mount
  React.useEffect(() => {
    setMaterials(getAllMaterials());
  }, []);
  const [filters, setFilters] = useState<MaterialFilters>({});
  const [sortOptions, setSortOptions] = useState<MaterialSortOptions>({
    field: 'dateOfPurchase',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort materials
  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = materials.filter(material => !material.isDeleted);

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(material =>
        material.materialName.toLowerCase().includes(searchLower) ||
        material.vendorName?.toLowerCase().includes(searchLower) ||
        material.category.toLowerCase().includes(searchLower) ||
        material.notes?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(material => material.dateOfPurchase >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(material => material.dateOfPurchase <= filters.dateTo!);
    }

    if (filters.projectId) {
      filtered = filtered.filter(material => material.projectId === filters.projectId);
    }

    if (filters.category) {
      filtered = filtered.filter(material => material.category === filters.category);
    }

    if (filters.vendorName) {
      filtered = filtered.filter(material => 
        material.vendorName.toLowerCase().includes(filters.vendorName!.toLowerCase())
      );
    }

    if (filters.amountFrom) {
      filtered = filtered.filter(material => material.totalAmount >= filters.amountFrom!);
    }

    if (filters.amountTo) {
      filtered = filtered.filter(material => material.totalAmount <= filters.amountTo!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOptions.field) {
        case 'dateOfPurchase':
          aValue = new Date(a.dateOfPurchase);
          bValue = new Date(b.dateOfPurchase);
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'materialName':
          aValue = a.materialName;
          bValue = b.materialName;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'quantityPurchased':
          aValue = a.quantityPurchased;
          bValue = b.quantityPurchased;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [materials, filters, sortOptions]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMaterials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMaterials = filteredAndSortedMaterials.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: keyof MaterialFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: MaterialSortOptions['field']) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSelectMaterial = (materialId: string) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMaterials.length === paginatedMaterials.length) {
      setSelectedMaterials([]);
    } else {
      setSelectedMaterials(paginatedMaterials.map(material => material.id));
    }
  };

  const getCategoryColor = (category: MaterialCategory): string => {
    const categoryData = getCategoryById(category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Row actions for materials
  const materialRowActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (material: Material) => {
        // Navigate to material detail page
        window.location.href = `/materials/${material.id}`;
      }
    },
    {
      key: 'edit',
      label: 'Edit Material',
      icon: Edit,
      onClick: (material: Material) => {
        // Navigate to edit material page
        window.location.href = `/materials/${material.id}/edit`;
      }
    },
    {
      key: 'delete',
      label: 'Delete Material',
      icon: Trash2,
      onClick: (material: Material) => {
        // Handle delete material
        if (window.confirm('Are you sure you want to delete this material?')) {
          // In a real app, this would call an API to delete the material
          console.log('Delete material:', material.id);
          // For now, just reload the page to simulate deletion
          window.location.reload();
        }
      },
      variant: 'danger' as const
    }
  ];

  // Bulk actions for materials
  const materialBulkActions = [
    {
      key: 'export',
      label: 'Export Selected',
      icon: Download,
      onClick: (selectedMaterials: Material[]) => {
        console.log('Export materials:', selectedMaterials);
      }
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      onClick: (selectedMaterials: Material[]) => {
        console.log('Delete materials:', selectedMaterials);
      },
      variant: 'danger' as const
    }
  ];

  // Define columns for DataTable
  const materialColumns = [
    {
      key: 'dateOfPurchase',
      title: 'Date / Project',
      dataIndex: 'dateOfPurchase',
      sortable: true,
      render: (value: any, material: Material) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900">{formatDate(material.dateOfPurchase)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{material.projectId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'material',
      title: 'Material / Category',
      dataIndex: 'materialName',
      sortable: true,
      render: (value: any, material: Material) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-green-500" />
            <Link 
              to={`/materials/${material.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
            >
              {material.materialName}
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link 
              to={`/materials/${material.id}`}
              className={`text-xs px-2 py-1 rounded-full hover:opacity-80 cursor-pointer transition-opacity ${getCategoryColor(material.category)}`}
            >
              {material.category}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'quantity',
      title: 'Quantity / Rate',
      dataIndex: 'quantityPurchased',
      sortable: true,
      render: (value: any, material: Material) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-900">
              {material.quantityPurchased} {material.unit}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Rate: {formatCurrency(material.ratePerUnit)}/{material.unit}
          </div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      title: 'Amount / Payment',
      dataIndex: 'totalAmount',
      sortable: true,
      render: (value: any, material: Material) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-bold text-gray-900">{formatCurrency(material.totalAmount)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getPaymentModeColor(material.paymentMode)}`}>
              {material.paymentMode}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'vendor',
      title: 'Vendor / Paid By',
      dataIndex: 'vendorName',
      sortable: false,
      render: (value: any, material: Material) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-900">{material.vendorName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getPaidByColor(material.paidBy)}`}>
              {material.paidBy}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      title: 'Stock / Invoice',
      dataIndex: 'stockRemaining',
      sortable: false,
      render: (value: any, material: Material) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900">
              {material.stockRemaining || 0} {material.unit}
            </span>
            {material.stockRemaining && material.stockRemaining < 10 && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <div className="text-xs text-gray-600">
            {material.invoiceNumber ? (
              <span className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{material.invoiceNumber}</span>
              </span>
            ) : (
              <span className="text-gray-400">No invoice</span>
            )}
          </div>
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white">
                        Materials
                      </h1>
                      <p className="text-xl text-blue-100 mt-2">
                        Manage and track all construction materials
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
                    <Package className="h-5 w-5" />
                    <span>Material Management</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="group relative inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
                  <Download className="h-5 w-5 mr-2" />
                  Export Data
                </button>
                <Link
                  to="/materials/new"
                  className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  Add Material
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Today's Purchases</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(mockMaterialStats.todayTotal)}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">Today</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(mockMaterialStats.weekTotal)}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">7 days</span>
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
                <p className="text-purple-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(mockMaterialStats.monthTotal)}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <Package className="h-4 w-4 mr-1" />
                  <span className="text-sm">30 days</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Package className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Low Stock Items</p>
                <p className="text-3xl font-bold mt-2">{mockMaterialStats.lowStockItems}</p>
                <div className="flex items-center mt-2 text-red-100">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Needs attention</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <AlertTriangle className="h-8 w-8" />
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
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Materials</h3>
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
                placeholder="Search by material name, vendor, category, or notes..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
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
                  <label className="block text-sm font-semibold text-gray-700">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Project</label>
                  <select
                    value={filters.projectId || ''}
                    onChange={(e) => handleFilterChange('projectId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value as MaterialCategory)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {Object.values(MaterialCategory).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Vendor</label>
                  <input
                    type="text"
                    placeholder="Vendor name"
                    value={filters.vendorName || ''}
                    onChange={(e) => handleFilterChange('vendorName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Amount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Amount"
                      value={filters.amountFrom || ''}
                      onChange={(e) => handleFilterChange('amountFrom', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="number"
                      placeholder="Max Amount"
                      value={filters.amountTo || ''}
                      onChange={(e) => handleFilterChange('amountTo', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredAndSortedMaterials.length} of {materials.length} materials
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
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

        {/* Enhanced Materials Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Materials</h3>
                  <p className="text-sm text-gray-600">Comprehensive material management and tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">{filteredAndSortedMaterials.length} Filtered Materials</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        
          <DataTable
            data={paginatedMaterials}
            columns={materialColumns}
            loading={false}
            selectable={true}
            selectedRows={selectedMaterials}
            onSelectionChange={setSelectedMaterials}
            rowActions={materialRowActions}
            bulkActions={materialBulkActions}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: itemsPerPage,
              total: filteredAndSortedMaterials.length,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50]
            }}
            onPaginationChange={(page, pageSize) => {
              setCurrentPage(page);
              if (pageSize !== itemsPerPage) {
                setItemsPerPage(pageSize);
                setCurrentPage(1);
              }
            }}
            onSortChange={(newSortInfo) => {
              setSortOptions({
                field: newSortInfo.field as MaterialSortOptions['field'],
                direction: newSortInfo.order as 'asc' | 'desc'
              });
              setCurrentPage(1);
            }}
            rowClassName={(material) => `hover:bg-gray-50 transition-colors ${
              material.totalAmount > 50000 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' : 'bg-white'
            }`}
            emptyState={
              <div className="flex flex-col items-center py-12">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  Get started by adding your first material purchase to track inventory and expenses.
                </p>
                <Link
                  to="/materials/new"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Material
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;