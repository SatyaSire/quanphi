import React, { useState, useMemo } from 'react';
import { ArrowLeft, Shield, Search, Filter, Calendar, User, Activity, Eye, Download, Clock, CheckCircle, AlertTriangle, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'payroll' | 'user' | 'system' | 'data' | 'security';
  description: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
  affectedResource?: string;
  oldValue?: string;
  newValue?: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditFilter {
  category: string;
  status: string;
  severity: string;
  userId: string;
  dateRange: string;
  action: string;
}

const AuditTrailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AuditFilter>({
    category: 'all',
    status: 'all',
    severity: 'all',
    userId: 'all',
    dateRange: 'all',
    action: 'all'
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock audit log data
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 'AUD001',
      timestamp: '2024-01-15T10:30:15Z',
      userId: 'admin001',
      userName: 'Admin User',
      action: 'PAYROLL_PROCESSED',
      category: 'payroll',
      description: 'Processed payroll for January 2024 - 52 employees',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: 'payroll_batch_jan_2024',
      sessionId: 'sess_abc123',
      severity: 'high'
    },
    {
      id: 'AUD002',
      timestamp: '2024-01-15T09:45:22Z',
      userId: 'hr001',
      userName: 'HR Manager',
      action: 'ADVANCE_APPROVED',
      category: 'payroll',
      description: 'Approved advance request ADV002 for Rajesh Kumar',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: 'advance_ADV002',
      oldValue: 'pending',
      newValue: 'approved',
      sessionId: 'sess_def456',
      severity: 'medium'
    },
    {
      id: 'AUD003',
      timestamp: '2024-01-15T08:20:10Z',
      userId: 'system',
      userName: 'System',
      action: 'ATTENDANCE_SYNC',
      category: 'system',
      description: 'Synchronized attendance data from biometric system',
      ipAddress: '192.168.1.50',
      userAgent: 'System/1.0',
      status: 'success',
      affectedResource: 'attendance_data',
      sessionId: 'sess_sys001',
      severity: 'low'
    },
    {
      id: 'AUD004',
      timestamp: '2024-01-15T07:15:33Z',
      userId: 'finance001',
      userName: 'Finance Manager',
      action: 'SALARY_UPDATED',
      category: 'data',
      description: 'Updated salary for employee EMP001 - Rajesh Kumar',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: 'employee_EMP001',
      oldValue: '₹45,000',
      newValue: '₹50,000',
      sessionId: 'sess_ghi789',
      severity: 'high'
    },
    {
      id: 'AUD005',
      timestamp: '2024-01-14T16:45:18Z',
      userId: 'admin001',
      userName: 'Admin User',
      action: 'LOGIN_FAILED',
      category: 'security',
      description: 'Failed login attempt - incorrect password',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'failed',
      sessionId: 'sess_failed001',
      severity: 'medium'
    },
    {
      id: 'AUD006',
      timestamp: '2024-01-14T14:30:25Z',
      userId: 'hr001',
      userName: 'HR Manager',
      action: 'EMPLOYEE_CREATED',
      category: 'user',
      description: 'Created new employee record for John Doe',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: 'employee_EMP052',
      sessionId: 'sess_jkl012',
      severity: 'medium'
    },
    {
      id: 'AUD007',
      timestamp: '2024-01-14T12:15:40Z',
      userId: 'system',
      userName: 'System',
      action: 'BACKUP_COMPLETED',
      category: 'system',
      description: 'Daily database backup completed successfully',
      ipAddress: '192.168.1.50',
      userAgent: 'System/1.0',
      status: 'success',
      affectedResource: 'database_backup',
      sessionId: 'sess_sys002',
      severity: 'low'
    },
    {
      id: 'AUD008',
      timestamp: '2024-01-14T10:20:55Z',
      userId: 'finance001',
      userName: 'Finance Manager',
      action: 'REPORT_GENERATED',
      category: 'data',
      description: 'Generated monthly payroll report for December 2023',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: 'report_dec_2023',
      sessionId: 'sess_mno345',
      severity: 'low'
    },
    {
      id: 'AUD009',
      timestamp: '2024-01-13T15:45:12Z',
      userId: 'admin001',
      userName: 'Admin User',
      action: 'PERMISSION_CHANGED',
      category: 'security',
      description: 'Updated user permissions for HR Manager',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: 'user_hr001',
      oldValue: 'read_only',
      newValue: 'read_write',
      sessionId: 'sess_pqr678',
      severity: 'critical'
    },
    {
      id: 'AUD010',
      timestamp: '2024-01-13T11:30:08Z',
      userId: 'hr001',
      userName: 'HR Manager',
      action: 'BULK_IMPORT',
      category: 'data',
      description: 'Imported 25 employee records from CSV file',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'warning',
      affectedResource: 'employee_bulk_import',
      sessionId: 'sess_stu901',
      severity: 'medium'
    }
  ]);

  const filteredLogs = useMemo(() => {
    let filtered = auditLogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.affectedResource?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    // User filter
    if (filters.userId !== 'all') {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    // Action filter
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [auditLogs, searchTerm, filters]);

  const auditStats = useMemo(() => {
    const total = auditLogs.length;
    const successful = auditLogs.filter(log => log.status === 'success').length;
    const failed = auditLogs.filter(log => log.status === 'failed').length;
    const warnings = auditLogs.filter(log => log.status === 'warning').length;
    const critical = auditLogs.filter(log => log.severity === 'critical').length;
    const high = auditLogs.filter(log => log.severity === 'high').length;
    const securityEvents = auditLogs.filter(log => log.category === 'security').length;

    return { total, successful, failed, warnings, critical, high, securityEvents };
  }, [auditLogs]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payroll': return <FileText className="h-5 w-5" />;
      case 'user': return <User className="h-5 w-5" />;
      case 'system': return <Activity className="h-5 w-5" />;
      case 'data': return <Edit className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payroll': return 'bg-green-100 text-green-700';
      case 'user': return 'bg-blue-100 text-blue-700';
      case 'system': return 'bg-purple-100 text-purple-700';
      case 'data': return 'bg-yellow-100 text-yellow-700';
      case 'security': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.userId, name: log.userName })))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

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
                  <span className="text-blue-200 text-sm font-medium">Audit Trail • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Audit Trail</h1>
                <p className="text-xl text-blue-100">Track and monitor all system activities</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                  <Download className="h-4 w-4" />
                  <span>Export Logs</span>
                </button>
                <div className="flex items-center space-x-2 text-blue-100 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Security Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-white">{auditStats.total}</p>
                <p className="text-sm text-blue-200 mt-1">{auditStats.successful} successful</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Failed Events</p>
                <p className="text-3xl font-bold text-white">{auditStats.failed}</p>
                <p className="text-sm text-red-200 mt-1">{auditStats.warnings} warnings</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Security Events</p>
                <p className="text-3xl font-bold text-white">{auditStats.securityEvents}</p>
                <p className="text-sm text-purple-200 mt-1">{auditStats.critical} critical</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">High Priority</p>
                <p className="text-3xl font-bold text-white">{auditStats.high + auditStats.critical}</p>
                <p className="text-sm text-orange-200 mt-1">Requires attention</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="payroll">Payroll</option>
              <option value="user">User</option>
              <option value="system">System</option>
              <option value="data">Data</option>
              <option value="security">Security</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
            
            <select
              value={filters.severity}
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={filters.userId}
              onChange={(e) => setFilters({...filters, userId: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            
            <select
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action.replace('_', ' ')}</option>
              ))}
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Audit Logs</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Severity</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <User className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{log.userName}</div>
                          <div className="text-xs text-gray-500">{log.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{log.action.replace('_', ' ')}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{log.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(log.status)}
                        <span className="text-sm capitalize">{log.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}></div>
                        <span className="text-sm capitalize">{log.severity}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No audit logs found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Audit Log Details Modal */}
        {showDetailsModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Audit Log Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Log ID</label>
                    <p className="text-lg font-semibold text-blue-600">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                    <p className="text-lg text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <p className="text-lg text-gray-900">{selectedLog.userName} ({selectedLog.userId})</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedLog.action.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedLog.category)}`}>
                      {getCategoryIcon(selectedLog.category)}
                      <span className="capitalize">{selectedLog.category}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedLog.status)}
                      <span className="text-lg capitalize">{selectedLog.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedLog.severity)}`}></div>
                      <span className="text-lg capitalize">{selectedLog.severity}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                    <p className="text-lg text-gray-900 font-mono">{selectedLog.ipAddress}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{selectedLog.description}</p>
                </div>
                
                {selectedLog.affectedResource && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affected Resource</label>
                    <p className="text-gray-900 bg-blue-50 p-4 rounded-xl font-mono">{selectedLog.affectedResource}</p>
                  </div>
                )}
                
                {(selectedLog.oldValue || selectedLog.newValue) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedLog.oldValue && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Value</label>
                        <p className="text-gray-900 bg-red-50 p-4 rounded-xl font-mono">{selectedLog.oldValue}</p>
                      </div>
                    )}
                    {selectedLog.newValue && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
                        <p className="text-gray-900 bg-green-50 p-4 rounded-xl font-mono">{selectedLog.newValue}</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedLog.sessionId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Agent</label>
                    <p className="text-gray-900 text-sm truncate">{selectedLog.userAgent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrailPage;