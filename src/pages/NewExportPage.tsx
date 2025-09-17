import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Calendar, Users, DollarSign, Settings, CheckCircle, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';
import { projects } from '../data/projectsData';
import { formatCurrency } from '../utils/formatters';

interface ExportForm {
  exportType: 'payroll' | 'workers' | 'payments' | 'summary';
  format: 'pdf' | 'excel' | 'csv';
  period: string;
  startDate: string;
  endDate: string;
  department: string;
  project: string;
  includeDeductions: boolean;
  includeAdvances: boolean;
  includeBonus: boolean;
  includeAttendance: boolean;
}

const NewExportPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExportForm>({
    exportType: 'payroll',
    format: 'excel',
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    department: 'all',
    project: 'all',
    includeDeductions: true,
    includeAdvances: true,
    includeBonus: true,
    includeAttendance: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [errors, setErrors] = useState<Partial<ExportForm>>({});

  const activeWorkers = workersData.filter(worker => worker.status === 'active');
  const departments = [...new Set(activeWorkers.map(worker => worker.department))];

  const validateForm = (): boolean => {
    const newErrors: Partial<ExportForm> = {};
    
    if (!formData.startDate) newErrors.startDate = 'Please select start date';
    if (!formData.endDate) newErrors.endDate = 'Please select end date';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would typically make an API call to export the data
      console.log('Exporting data:', formData);
      
      setExportComplete(true);
      
      // Auto-redirect after showing success
      setTimeout(() => {
        navigate('/export-payroll');
      }, 2000);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleInputChange = (field: keyof ExportForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const exportTypeOptions = [
    { value: 'payroll', label: 'Payroll Export', description: 'Complete payroll data with salaries and deductions', icon: DollarSign },
    { value: 'workers', label: 'Workers Export', description: 'Worker profiles and contact information', icon: Users },
    { value: 'payments', label: 'Payments Export', description: 'Payment history and transaction records', icon: FileText },
    { value: 'summary', label: 'Summary Export', description: 'Consolidated summary reports', icon: Settings }
  ];

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', description: 'Spreadsheet format with formulas' },
    { value: 'csv', label: 'CSV (.csv)', description: 'Comma-separated values' },
    { value: 'pdf', label: 'PDF (.pdf)', description: 'Formatted document' }
  ];

  if (exportComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Export Complete!</h2>
          <p className="text-gray-600 mb-6">Your {formData.exportType} data has been exported successfully.</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => navigate('/export-payroll')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Back to Exports</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/export-payroll')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Export Center</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-indigo-200 text-sm font-medium">Data Export • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Quick Export</h1>
                <p className="text-xl text-indigo-100">Export your payroll data in various formats</p>
              </div>
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Download className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Export Type Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <FileText className="h-5 w-5 inline mr-2" />
                Export Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportTypeOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.exportType === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                      }`}
                      onClick={() => handleInputChange('exportType', option.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          formData.exportType === option.value ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            formData.exportType === option.value ? 'text-indigo-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <input
                          type="radio"
                          name="exportType"
                          value={option.value}
                          checked={formData.exportType === option.value}
                          onChange={() => handleInputChange('exportType', option.value)}
                          className="w-4 h-4 text-indigo-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <Settings className="h-5 w-5 inline mr-2" />
                Export Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formatOptions.map(option => (
                  <div
                    key={option.value}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.format === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                    }`}
                    onClick={() => handleInputChange('format', option.value)}
                  >
                    <div className="text-center">
                      <input
                        type="radio"
                        name="format"
                        value={option.value}
                        checked={formData.format === option.value}
                        onChange={() => handleInputChange('format', option.value)}
                        className="w-4 h-4 text-indigo-600 mb-2"
                      />
                      <h3 className="font-semibold text-gray-800">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  min={formData.startDate}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Project
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Include Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <Filter className="h-5 w-5 inline mr-2" />
                Include in Export
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeDeductions}
                    onChange={(e) => handleInputChange('includeDeductions', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Deductions</span>
                    <p className="text-sm text-gray-600">Tax, insurance, and other deductions</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeAdvances}
                    onChange={(e) => handleInputChange('includeAdvances', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Advances</span>
                    <p className="text-sm text-gray-600">Salary advances and loans</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeBonus}
                    onChange={(e) => handleInputChange('includeBonus', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Bonuses</span>
                    <p className="text-sm text-gray-600">Performance and holiday bonuses</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeAttendance}
                    onChange={(e) => handleInputChange('includeAttendance', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Attendance</span>
                    <p className="text-sm text-gray-600">Working hours and attendance records</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/export-payroll')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isExporting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'Exporting...' : 'Start Export'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewExportPage;