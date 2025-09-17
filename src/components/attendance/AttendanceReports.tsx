import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Download,
  FileText,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Filter,
  Search
} from 'lucide-react';
import { AttendanceRecord, AttendanceSummary } from '../../types/attendance';
import { Worker } from '../../types/worker';
import { Project } from '../../types/project';
import { mockAttendanceRecords, getAttendanceSummary } from '../../data/attendanceData';
import { workersData } from '../../data/workersData';
import { projects } from '../../data/projectsData';

interface AttendanceReportsProps {
  onClose: () => void;
}

type ReportType = 'summary' | 'detailed' | 'trends' | 'project';
type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

const AttendanceReports: React.FC<AttendanceReportsProps> = ({ onClose }) => {
  const [reportType, setReportType] = useState<ReportType>('summary');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        }
        break;
    }

    return { startDate, endDate };
  };

  // Filter records based on criteria
  const filteredRecords = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    
    return mockAttendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const dateInRange = recordDate >= startDate && recordDate <= endDate;
      const projectMatch = !selectedProject || record.projectId === selectedProject;
      const workerMatch = !selectedWorker || record.workerId === selectedWorker;
      
      return dateInRange && projectMatch && workerMatch;
    });
  }, [dateRange, selectedProject, selectedWorker, customStartDate, customEndDate]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalRecords = filteredRecords.length;
    const presentRecords = filteredRecords.filter(r => r.status === 'present').length;
    const absentRecords = filteredRecords.filter(r => r.status === 'absent').length;
    const leaveRecords = filteredRecords.filter(r => r.status === 'leave').length;
    const halfDayRecords = filteredRecords.filter(r => r.status === 'half_day').length;
    const overtimeRecords = filteredRecords.filter(r => r.overtimeHours && r.overtimeHours > 0).length;
    
    const totalHours = filteredRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const totalOvertimeHours = filteredRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
    
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;
    
    return {
      totalRecords,
      presentRecords,
      absentRecords,
      leaveRecords,
      halfDayRecords,
      overtimeRecords,
      totalHours,
      totalOvertimeHours,
      attendanceRate
    };
  }, [filteredRecords]);

  // Worker-wise statistics
  const workerStats = useMemo(() => {
    const stats = new Map();
    
    filteredRecords.forEach(record => {
      const worker = workersData.find(w => w.id === record.workerId);
      if (!worker) return;
      
      if (!stats.has(record.workerId)) {
        stats.set(record.workerId, {
          worker,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          leaveDays: 0,
          halfDays: 0,
          totalHours: 0,
          overtimeHours: 0
        });
      }
      
      const stat = stats.get(record.workerId);
      stat.totalDays++;
      stat.totalHours += record.totalHours || 0;
      stat.overtimeHours += record.overtimeHours || 0;
      
      switch (record.status) {
        case 'present':
          stat.presentDays++;
          break;
        case 'absent':
          stat.absentDays++;
          break;
        case 'leave':
          stat.leaveDays++;
          break;
        case 'half_day':
          stat.halfDays++;
          break;
      }
    });
    
    return Array.from(stats.values()).map(stat => ({
      ...stat,
      attendanceRate: stat.totalDays > 0 ? (stat.presentDays / stat.totalDays) * 100 : 0
    }));
  }, [filteredRecords]);

  // Project-wise statistics
  const projectStats = useMemo(() => {
    const stats = new Map();
    
    filteredRecords.forEach(record => {
      const project = projects.find(p => p.id === record.projectId);
      if (!project) return;
      
      if (!stats.has(record.projectId)) {
        stats.set(record.projectId, {
          project,
          totalRecords: 0,
          presentRecords: 0,
          totalHours: 0,
          uniqueWorkers: new Set()
        });
      }
      
      const stat = stats.get(record.projectId);
      stat.totalRecords++;
      stat.totalHours += record.totalHours || 0;
      stat.uniqueWorkers.add(record.workerId);
      
      if (record.status === 'present') {
        stat.presentRecords++;
      }
    });
    
    return Array.from(stats.values()).map(stat => ({
      ...stat,
      workerCount: stat.uniqueWorkers.size,
      attendanceRate: stat.totalRecords > 0 ? (stat.presentRecords / stat.totalRecords) * 100 : 0
    }));
  }, [filteredRecords]);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    // Simulate export functionality
    const filename = `attendance_report_${reportType}_${Date.now()}.${format}`;
    console.log(`Exporting ${filename}...`);
    alert(`Report exported as ${filename}`);
  };

  const renderSummaryReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-900">{summaryStats.totalRecords}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-900">{summaryStats.presentRecords}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Absent</p>
              <p className="text-2xl font-bold text-red-900">{summaryStats.absentRecords}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-purple-900">{summaryStats.attendanceRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Total Hours</h4>
          <p className="text-xl font-bold text-gray-900">{summaryStats.totalHours.toFixed(1)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Overtime Hours</h4>
          <p className="text-xl font-bold text-gray-900">{summaryStats.totalOvertimeHours.toFixed(1)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Leave Days</h4>
          <p className="text-xl font-bold text-gray-900">{summaryStats.leaveRecords}</p>
        </div>
      </div>
    </div>
  );

  const renderWorkerReport = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Worker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Absent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workerStats.map((stat, index) => (
              <tr key={stat.worker.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {stat.worker.personalInfo.firstName[0]}{stat.worker.personalInfo.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{stat.worker.personalInfo.firstName} {stat.worker.personalInfo.lastName}</div>
                      <div className="text-sm text-gray-500">{stat.worker.jobInfo.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.totalDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {stat.presentDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {stat.absentDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stat.attendanceRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{stat.attendanceRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.totalHours.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProjectReport = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Records
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projectStats.map((stat, index) => (
              <tr key={stat.project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{stat.project.name}</div>
                    <div className="text-sm text-gray-500">{stat.project.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.workerCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.totalRecords}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stat.attendanceRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{stat.attendanceRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.totalHours.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Attendance Reports</h2>
            <p className="text-blue-100 text-sm">Generate comprehensive attendance analytics</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Worker Details</option>
              <option value="project">Project Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={() => handleExport('excel')}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {reportType === 'summary' && renderSummaryReport()}
        {reportType === 'detailed' && renderWorkerReport()}
        {reportType === 'project' && renderProjectReport()}
      </div>
    </div>
  );
};

export default AttendanceReports;