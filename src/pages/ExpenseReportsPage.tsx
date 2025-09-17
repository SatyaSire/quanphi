import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Users,
  Building,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Expense, PaymentMode, PaidBy } from '../types/expenses';
import {
  mockExpenses,
  expenseCategories,
  formatCurrency
} from '../data/expensesData';
import { projects } from '../data/projectsData';

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom';
type ReportType = 'summary' | 'category' | 'project' | 'trend' | 'payment';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ReportFilters {
  period: ReportPeriod;
  dateRange: DateRange;
  projectIds: string[];
  categoryIds: string[];
  paymentModes: PaymentMode[];
  paidBy: PaidBy[];
  minAmount: number;
  maxAmount: number;
}

const ExpenseReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('summary');
  const [filters, setFilters] = useState<ReportFilters>({
    period: 'month',
    dateRange: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    projectIds: [],
    categoryIds: [],
    paymentModes: [],
    paidBy: [],
    minAmount: 0,
    maxAmount: 1000000
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      
      // Date range filter
      if (expenseDate < startDate || expenseDate > endDate) return false;
      
      // Project filter
      if (filters.projectIds.length > 0 && !filters.projectIds.includes(expense.projectId)) return false;
      
      // Category filter
      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(expense.categoryId)) return false;
      
      // Payment mode filter
      if (filters.paymentModes.length > 0 && !filters.paymentModes.includes(expense.paymentMode)) return false;
      
      // Paid by filter
      if (filters.paidBy.length > 0 && !filters.paidBy.includes(expense.paidBy)) return false;
      
      // Amount range filter
      if (expense.amount < filters.minAmount || expense.amount > filters.maxAmount) return false;
      
      return true;
    });
  }, [filters]);

  // Calculate report data
  const reportData = useMemo(() => {
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = filteredExpenses.length;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
    
    // Previous period comparison (for trend analysis)
    const periodDays = Math.ceil(
      (new Date(filters.dateRange.endDate).getTime() - new Date(filters.dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const previousStartDate = new Date(new Date(filters.dateRange.startDate).getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousEndDate = new Date(filters.dateRange.startDate);
    
    const previousExpenses = mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= previousStartDate && expenseDate < previousEndDate;
    });
    const previousTotal = previousExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const growthRate = previousTotal > 0 ? ((totalExpenses - previousTotal) / previousTotal) * 100 : 0;
    
    // Category breakdown
    const categoryData = expenseCategories.map(category => {
      const categoryExpenses = filteredExpenses.filter(expense => expense.categoryId === category.id);
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        id: category.id,
        name: category.name,
        value: total,
        count: categoryExpenses.length,
        color: category.color,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
      };
    }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
    
    // Project breakdown
    const projectData = projects.map(project => {
      const projectExpenses = filteredExpenses.filter(expense => expense.projectId === project.id);
      const total = projectExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        id: project.id,
        name: project.name,
        value: total,
        count: projectExpenses.length,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
        budget: project.budget,
        budgetUsed: project.budget > 0 ? (total / project.budget) * 100 : 0
      };
    }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
    
    // Payment mode breakdown
    const paymentData = Object.values(PaymentMode).map(mode => {
      const modeExpenses = filteredExpenses.filter(expense => expense.paymentMode === mode);
      const total = modeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        mode,
        value: total,
        count: modeExpenses.length,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
      };
    }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
    
    // Paid by breakdown
    const paidByData = Object.values(PaidBy).map(paidBy => {
      const paidByExpenses = filteredExpenses.filter(expense => expense.paidBy === paidBy);
      const total = paidByExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        paidBy,
        value: total,
        count: paidByExpenses.length,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
      };
    }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
    
    // Daily trend data
    const dailyData = [];
    const startDate = new Date(filters.dateRange.startDate);
    const endDate = new Date(filters.dateRange.endDate);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = filteredExpenses.filter(expense => expense.date === dateStr);
      const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      dailyData.push({
        date: dateStr,
        amount: dayTotal,
        count: dayExpenses.length,
        formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    // Monthly trend data (for longer periods)
    const monthlyData = [];
    const monthlyTotals: Record<string, { amount: number; count: number }> = {};
    
    filteredExpenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { amount: 0, count: 0 };
      }
      monthlyTotals[month].amount += expense.amount;
      monthlyTotals[month].count += 1;
    });
    
    Object.entries(monthlyTotals).forEach(([month, data]) => {
      monthlyData.push({
        month,
        amount: data.amount,
        count: data.count
      });
    });
    
    return {
      totalExpenses,
      expenseCount,
      averageExpense,
      growthRate,
      categoryData,
      projectData,
      paymentData,
      paidByData,
      dailyData,
      monthlyData
    };
  }, [filteredExpenses, filters]);

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      period: 'month',
      dateRange: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      projectIds: [],
      categoryIds: [],
      paymentModes: [],
      paidBy: [],
      minAmount: 0,
      maxAmount: 1000000
    });
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real application, this would generate and download the actual file
    const filename = `expense-report-${filters.dateRange.startDate}-to-${filters.dateRange.endDate}.${format}`;
    console.log(`Exporting report as ${filename}`);
    
    setIsExporting(false);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Reports</h1>
              <p className="text-gray-600 mt-1">
                Analyze spending patterns and generate detailed reports
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                  showFilters
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="summary">Summary Report</option>
                  <option value="category">Category Analysis</option>
                  <option value="project">Project Breakdown</option>
                  <option value="trend">Trend Analysis</option>
                  <option value="payment">Payment Analysis</option>
                </select>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => exportReport('pdf')}
                  disabled={isExporting}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    startDate: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    endDate: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* Amount Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Amount (₹)
                </label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Amount (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.totalExpenses)}
                </p>
                {reportData.growthRate !== 0 && (
                  <div className={`flex items-center text-sm ${
                    reportData.growthRate > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {reportData.growthRate > 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(reportData.growthRate).toFixed(1)}% vs previous period
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.expenseCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Expense</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.averageExpense)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Tag className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.categoryData.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending Trend */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Spending Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === 'category' && (
          <div className="space-y-6">
            {/* Category Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Details Table */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Category Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg per Entry
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.categoryData.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.percentage.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.value / category.count)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {reportType === 'project' && (
          <div className="space-y-6">
            {/* Project Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Expenses</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Budget Analysis</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reportData.projectData.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{project.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Spent:</span>
                          <span className="font-medium">{formatCurrency(project.value)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{formatCurrency(project.budget)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining:</span>
                          <span className={`font-medium ${
                            project.budget - project.value >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(project.budget - project.value)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              project.budgetUsed > 100 ? 'bg-red-500' : project.budgetUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(project.budgetUsed, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.budgetUsed.toFixed(1)}% of budget used
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'trend' && (
          <div className="space-y-6">
            {/* Daily Trend */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Spending Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            {reportData.monthlyData.length > 1 && (
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="amount" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {reportType === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Mode Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.paymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mode, percentage }) => `${mode} ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Paid By Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Paid By</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.paidByData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="paidBy" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseReportsPage;