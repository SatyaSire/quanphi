import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download, Calendar, Filter, FileText, Users, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';
import { mockAttendanceRecords } from '../data/attendanceData';
import { projects } from '../data/projectsData';
import { generateBatchPayments } from '../utils/paymentCalculations';

interface ExportFilter {
  dateRange: 'current' | 'last' | 'custom';
  payrollPeriod: string;
  department: string;
  project: string;
  format: 'pdf' | 'excel' | 'csv';
  includeDeductions: boolean;
  includeAdvances: boolean;
  includeBonuses: boolean;
}

const ExportPayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ExportFilter>({
    dateRange: 'current',
    payrollPeriod: '2024-01',
    department: 'all',
    project: 'all',
    format: 'pdf',
    includeDeductions: true,
    includeAdvances: true,
    includeBonuses: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    { id: 1, date: '2024-01-15', period: 'January 2024', format: 'PDF', status: 'completed', size: '2.4 MB' },
    { id: 2, date: '2024-01-10', period: 'December 2023', format: 'Excel', status: 'completed', size: '1.8 MB' },
    { id: 3, date: '2024-01-05', period: 'November 2023', format: 'CSV', status: 'completed', size: '0.9 MB' }
  ]);

  const activeWorkers = workersData.filter(worker => worker.status === 'active');
  const paymentRecords = useMemo(() => {
    return generateBatchPayments(activeWorkers, mockAttendanceRecords, filters.payrollPeriod);
  }, [activeWorkers, filters.payrollPeriod]);

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

  const exportStats = useMemo(() => {
    const totalAmount = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    const totalWorkers = filteredRecords.length;
    const totalDeductions = filteredRecords.reduce((sum, record) => sum + (record.deductions || 0), 0);
    const totalAdvances = filteredRecords.reduce((sum, record) => sum + (record.advances || 0), 0);
    
    return {
      totalAmount,
      totalWorkers,
      totalDeductions,
      totalAdvances,
      netPayable: totalAmount - totalDeductions - totalAdvances
    };
  }, [filteredRecords]);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newExport = {
      id: exportHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      period: filters.payrollPeriod,
      format: filters.format.toUpperCase(),
      status: 'completed',
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
    };
    
    setExportHistory([newExport, ...exportHistory]);
    setIsExporting(false);
  };

  const departments = [...new Set(activeWorkers.map(worker => worker.department))];

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
                  <span className="text-blue-200 text-sm font-medium">Export Center • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Export Payroll</h1>
                <p className="text-xl text-blue-100">Generate and download payroll reports</p>
              </div>
              <button 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/export-payroll/new')}
              >
                <Download className="h-5 w-5" />
                <span>Quick Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Export Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Export Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Filter className="h-6 w-6 mr-3 text-blue-600" />
                Export Configuration
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Period</label>
                  <select
                    value={filters.payrollPeriod}
                    onChange={(e) => setFilters({...filters, payrollPeriod: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                  <select
                    value={filters.format}
                    onChange={(e) => setFilters({...filters, format: e.target.value as 'pdf' | 'excel' | 'csv'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pdf">PDF Report</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
              </div>
              
              {/* Include Options */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Include in Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.includeDeductions}
                      onChange={(e) => setFilters({...filters, includeDeductions: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Deductions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.includeAdvances}
                      onChange={(e) => setFilters({...filters, includeAdvances: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Advances</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.includeBonuses}
                      onChange={(e) => setFilters({...filters, includeBonuses: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Bonuses</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Export Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Export Preview
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Worker</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Base Salary</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Deductions</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.slice(0, 5).map((record) => {
                      const worker = activeWorkers.find(w => w.id === record.workerId);
                      return (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{worker?.name}</div>
                            <div className="text-sm text-gray-500">{worker?.employeeId}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{worker?.department}</td>
                          <td className="py-3 px-4 text-right font-medium">₹{record.baseSalary.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-red-600">₹{(record.deductions || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600">₹{record.totalAmount.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredRecords.length > 5 && (
                  <div className="text-center py-4 text-gray-500">
                    ... and {filteredRecords.length - 5} more records
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Summary & Actions */}
          <div className="space-y-6">
            {/* Export Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Export Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Total Workers</span>
                  </div>
                  <span className="font-bold text-blue-600">{exportStats.totalWorkers}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-700">Total Amount</span>
                  </div>
                  <span className="font-bold text-green-600">₹{exportStats.totalAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-700">Deductions</span>
                  </div>
                  <span className="font-bold text-red-600">₹{exportStats.totalDeductions.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-700">Net Payable</span>
                  </div>
                  <span className="font-bold text-purple-600">₹{exportStats.netPayable.toLocaleString()}</span>
                </div>
              </div>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isExporting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Export Payroll</span>
                  </div>
                )}
              </button>
            </div>

            {/* Export History */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Exports
              </h2>
              
              <div className="space-y-3">
                {exportHistory.map((export_item) => (
                  <div key={export_item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{export_item.period}</div>
                      <div className="text-sm text-gray-500">{export_item.date} • {export_item.format} • {export_item.size}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPayrollPage;