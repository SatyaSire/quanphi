import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

const ProjectReportPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('overview');

  // Mock project data
  const projects = {
    '1': {
      id: '1',
      name: 'Modern Office Complex',
      location: 'Downtown Business District',
      startDate: '2024-01-15',
      endDate: '2024-12-30',
      manager: 'Sarah Johnson',
      status: 'in-progress',
      budget: 2500000,
      spent: 1200000,
      workProgress: 68,
      paymentProgress: 72
    },
    [projectId || '1']: {
      id: projectId,
      name: 'Office Complex Renovation',
      location: 'Downtown Business District',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 85000,
      spent: 63750,
      workProgress: 75,
      paymentProgress: 60,
      manager: 'Sarah Johnson'
    }
  };

  const project = projects[projectId || '1'];

  const reportData = {
    overview: {
      totalTasks: 45,
      completedTasks: 34,
      pendingTasks: 11,
      milestones: 8,
      completedMilestones: 6,
      teamMembers: 12,
      documentsUploaded: 28
    },
    financial: {
      totalBudget: 85000,
      spent: 63750,
      remaining: 21250,
      invoicesPaid: 4,
      pendingInvoices: 2,
      nextPaymentDue: '2024-02-15'
    },
    timeline: {
      plannedDuration: '60 days',
      actualDuration: '45 days',
      daysRemaining: 15,
      onSchedule: true
    }
  };

  const handleDownloadReport = () => {
    // Mock download functionality
    alert(`Downloading ${reportType} report for ${project.name}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/client-portal')}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Projects</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl overflow-hidden -mx-8 px-8 pt-8 pb-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Project Report</h1>
                <p className="text-white/90 text-lg">Comprehensive project analytics and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleDownloadReport}
                className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                <Download className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Work Progress</p>
                  <p className="text-3xl font-bold text-white">{project.workProgress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${project.workProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Budget Spent</p>
                  <p className="text-2xl font-bold text-white">${(project.spent / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-white/70">of ${(project.budget / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Payment Progress</p>
                  <p className="text-2xl font-bold text-white">{project.paymentProgress}%</p>
                  <p className="text-xs text-white/70">invoices processed</p>
                </div>
                <Calendar className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Project Status</p>
                  <p className="text-2xl font-bold text-white capitalize">{project.status}</p>
                  <p className="text-xs text-white/70">{project.manager}</p>
                </div>
                <Users className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-8">
              {[
                { key: 'overview', label: 'Overview', icon: FileText },
                { key: 'financial', label: 'Financial', icon: DollarSign },
                { key: 'timeline', label: 'Timeline', icon: Clock }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setReportType(key)}
                  className={`flex items-center space-x-2 py-6 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    reportType === key
                      ? 'border-green-500 text-green-600 bg-green-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Report Content */}
          <div className="p-8">
            {reportType === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600">Total Tasks</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalTasks}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-600">Completed Tasks</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.overview.completedTasks}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-yellow-600">Pending Tasks</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.overview.pendingTasks}</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-xl">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-purple-600">Milestones</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.overview.completedMilestones}/{reportData.overview.milestones}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-indigo-600">Team Members</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.overview.teamMembers}</p>
                      </div>
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Documents</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.overview.documentsUploaded}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'financial' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600">Total Budget</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(reportData.financial.totalBudget)}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-600">Amount Spent</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(reportData.financial.spent)}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-yellow-600">Remaining</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(reportData.financial.remaining)}</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-xl">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="h-6 w-6 text-green-600 mr-3" />
                    Payment Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600">Invoices Paid</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.financial.invoicesPaid}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600">Pending Invoices</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.financial.pendingInvoices}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'timeline' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600">Planned Duration</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.timeline.plannedDuration}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-600">Actual Duration</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.timeline.actualDuration}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-xl">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-yellow-600">Days Remaining</p>
                        <p className="text-3xl font-bold text-gray-900">{reportData.timeline.daysRemaining}</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Clock className="h-6 w-6 text-green-600 mr-3" />
                    Schedule Status
                  </h3>
                  <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4">
                    <div className={`w-4 h-4 rounded-full ${
                      reportData.timeline.onSchedule ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`font-semibold text-lg ${
                      reportData.timeline.onSchedule ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {reportData.timeline.onSchedule ? 'On Schedule' : 'Behind Schedule'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportPage;