import React, { useState } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  Settings,
  Plus,
  Minus,
  Save,
  AlertCircle,
  Clock,
  Users,
  Calculator
} from 'lucide-react';

interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'closed';
  totalWorkers: number;
  totalAmount: number;
}

interface Deduction {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  amount: number;
  description: string;
  mandatory: boolean;
}

interface PayrollManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const PayrollManagementModal: React.FC<PayrollManagementModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'periods' | 'deductions' | 'settings'>('periods');
  const [periods, setPeriods] = useState<PayrollPeriod[]>([
    {
      id: '1',
      name: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'closed',
      totalWorkers: 45,
      totalAmount: 450000
    },
    {
      id: '2',
      name: 'February 2024',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      status: 'active',
      totalWorkers: 48,
      totalAmount: 520000
    }
  ]);
  
  const [deductions, setDeductions] = useState<Deduction[]>([
    {
      id: '1',
      name: 'PF Contribution',
      type: 'percentage',
      amount: 12,
      description: 'Provident Fund contribution',
      mandatory: true
    },
    {
      id: '2',
      name: 'ESI',
      type: 'percentage',
      amount: 3.25,
      description: 'Employee State Insurance',
      mandatory: true
    },
    {
      id: '3',
      name: 'Advance Deduction',
      type: 'fixed',
      amount: 5000,
      description: 'Monthly advance deduction',
      mandatory: false
    }
  ]);
  
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  
  const [newDeduction, setNewDeduction] = useState({
    name: '',
    type: 'fixed' as 'fixed' | 'percentage',
    amount: 0,
    description: '',
    mandatory: false
  });

  const handleAddPeriod = () => {
    if (newPeriod.name && newPeriod.startDate && newPeriod.endDate) {
      const period: PayrollPeriod = {
        id: Date.now().toString(),
        ...newPeriod,
        status: 'draft',
        totalWorkers: 0,
        totalAmount: 0
      };
      setPeriods([...periods, period]);
      setNewPeriod({ name: '', startDate: '', endDate: '' });
    }
  };

  const handleAddDeduction = () => {
    if (newDeduction.name && newDeduction.amount > 0) {
      const deduction: Deduction = {
        id: Date.now().toString(),
        ...newDeduction
      };
      setDeductions([...deductions, deduction]);
      setNewDeduction({
        name: '',
        type: 'fixed',
        amount: 0,
        description: '',
        mandatory: false
      });
    }
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Payroll Management</h2>
                <p className="text-blue-100 mt-1">Manage payroll periods and deductions</p>
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
              { id: 'periods', label: 'Payroll Periods', icon: Calendar },
              { id: 'deductions', label: 'Deductions', icon: Calculator },
              { id: 'settings', label: 'Settings', icon: Settings }
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
          {activeTab === 'periods' && (
            <div className="space-y-6">
              {/* Add New Period */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Payroll Period</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period Name</label>
                    <input
                      type="text"
                      placeholder="e.g., March 2024"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newPeriod.name}
                      onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newPeriod.startDate}
                      onChange={(e) => setNewPeriod({...newPeriod, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newPeriod.endDate}
                      onChange={(e) => setNewPeriod({...newPeriod, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddPeriod}
                  className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </button>
              </div>

              {/* Existing Periods */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Payroll Periods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {periods.map(period => (
                    <div key={period.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{period.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(period.status)}`}>
                          {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{period.startDate} to {period.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{period.totalWorkers} workers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{period.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deductions' && (
            <div className="space-y-6">
              {/* Add New Deduction */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Deduction</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deduction Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Tax Deduction"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newDeduction.name}
                      onChange={(e) => setNewDeduction({...newDeduction, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newDeduction.type}
                      onChange={(e) => setNewDeduction({...newDeduction, type: e.target.value as 'fixed' | 'percentage'})}
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount {newDeduction.type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      placeholder={newDeduction.type === 'percentage' ? '10' : '5000'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newDeduction.amount || ''}
                      onChange={(e) => setNewDeduction({...newDeduction, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newDeduction.description}
                      onChange={(e) => setNewDeduction({...newDeduction, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={newDeduction.mandatory}
                      onChange={(e) => setNewDeduction({...newDeduction, mandatory: e.target.checked})}
                    />
                    <span className="text-sm text-gray-700">Mandatory deduction</span>
                  </label>
                  <button
                    onClick={handleAddDeduction}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deduction
                  </button>
                </div>
              </div>

              {/* Existing Deductions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Deductions</h3>
                <div className="space-y-3">
                  {deductions.map(deduction => (
                    <div key={deduction.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{deduction.name}</h4>
                          {deduction.mandatory && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Mandatory</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{deduction.description}</p>
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          {deduction.type === 'percentage' ? `${deduction.amount}%` : `₹${deduction.amount}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveDeduction(deduction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">Payroll Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Pay Frequency</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Monthly</option>
                        <option>Bi-weekly</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="text-sm text-gray-700">Auto-calculate overtime</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="text-sm text-gray-700">Send payment notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Require approval for bulk payments</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ periods, deductions })}
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

export default PayrollManagementModal;