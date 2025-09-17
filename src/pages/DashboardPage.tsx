import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
// import { useGetDashboardDataQuery } from '../api/apiService'; // Will reconnect when backend is ready
import KPICard from '../components/common/KPICard';
import Chart from '../components/common/Chart';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { LoadingState } from '../components/common/LoadingSpinner';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CubeIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  BellIcon,
  ChartBarIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  FireIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon as BuildingOfficeSolid,
  CurrencyDollarIcon as CurrencyDollarSolid,
  ChartBarIcon as ChartBarSolid,
  UsersIcon as UsersSolid,
} from '@heroicons/react/24/solid';
import type { ActivityItem } from '../types/api';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.session);
  // Using static data for now - will connect to backend later
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Static dashboard data - replace with API call when backend is ready
  const kpis = {
    activeProjects: 12,
    pendingQuotations: 8,
    duePayments: 45000,
    workersOnsite: 24,
    lowStockMaterials: 3,
    completedTasks: 156,
    totalRevenue: 2450000,
    clientSatisfaction: 4.8,
  };

  const charts = {
    monthlyRevenue: [
      { month: 'Jan', revenue: 180000, expenses: 120000 },
      { month: 'Feb', revenue: 220000, expenses: 140000 },
      { month: 'Mar', revenue: 280000, expenses: 160000 },
      { month: 'Apr', revenue: 320000, expenses: 180000 },
      { month: 'May', revenue: 380000, expenses: 200000 },
      { month: 'Jun', revenue: 420000, expenses: 220000 },
    ],
    expenseSplit: [
      { category: 'Materials', amount: 45, color: '#3B82F6' },
      { category: 'Labor', amount: 35, color: '#10B981' },
      { category: 'Equipment', amount: 15, color: '#F59E0B' },
      { category: 'Other', amount: 5, color: '#EF4444' },
    ],
  };

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                  currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const recentActivity = [
    {
      id: '1',
      type: 'project',
      title: 'Villa Construction Started',
      description: 'Foundation work began for Sunset Villa project',
      userName: 'John Smith',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      description: '$25,000 received from ABC Corp for Office Complex',
      userName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'task',
      title: 'Milestone Completed',
      description: 'Electrical work completed for Residential Tower',
      userName: 'Mike Wilson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const quickActions = [
    { 
      title: 'New Project', 
      icon: BuildingOfficeIcon, 
      href: '/projects/new',
      description: 'Start a new construction project',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    { 
      title: 'Create Invoice', 
      icon: DocumentTextIcon, 
      href: '/invoices/new',
      description: 'Generate client invoice',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    { 
      title: 'Add Client', 
      icon: UsersIcon, 
      href: '/clients/new',
      description: 'Register new client',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    { 
      title: 'Record Payment', 
      icon: CurrencyDollarIcon, 
      href: '/payments/new',
      description: 'Log payment received',
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600'
    },
    { 
      title: 'Schedule Task', 
      icon: CalendarDaysIcon, 
      href: '/tasks/new',
      description: 'Create new task',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    },
    { 
      title: 'Safety Report', 
      icon: ShieldCheckIcon, 
      href: '/safety/new',
      description: 'Submit safety inspection',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
  ];

  const upcomingDeadlines = [
    { project: 'Sunset Villa', task: 'Foundation Inspection', dueDate: '2024-01-15', priority: 'high' },
    { project: 'Office Complex', task: 'Electrical Installation', dueDate: '2024-01-18', priority: 'medium' },
    { project: 'Residential Tower', task: 'Plumbing Review', dueDate: '2024-01-22', priority: 'low' },
  ];

  const weatherData = {
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    suitable: true,
  };

  const activityColumns = [
    {
      key: 'type',
      label: 'Type',
      render: (item: ActivityItem) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          item.type === 'project' ? 'bg-blue-100 text-blue-800' :
          item.type === 'task' ? 'bg-green-100 text-green-800' :
          item.type === 'payment' ? 'bg-yellow-100 text-yellow-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Activity',
      render: (item: ActivityItem) => (
        <div>
          <p className="font-medium text-gray-900">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      ),
    },
    {
      key: 'userName',
      label: 'User',
    },
    {
      key: 'timestamp',
      label: 'Time',
      render: (item: ActivityItem) => (
        <span className="text-sm text-gray-500">
          {new Date(item.timestamp).toLocaleString()}
        </span>
      ),
    },
  ];

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
                    <BuildingOfficeSolid className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      {greeting}, {user?.fullName?.split(' ')[0] || 'Builder'}! 👋
                    </h1>
                    <p className="text-xl text-blue-100 mt-2">
                      Your construction empire at a glance
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5" />
                    <span>Construction HQ</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Weather Widget */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Weather Today</p>
                      <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                      <p className="text-sm">{weatherData.condition}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        weatherData.suitable ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'
                      }`}>
                        {weatherData.suitable ? '✓ Good for work' : '⚠ Weather alert'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAIChat(true)}
                  className="group relative inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <LightBulbIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  AI Assistant
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {/* Revenue Card */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
               onClick={() => window.location.href = '/financial'}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${(kpis.totalRevenue / 1000000).toFixed(1)}M</p>
                <div className="flex items-center mt-2 text-green-100">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12.5% this month</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <CurrencyDollarSolid className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Active Projects Card */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
               onClick={() => window.location.href = '/projects'}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Projects</p>
                <p className="text-3xl font-bold mt-2">{kpis.activeProjects}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{kpis.completedTasks} tasks completed</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <BuildingOfficeSolid className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Workers & Safety Card */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
               onClick={() => window.location.href = '/workers'}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Workers Onsite</p>
                <p className="text-3xl font-bold mt-2">{kpis.workersOnsite}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Safety compliant</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <UsersSolid className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Client Satisfaction Card */}
          <div className="group relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
               onClick={() => window.location.href = '/clients'}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Client Rating</p>
                <div className="flex items-center mt-2">
                  <p className="text-3xl font-bold">{kpis.clientSatisfaction}</p>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`h-5 w-5 ${i < Math.floor(kpis.clientSatisfaction) ? 'text-yellow-300 fill-current' : 'text-amber-200'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-amber-100">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Excellent feedback</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <StarIcon className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Secondary KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Quotations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.pendingQuotations}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Due Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${(kpis.duePayments / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.lowStockMaterials}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CubeIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Equipment Status</p>
                <p className="text-2xl font-bold text-green-600 mt-1">98%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <WrenchScrewdriverIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Revenue & Expenses</h3>
                  <p className="text-sm text-gray-600 mt-1">Monthly performance overview</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedTimeframe} 
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="6m">Last 6 months</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Chart
                type="line"
                data={charts.monthlyRevenue}
                xKey="month"
                yKey="revenue"
                height={320}
              />
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Expense Split</h3>
              <p className="text-sm text-gray-600 mt-1">Cost distribution</p>
            </div>
            <div className="p-6">
              <Chart
                type="pie"
                data={charts.expenseSplit}
                dataKey="amount"
                nameKey="category"
                height={280}
              />
              <div className="mt-4 space-y-2">
                {charts.expenseSplit.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-700">{item.category}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.amount}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Deadlines Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={index}
                      href={action.href}
                      className={`group relative ${action.color} ${action.hoverColor} text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:bg-white/30 transition-colors duration-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h3>
                  <p className="text-sm text-gray-600 mt-1">Critical tasks requiring attention</p>
                </div>
                <BellIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{deadline.task}</h4>
                      <p className="text-xs text-gray-600 mt-1">{deadline.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{deadline.dueDate}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                        deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                View all deadlines →
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Latest updates across all projects</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Live</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'project' ? 'bg-blue-100' :
                    activity.type === 'task' ? 'bg-green-100' :
                    activity.type === 'payment' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'project' && <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'task' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                    {activity.type === 'payment' && <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />}
                    {activity.type === 'invoice' && <DocumentTextIcon className="h-5 w-5 text-purple-600" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-gray-500">by {activity.userName}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          activity.type === 'project' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'task' ? 'bg-green-100 text-green-800' :
                          activity.type === 'payment' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 px-6 py-4">
            <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced AI Chat Modal */}
      <Modal
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
          title="🤖 AI Construction Assistant"
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <LightBulbIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Your AI Construction Expert</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    I can help you with project insights, financial analysis, resource planning, 
                    safety recommendations, and much more. Ask me anything about your construction business!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Suggestions */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">Quick Questions:</h5>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "What projects are behind schedule?",
                  "Show me this month's financial summary",
                  "Which materials need restocking?",
                  "Any safety concerns I should know about?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setAiQuestion(suggestion)}
                    className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                  >
                    💡 {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Your Question
              </label>
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Type your question here... e.g., 'What's the status of Sunset Villa project?'"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAIChat(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement AI query
                  console.log('AI Query:', aiQuestion);
                  setAiQuestion('');
                  setShowAIChat(false);
                }}
                disabled={!aiQuestion.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <LightBulbIcon className="h-4 w-4" />
                  <span>Ask AI</span>
                </div>
              </button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default DashboardPage;