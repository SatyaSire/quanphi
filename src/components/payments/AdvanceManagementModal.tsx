import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  DollarSign,
  Calendar,
  User,
  Save,
  AlertCircle,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2
} from 'lucide-react';

interface AdvanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  amount: number;
  reason: string;
  requestDate: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'partially_recovered' | 'fully_recovered';
  recoveredAmount: number;
  installments: AdvanceInstallment[];
  approvedBy?: string;
}

interface AdvanceInstallment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface AdvanceManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  workerId?: string;
  workerName?: string;
}

const AdvanceManagementModal: React.FC<AdvanceManagementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  workerId,
  workerName
}) => {
  const [activeTab, setActiveTab] = useState<'request' | 'history' | 'recovery'>('request');
  const [advances, setAdvances] = useState<AdvanceRecord[]>([
    {
      id: '1',
      workerId: '1',
      workerName: 'Rajesh Kumar',
      amount: 15000,
      reason: 'Medical emergency',
      requestDate: '2024-01-15',
      approvalDate: '2024-01-16',
      status: 'partially_recovered',
      recoveredAmount: 5000,
      installments: [
        { id: '1', amount: 5000, dueDate: '2024-02-01', paidDate: '2024-02-01', status: 'paid' },
        { id: '2', amount: 5000, dueDate: '2024-03-01', status: 'pending' },
        { id: '3', amount: 5000, dueDate: '2024-04-01', status: 'pending' }
      ],
      approvedBy: 'HR Manager'
    },
    {
      id: '2',
      workerId: '2',
      workerName: 'Priya Sharma',
      amount: 8000,
      reason: 'Festival expenses',
      requestDate: '2024-02-10',
      status: 'pending',
      recoveredAmount: 0,
      installments: []
    }
  ]);

  const [newAdvance, setNewAdvance] = useState({
    workerId: workerId || '',
    workerName: workerName || '',
    amount: 0,
    reason: '',
    installmentCount: 3,
    startDate: ''
  });

  const [selectedAdvance, setSelectedAdvance] = useState<AdvanceRecord | null>(null);

  const handleRequestAdvance = () => {
    if (newAdvance.amount > 0 && newAdvance.reason && newAdvance.workerId) {
      const advance: AdvanceRecord = {
        id: Date.now().toString(),
        workerId: newAdvance.workerId,
        workerName: newAdvance.workerName,
        amount: newAdvance.amount,
        reason: newAdvance.reason,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        recoveredAmount: 0,
        installments: generateInstallments(newAdvance.amount, newAdvance.installmentCount, newAdvance.startDate)
      };
      setAdvances([...advances, advance]);
      setNewAdvance({
        workerId: workerId || '',
        workerName: workerName || '',
        amount: 0,
        reason: '',
        installmentCount: 3,
        startDate: ''
      });
    }
  };

  const generateInstallments = (totalAmount: number, count: number, startDate: string): AdvanceInstallment[] => {
    const installmentAmount = Math.ceil(totalAmount / count);
    const installments: AdvanceInstallment[] = [];
    const start = new Date(startDate || new Date());
    
    for (let i = 0; i < count; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      
      installments.push({
        id: `${Date.now()}-${i}`,
        amount: i === count - 1 ? totalAmount - (installmentAmount * (count - 1)) : installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending'
      });
    }
    
    return installments;
  };

  const handleApproveAdvance = (advanceId: string) => {
    setAdvances(advances.map(advance => 
      advance.id === advanceId 
        ? { ...advance, status: 'approved' as const, approvalDate: new Date().toISOString().split('T')[0], approvedBy: 'Current User' }
        : advance
    ));
  };

  const handleRejectAdvance = (advanceId: string) => {
    setAdvances(advances.map(advance => 
      advance.id === advanceId 
        ? { ...advance, status: 'rejected' as const }
        : advance
    ));
  };

  const handleMarkInstallmentPaid = (advanceId: string, installmentId: string) => {
    setAdvances(advances.map(advance => {
      if (advance.id === advanceId) {
        const updatedInstallments = advance.installments.map(inst => 
          inst.id === installmentId 
            ? { ...inst, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] }
            : inst
        );
        
        const paidInstallments = updatedInstallments.filter(inst => inst.status === 'paid');
        const recoveredAmount = paidInstallments.reduce((sum, inst) => sum + inst.amount, 0);
        const isFullyRecovered = recoveredAmount >= advance.amount;
        
        return {
          ...advance,
          installments: updatedInstallments,
          recoveredAmount,
          status: isFullyRecovered ? 'fully_recovered' as const : 'partially_recovered' as const
        };
      }
      return advance;
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'partially_recovered': return 'bg-blue-100 text-blue-800';
      case 'fully_recovered': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Advance Management</h2>
                <p className="text-blue-100 mt-1">Manage worker advance payments and recovery</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-8">
            {[
              { id: 'request', label: 'New Request', icon: Plus },
              { id: 'history', label: 'Advance History', icon: Clock },
              { id: 'recovery', label: 'Recovery Tracking', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'request' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request New Advance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Worker Name</label>
                    <input
                      type="text"
                      placeholder="Enter worker name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAdvance.workerName}
                      onChange={(e) => setNewAdvance({...newAdvance, workerName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAdvance.amount || ''}
                      onChange={(e) => setNewAdvance({...newAdvance, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Advance</label>
                    <textarea
                      placeholder="Explain the reason for advance request"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAdvance.reason}
                      onChange={(e) => setNewAdvance({...newAdvance, reason: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recovery Installments</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAdvance.installmentCount}
                      onChange={(e) => setNewAdvance({...newAdvance, installmentCount: parseInt(e.target.value)})}
                    >
                      <option value={1}>1 Month</option>
                      <option value={2}>2 Months</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recovery Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAdvance.startDate}
                      onChange={(e) => setNewAdvance({...newAdvance, startDate: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  onClick={handleRequestAdvance}
                  className="mt-4 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Advance History</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Total Advances: {advances.length}</span>
                </div>
              </div>
              
              {advances.map(advance => (
                <div key={advance.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{advance.workerName}</h4>
                        <p className="text-sm text-gray-600">Requested on {formatDate(advance.requestDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(advance.status)}`}>
                        {advance.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {advance.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveAdvance(advance.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectAdvance(advance.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Advance Amount</span>
                      </div>
                      <p className="text-xl font-bold text-blue-900">{formatCurrency(advance.amount)}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Recovered</span>
                      </div>
                      <p className="text-xl font-bold text-green-900">{formatCurrency(advance.recoveredAmount)}</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Remaining</span>
                      </div>
                      <p className="text-xl font-bold text-orange-900">{formatCurrency(advance.amount - advance.recoveredAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700"><strong>Reason:</strong> {advance.reason}</p>
                    {advance.approvedBy && (
                      <p className="text-sm text-gray-700 mt-1"><strong>Approved by:</strong> {advance.approvedBy}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Recovery Tracking</h3>
              
              {advances.filter(advance => advance.status === 'approved' || advance.status === 'partially_recovered').map(advance => (
                <div key={advance.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{advance.workerName}</h4>
                      <p className="text-sm text-gray-600">Advance: {formatCurrency(advance.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Recovery Progress</p>
                      <p className="font-semibold">{Math.round((advance.recoveredAmount / advance.amount) * 100)}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Installment Schedule</h5>
                    {advance.installments.map(installment => (
                      <div key={installment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(installment.status)}
                          <div>
                            <p className="font-medium text-gray-900">{formatCurrency(installment.amount)}</p>
                            <p className="text-sm text-gray-600">Due: {formatDate(installment.dueDate)}</p>
                            {installment.paidDate && (
                              <p className="text-sm text-green-600">Paid: {formatDate(installment.paidDate)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                            {installment.status.toUpperCase()}
                          </span>
                          {installment.status === 'pending' && (
                            <button
                              onClick={() => handleMarkInstallmentPaid(advance.id, installment.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onSave({ advances })}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvanceManagementModal;