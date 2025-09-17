import React, { useState, useMemo } from 'react';
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Calendar, Filter, Download, Users, DollarSign, Clock, FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';
import { mockAttendanceRecords } from '../data/attendanceData';
import { projects } from '../data/projectsData';
import { generateBatchPayments } from '../utils/paymentCalculations';

interface ReportFilter {
  period: string;
  department: string;
  project: string;
  reportType: 'summary' | 'detailed' | 'comparative';
}

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilter>({
    period: '2024-01',
    department: 'all',
    project: 'all',
    reportType: 'summary'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'department' | 'project' | 'trends'>('overview');

  const activeWorkers = workersData.filter(worker => worker.status === 'active');
  const paymentRecords = useMemo(() => {
    return generateBatchPayments(activeWorkers, mockAttendanceRecords, filters.period);
  }, [activeWorkers, filters.period]);

  const filteredRecords = useMemo(() => {
    let filtered = paymentRecords;
    
    if (filters.department !== 'all') {
      filtered = filtered.filter(record => {
        const worker = activeWorkers.find(w => w.id === record.workerId);
        return worker?.department === filters.department;
      });
    }
    
    if (filters.project !== 'all') {
      filtered = filtered.filter(record => record.projectId === filters.project);
    }
    
    return filtered;
  }, [paymentRecords, filters.department, filters.project, activeWorkers]);

  const reportData = useMemo(() => {
    const totalPayroll = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    const totalWorkers = filteredRecords.length;
    const avgSalary = totalWorkers > 0 ? totalPayroll / totalWorkers : 0;
    const totalDeductions = filteredRecords.reduce((sum, record) => sum + (record.deductions || 0), 0);
    const totalAdvances = filteredRecords.reduce((sum, record) => sum + (record.advances || 0), 0);
    
    // Department breakdown
    const departmentData = activeWorkers.reduce((acc, worker) => {
      const dept = worker.department;
      if (!acc[dept]) {
        acc[dept] = { workers: 0, totalSalary: 0, avgSalary: 0 };
      }
      acc[dept].workers += 1;
      const workerRecord = filteredRecords.find(r => r.workerId === worker.id);
      if (workerRecord) {
        acc[dept].totalSalary += workerRecord.totalAmount;
      }
      acc[dept].avgSalary = acc[dept].totalSalary / acc[dept].workers;
      return acc;
    }, {} as Record<string, { workers: number; totalSalary: number; avgSalary: number }>);
    
    // Project breakdown
    const projectData = projects.reduce((acc, project) => {
      const projectRecords = filteredRecords.filter(r => r.projectId === project.id);
      acc[project.name] = {
        workers: projectRecords.length,
        totalSalary: projectRecords.reduce((sum, r) => sum + r.totalAmount, 0),
        avgSalary: projectRecords.length > 0 ? projectRecords.reduce((sum, r) => sum + r.totalAmount, 0) / projectRecords.length : 0
      };
      return acc;
    }, {} as Record<string, { workers: number; totalSalary: number; avgSalary: number }>);
    
    return {
      totalPayroll,
      totalWorkers,
      avgSalary,
      totalDeductions,
      totalAdvances,
      netPayable: totalPayroll - totalDeductions - totalAdvances,
      departmentData,
      projectData
    };
  }, [filteredRecords, activeWorkers]);

  const departments = [...new Set(activeWorkers.map(worker => worker.department))];
  
  const monthlyTrends = [
    { month: 'Oct 2023', payroll: 2850000, workers: 45 },
    { month: 'Nov 2023', payroll: 3120000, workers: 48 },
    { month: 'Dec 2023', payroll: 3350000, workers: 52 },
    { month: 'Jan 2024', payroll: reportData.totalPayroll, workers: reportData.totalWorkers }
  ];

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Payroll</p>
            <p className="text-3xl font-bold">₹{reportData.totalPayroll.toLocaleString()}</p>
          </div>
          <DollarSign className="h-12 w-12 text-blue-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Workers</p>
            <p className="text-3xl font-bold">{reportData.totalWorkers}</p>
          </div>
          <Users className="h-12 w-12 text-green-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Average Salary</p>
            <p className="text-3xl font-bold">₹{Math.round(reportData.avgSalary).toLocaleString()}</p>
          </div>
          <TrendingUp className="h-12 w-12 text-purple-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Net Payable</p>
            <p className="text-3xl font-bold">₹{reportData.netPayable.toLocaleString()}</p>
          </div>
          <BarChart3 className="h-12 w-12 text-orange-200" />
        </div>
      </div>
    </div>
  );

  const renderDepartmentTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Department-wise Analysis</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Workers</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Salary</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Average Salary</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(reportData.departmentData).map(([dept, data]) => {
              const percentage = (data.totalSalary / reportData.totalPayroll * 100).toFixed(1);
              return (
                <tr key={dept} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{dept}</td>
                  <td className="py-4 px-4 text-center">{data.workers}</td>
                  <td className="py-4 px-4 text-right font-medium">₹{data.totalSalary.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">₹{Math.round(data.avgSalary).toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {percentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProjectTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Project-wise Analysis</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Workers</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Salary</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Average Salary</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(reportData.projectData).filter(([_, data]) => data.workers > 0).map(([project, data]) => {
              const percentage = (data.totalSalary / reportData.totalPayroll * 100).toFixed(1);
              return (
                <tr key={project} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{project}</td>
                  <td className="py-4 px-4 text-center">{data.workers}</td>
                  <td className="py-4 px-4 text-right font-medium">₹{data.totalSalary.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">₹{Math.round(data.avgSalary).toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {percentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends</h3>
      <div className="space-y-4">
        {monthlyTrends.map((trend, index) => {
          const isCurrentMonth = index === monthlyTrends.length - 1;
          const prevTrend = index > 0 ? monthlyTrends[index - 1] : null;
          const payrollChange = prevTrend ? ((trend.payroll - prevTrend.payroll) / prevTrend.payroll * 100) : 0;
          const workerChange = prevTrend ? trend.workers - prevTrend.workers : 0;
          
          return (
            <div key={trend.month} className={`p-4 rounded-xl border-2 ${isCurrentMonth ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{trend.month}</h4>
                  <p className="text-sm text-gray-600">₹{trend.payroll.toLocaleString()} • {trend.workers} workers</p>
                </div>
                <div className="text-right">
                  {prevTrend && (
                    <>
                      <div className={`text-sm font-medium ${payrollChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {payrollChange >= 0 ? '+' : ''}{payrollChange.toFixed(1)}% payroll
                      </div>
                      <div className={`text-sm ${workerChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {workerChange >= 0 ? '+' : ''}{workerChange} workers
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/payments')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Payments</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-blue-200 text-sm font-medium">Analytics • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Payroll Reports</h1>
                <p className="text-xl text-blue-100">Comprehensive payroll analytics and insights</p>
              </div>
              <button 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/reports/new')}
              >
                <Download className="h-5 w-5" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Filter className="h-6 w-6 mr-3 text-blue-600" />
              Report Filters
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024-01">January 2024</option>
                <option value="2023-12">December 2023</option>
                <option value="2023-11">November 2023</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={filters.project}
                onChange={(e) => setFilters({...filters, project: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={filters.reportType}
                onChange={(e) => setFilters({...filters, reportType: e.target.value as 'summary' | 'detailed' | 'comparative'})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="comparative">Comparative Report</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'department', label: 'Department Analysis', icon: Users },
                { id: 'project', label: 'Project Analysis', icon: FileText },
                { id: 'trends', label: 'Trends', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'department' && renderDepartmentTab()}
            {activeTab === 'project' && renderProjectTab()}
            {activeTab === 'trends' && renderTrendsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;