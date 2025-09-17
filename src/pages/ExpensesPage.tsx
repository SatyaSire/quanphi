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
  ChevronDown
} from 'lucide-react';
import {
  Expense,
  ExpenseFilters,
  ExpenseSortOptions,
  PaymentMode,
  PaidBy
} from '../types/expenses';
import DataTable from '../components/common/DataTable';
import {
  mockExpenses,
  expenseCategories,
  mockExpenseStats,
  formatCurrency,
  getPaymentModeColor
} from '../data/expensesData';
import { projects } from '../data/projectsData';

const ExpensesPage: React.FC = () => {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [sortOptions, setSortOptions] = useState<ExpenseSortOptions>({
    field: 'date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => !expense.isDeleted);

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchLower) ||
        expense.vendorName?.toLowerCase().includes(searchLower) ||
        expense.projectName.toLowerCase().includes(searchLower) ||
        expense.categoryName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(expense => expense.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(expense => expense.date <= filters.dateTo!);
    }

    if (filters.projectId) {
      filtered = filtered.filter(expense => expense.projectId === filters.projectId);
    }

    if (filters.categoryId) {
      filtered = filtered.filter(expense => expense.categoryId === filters.categoryId);
    }

    if (filters.paidBy) {
      filtered = filtered.filter(expense => expense.paidBy === filters.paidBy);
    }

    if (filters.amountFrom) {
      filtered = filtered.filter(expense => expense.amount >= filters.amountFrom!);
    }

    if (filters.amountTo) {
      filtered = filtered.filter(expense => expense.amount <= filters.amountTo!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOptions.field) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'projectName':
          aValue = a.projectName;
          bValue = b.projectName;
          break;
        case 'categoryName':
          aValue = a.categoryName;
          bValue = b.categoryName;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [expenses, filters, sortOptions]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredAndSortedExpenses.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: keyof ExpenseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: ExpenseSortOptions['field']) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses(prev =>
      prev.includes(expenseId)
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === paginatedExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(paginatedExpenses.map(expense => expense.id));
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category?.color || '#6B7280';
  };

  const getPaymentModeColor = (paymentMode: string) => {
    switch (paymentMode?.toLowerCase()) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'credit card':
        return 'bg-blue-100 text-blue-800';
      case 'debit card':
        return 'bg-purple-100 text-purple-800';
      case 'bank transfer':
        return 'bg-indigo-100 text-indigo-800';
      case 'upi':
        return 'bg-orange-100 text-orange-800';
      case 'cheque':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };



  // Define columns for DataTable
  const expenseColumns = [
    {
      key: 'date',
      title: 'Date / Project',
      dataIndex: 'date',
      sortable: true,
      render: (value: any, expense: Expense) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900">{formatDate(expense.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{expense.projectName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category / Description',
      dataIndex: 'categoryName',
      sortable: true,
      render: (value: any, expense: Expense) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
            ></div>
            <span className="text-sm font-semibold text-gray-900">{expense.categoryName}</span>
          </div>
          <div className="text-xs text-gray-600 line-clamp-2 pl-5">{expense.description}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount / Payment',
      dataIndex: 'amount',
      sortable: true,
      render: (value: any, expense: Expense) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className={`text-sm font-bold ${
              expense.amount > 50000 ? 'text-red-600' : 
              expense.amount > 20000 ? 'text-orange-600' : 'text-green-600'
            }`}>{formatCurrency(expense.amount)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              getPaymentModeColor(expense.paymentMode)
            }`}>
              {expense.paymentMode}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'paidBy',
      title: 'Paid By / Vendor',
      dataIndex: 'paidBy',
      sortable: true,
      render: (value: any, expense: Expense) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-900">{expense.paidBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            {expense.vendorName ? (
              <>
                <Building className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full">{expense.vendorName}</span>
              </>
            ) : (
              <span className="text-xs text-gray-400 italic">No vendor specified</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'attachments',
      title: 'Attachments / Status',
      dataIndex: 'attachments',
      render: (value: any, expense: Expense) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {expense.attachments.length > 0 ? (
              <>
                <FileText className="h-4 w-4 text-green-500" />
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {expense.attachments.length} file{expense.attachments.length > 1 ? 's' : ''}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                  No receipt
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              expense.attachments.length > 0 ? 'bg-green-400' : 'bg-orange-400'
            }`}></div>
            <span className="text-xs text-gray-500">
              {expense.attachments.length > 0 ? 'Documented' : 'Pending receipt'}
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Define row actions
  const expenseRowActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (expense: Expense) => window.location.href = `/expenses/${expense.id}`,
      className: 'text-blue-600 hover:text-blue-900',
    },
    {
      key: 'edit',
      label: 'Edit Expense',
      icon: Edit,
      onClick: (expense: Expense) => window.location.href = `/expenses/${expense.id}/edit`,
      className: 'text-green-600 hover:text-green-900',
    },
    {
      key: 'delete',
      label: 'Delete Expense',
      icon: Trash2,
      onClick: (expense: Expense) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
          console.log('Delete expense:', expense.id);
        }
      },
      className: 'text-red-600 hover:text-red-900',
    },
  ];

  // Define bulk actions
  const expenseBulkActions = [
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      onClick: (selectedIds: string[]) => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} expenses?`)) {
          console.log('Delete expenses:', selectedIds);
        }
      },
      className: 'text-red-600 hover:text-red-900',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white">
                        Expenses
                      </h1>
                      <p className="text-xl text-blue-100 mt-2">
                        Manage and track all project expenses
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
                    <FileText className="h-5 w-5" />
                    <span>Expense Management</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="group relative inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
                  <Download className="h-5 w-5 mr-2" />
                  Export Data
                </button>
                <Link
                  to="/expenses/create"
                  className="group relative inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Add Expense
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {/* Today's Total Card */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Today's Total</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(mockExpenseStats.todayTotal)}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">Today's expenses</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* This Week Card */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(mockExpenseStats.weekTotal)}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">Weekly expenses</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* This Month Card */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(mockExpenseStats.monthTotal)}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="text-sm">Monthly expenses</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Pending Receipts Card */}
          <div className="group relative bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Pending Receipts</p>
                <p className="text-3xl font-bold mt-2">{mockExpenseStats.pendingReceipts}</p>
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
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Expenses</h3>
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
                placeholder="Search by description, project, category, or amount..."
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
                    value={filters.categoryId || ''}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {expenseCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Paid By</label>
                <select
                  value={filters.paidBy || ''}
                  onChange={(e) => handleFilterChange('paidBy', e.target.value as PaidBy)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All</option>
                  {Object.values(PaidBy).map(paidBy => (
                    <option key={paidBy} value={paidBy}>
                      {paidBy}
                    </option>
                  ))}
                </select>
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
                Showing {filteredAndSortedExpenses.length} of {expenses.length} expenses
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

        {/* Enhanced Expenses Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Expenses</h3>
                  <p className="text-sm text-gray-600">Comprehensive expense management and tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">{filteredAndSortedExpenses.length} Filtered Expenses</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        
        <DataTable
          data={paginatedExpenses}
          columns={expenseColumns}
          loading={false}
          selectable={true}
          selectedRows={selectedExpenses}
          onSelectionChange={setSelectedExpenses}
          rowActions={expenseRowActions}
          bulkActions={expenseBulkActions}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: filteredAndSortedExpenses.length,
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
            setSortOptions({
              field: newSortInfo.field as 'date' | 'amount' | 'projectName' | 'categoryName',
              direction: newSortInfo.direction as 'asc' | 'desc'
            });
            setCurrentPage(1); // Reset to first page when sorting changes
          }}
          rowClassName={(expense) => `hover:bg-gray-50 transition-colors ${
            expense.amount > 50000 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' : 'bg-white'
          }`}
          emptyState={
            <div className="flex flex-col items-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Expenses Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start tracking your project expenses by adding your first expense record. 
                Monitor spending, manage receipts, and maintain financial transparency.
              </p>
              <Link
                to="/expenses/new"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Expense
              </Link>
            </div>
          }
        />
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;