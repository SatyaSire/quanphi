import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Eye,
  Clock,
  User,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  FileText,
  Filter,
  Download,
  Search,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'process' | 'view';
  entityType: 'payment' | 'advance' | 'payroll' | 'deduction' | 'worker';
  entityId: string;
  entityName: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

interface PaymentAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'create' | 'update' | 'delete' | 'approve' | 'process';
type EntityFilter = 'all' | 'payment' | 'advance' | 'payroll' | 'deduction';
type TimeFilter = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

const PaymentAuditModal: React.FC<PaymentAuditModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<FilterType>('all');
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock audit data
  const auditEntries: AuditEntry[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      userId: 'U001',
      userName: 'Admin User',
      userRole: 'Administrator',
      action: 'process',
      entityType: 'payment',
      entityId: 'PAY001',
      entityName: 'Monthly Salary - January 2024',
      description: 'Processed batch payment for 25 workers totaling ₹2,50,000',
      oldValues: { status: 'pending' },
      newValues: { status: 'processed', processedAt: new Date().toISOString() },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high',
      tags: ['batch-payment', 'salary', 'monthly']
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      userId: 'U002',
      userName: 'HR Manager',
      userRole: 'HR Manager',
      action: 'approve',
      entityType: 'advance',
      entityId: 'ADV001',
      entityName: 'Advance Request - Rajesh Kumar',
      description: 'Approved advance request of ₹5,000 for worker Rajesh Kumar',
      oldValues: { status: 'pending', approvedBy: null },
      newValues: { status: 'approved', approvedBy: 'U002', approvedAt: new Date().toISOString() },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      tags: ['advance', 'approval']
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      userId: 'U001',
      userName: 'Admin User',
      userRole: 'Administrator',
      action: 'update',
      entityType: 'payroll',
      entityId: 'PR001',
      entityName: 'Payroll Period - January 2024',
      description: 'Updated payroll period end date and added overtime calculations',
      oldValues: { endDate: '2024-01-30', overtimeEnabled: false },
      newValues: { endDate: '2024-01-31', overtimeEnabled: true },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      tags: ['payroll', 'configuration']
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      userId: 'U003',
      userName: 'Payroll Officer',
      userRole: 'Payroll Officer',
      action: 'create',
      entityType: 'deduction',
      entityId: 'DED001',
      entityName: 'PF Deduction Rule',
      description: 'Created new deduction rule for Provident Fund (12% of basic salary)',
      newValues: { name: 'PF Deduction', type: 'percentage', rate: 12, mandatory: true },
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      tags: ['deduction', 'pf', 'rule']
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      userId: 'U001',
      userName: 'Admin User',
      userRole: 'Administrator',
      action: 'delete',
      entityType: 'payment',
      entityId: 'PAY000',
      entityName: 'Duplicate Payment Entry',
      description: 'Deleted duplicate payment entry created by system error',
      oldValues: { amount: 15000, workerId: 'W001', status: 'draft' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high',
      tags: ['cleanup', 'duplicate', 'error-correction']
    }
  ];

  if (!isOpen) return null;

  const filteredEntries = useMemo(() => {
    return auditEntries.filter(entry => {
      const matchesSearch = searchTerm === '' || 
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.entityName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
      const matchesEntity = entityFilter === 'all' || entry.entityType === entityFilter;
      
      // Time filter logic would be implemented here
      const matchesTime = true; // Simplified for demo
      
      return matchesSearch && matchesAction && matchesEntity && matchesTime;
    });
  }, [auditEntries, searchTerm, actionFilter, entityFilter, timeFilter]);

  const getActionIcon = (action: AuditEntry['action']) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'approve':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'reject':
        return <X className="h-4 w-4 text-red-600" />;
      case 'process':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'view':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: AuditEntry['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    // Export audit log functionality
    alert('Audit log export functionality would be implemented here');
  };

  const renderValueChanges = (oldValues?: Record<string, any>, newValues?: Record<string, any>) => {
    if (!oldValues && !newValues) return null;

    return (
      <div className="mt-4 space-y-3">
        {oldValues && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Previous Values:</h5>
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <pre className="text-xs text-red-800 whitespace-pre-wrap">
                {JSON.stringify(oldValues, null, 2)}
              </pre>
            </div>
          </div>
        )}
        {newValues && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">New Values:</h5>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <pre className="text-xs text-green-800 whitespace-pre-wrap">
                {JSON.stringify(newValues, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Audit Trail</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Log</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as FilterType)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="approve">Approve</option>
              <option value="process">Process</option>
            </select>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value as EntityFilter)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Entities</option>
              <option value="payment">Payments</option>
              <option value="advance">Advances</option>
              <option value="payroll">Payroll</option>
              <option value="deduction">Deductions</option>
            </select>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Audit List */}
          <div className="w-1/2 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Audit Entries ({filteredEntries.length})
              </h3>
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setShowDetails(true);
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedEntry?.id === entry.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getActionIcon(entry.action)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {entry.entityName}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full border ${
                              getSeverityColor(entry.severity)
                            }`}>
                              {entry.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {entry.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{entry.userName}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(entry.timestamp)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-1/2 overflow-y-auto">
            {selectedEntry ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Audit Details</h3>
                  <span className={`px-3 py-1 text-sm rounded-full border ${
                    getSeverityColor(selectedEntry.severity)
                  }`}>
                    {selectedEntry.severity.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Action:</span>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(selectedEntry.action)}
                          <span className="text-sm font-medium capitalize">{selectedEntry.action}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entity Type:</span>
                        <span className="text-sm font-medium capitalize">{selectedEntry.entityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entity ID:</span>
                        <span className="text-sm font-medium">{selectedEntry.entityId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Timestamp:</span>
                        <span className="text-sm font-medium">{formatTimestamp(selectedEntry.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">User Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">User:</span>
                        <span className="text-sm font-medium">{selectedEntry.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Role:</span>
                        <span className="text-sm font-medium">{selectedEntry.userRole}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IP Address:</span>
                        <span className="text-sm font-medium">{selectedEntry.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-800">{selectedEntry.description}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedEntry.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Value Changes */}
                  {(selectedEntry.oldValues || selectedEntry.newValues) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Data Changes</h4>
                      {renderValueChanges(selectedEntry.oldValues, selectedEntry.newValues)}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Audit Entry</h3>
                  <p className="text-gray-600">Choose an entry from the list to view detailed information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAuditModal;