import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Search, Filter, DollarSign, Calendar, User, CheckCircle, XCircle, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';

interface Advance {
  id: string;
  workerId: string;
  amount: number;
  requestDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  installments?: number;
  remainingAmount?: number;
  notes?: string;
}

interface AdvanceFilter {
  status: string;
  department: string;
  dateRange: string;
  amountRange: string;
}

const AdvancesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AdvanceFilter>({
    status: 'all',
    department: 'all',
    dateRange: 'all',
    amountRange: 'all'
  });

  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock advance data
  const [advances, setAdvances] = useState<Advance[]>([
    {
      id: 'ADV001',
      workerId: '1',
      amount: 25000,
      requestDate: '2024-01-15',
      reason: 'Medical emergency',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvedDate: '2024-01-16',
      installments: 5,
      remainingAmount: 15000,
      notes: 'Approved for medical treatment'
    },
    {
      id: 'ADV002',
      workerId: '2',
      amount: 15000,
      requestDate: '2024-01-14',
      reason: 'Home renovation',
      status: 'pending',
      installments: 3
    },
    {
      id: 'ADV003',
      workerId: '3',
      amount: 30000,
      requestDate: '2024-01-12',
      reason: 'Education expenses',
      status: 'paid',
      approvedBy: 'Finance Manager',
      approvedDate: '2024-01-13',
      paidDate: '2024-01-14',
      installments: 6,
      remainingAmount: 25000
    },
    {
      id: 'ADV004',
      workerId: '4',
      amount: 8000,
      requestDate: '2024-01-10',
      reason: 'Personal emergency',
      status: 'rejected',
      notes: 'Insufficient documentation provided'
    }
  ]);

  const activeWorkers = workersData.filter(worker => worker.status === 'active');
  const departments = [...new Set(activeWorkers.map(worker => worker.department))];

  const filteredAdvances = useMemo(() => {
    let filtered = advances;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(advance => {
        const worker = activeWorkers.find(w => w.id === advance.workerId);
        return (
          advance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advance.reason.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(advance => advance.status === filters.status);
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(advance => {
        const worker = activeWorkers.find(w => w.id === advance.workerId);
        return worker?.department === filters.department;
      });
    }

    // Amount range filter
    if (filters.amountRange !== 'all') {
      filtered = filtered.filter(advance => {
        switch (filters.amountRange) {
          case 'low': return advance.amount <= 10000;
          case 'medium': return advance.amount > 10000 && advance.amount <= 25000;
          case 'high': return advance.amount > 25000;
          default: return true;
        }
      });
    }

    return filtered;
  }, [advances, searchTerm, filters, activeWorkers]);

  const advanceStats = useMemo(() => {
    const totalAdvances = advances.length;
    const pendingAdvances = advances.filter(a => a.status === 'pending').length;
    const approvedAdvances = advances.filter(a => a.status === 'approved' || a.status === 'paid').length;
    const totalAmount = advances.reduce((sum, a) => sum + a.amount, 0);
    const pendingAmount = advances.filter(a => a.status === 'pending').reduce((sum, a) => sum + a.amount, 0);
    const outstandingAmount = advances.filter(a => a.status === 'approved' || a.status === 'paid').reduce((sum, a) => sum + (a.remainingAmount || 0), 0);
    const approvedAmount = advances.filter(a => a.status === 'approved' || a.status === 'paid').reduce((sum, a) => sum + a.amount, 0);
    const monthlyAdvances = advances.filter(a => {
      const advanceDate = new Date(a.requestDate);
      const currentDate = new Date();
      return advanceDate.getMonth() === currentDate.getMonth() && advanceDate.getFullYear() === currentDate.getFullYear();
    }).length;
    const monthlyAmount = advances.filter(a => {
      const advanceDate = new Date(a.requestDate);
      const currentDate = new Date();
      return advanceDate.getMonth() === currentDate.getMonth() && advanceDate.getFullYear() === currentDate.getFullYear();
    }).reduce((sum, a) => sum + a.amount, 0);

    return {
      totalAdvances,
      pendingAdvances,
      approvedAdvances,
      totalAmount,
      pendingAmount,
      outstandingAmount,
      approvedAmount,
      monthlyAdvances,
      monthlyAmount
    };
  }, [advances]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'paid': return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApproveAdvance = (advanceId: string) => {
    setAdvances(prev => prev.map(advance => 
      advance.id === advanceId 
        ? { ...advance, status: 'approved', approvedBy: 'Current User', approvedDate: new Date().toISOString().split('T')[0] }
        : advance
    ));
  };

  const handleRejectAdvance = (advanceId: string) => {
    setAdvances(prev => prev.map(advance => 
      advance.id === advanceId 
        ? { ...advance, status: 'rejected' }
        : advance
    ));
  };

  const handleViewDetails = (advance: Advance) => {
    setSelectedAdvance(advance);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Top Left */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/payments')}
            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white">Advance Management</h1>
                      <p className="text-xl text-blue-100 mt-2">Manage employee advance requests and payments</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Advance Management</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate('/advances/new')}
                  className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  New Advance
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Advances</p>
                <p className="text-3xl font-bold mt-2">{advanceStats.totalAdvances}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">₹{advanceStats.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Approved Today</p>
                <p className="text-3xl font-bold mt-2">{advanceStats.approvedAdvances}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">₹{advanceStats.approvedAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold mt-2">{advanceStats.monthlyAdvances}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">₹{advanceStats.monthlyAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Approval</p>
                <p className="text-3xl font-bold mt-2">{advanceStats.pendingAdvances}</p>
                <div className="flex items-center mt-2 text-yellow-100">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">₹{advanceStats.pendingAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Clock className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search advances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={filters.amountRange}
                onChange={(e) => setFilters({...filters, amountRange: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Amounts</option>
                <option value="low">≤ ₹10,000</option>
                <option value="medium">₹10,001 - ₹25,000</option>
                <option value="high">&gt; ₹25,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advances Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Advance Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Advance ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Employee</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Reason</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Request Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvances.map((advance) => {
                  const worker = activeWorkers.find(w => w.id === advance.workerId);
                  return (
                    <tr key={advance.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-blue-600">{advance.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{worker?.name}</div>
                            <div className="text-sm text-gray-500">{worker?.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">₹{advance.amount.toLocaleString()}</div>
                        {advance.remainingAmount && (
                          <div className="text-sm text-gray-500">₹{advance.remainingAmount.toLocaleString()} remaining</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-700">{advance.reason}</td>
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(advance.requestDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(advance.status)}`}>
                          {getStatusIcon(advance.status)}
                          <span className="capitalize">{advance.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(advance)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {advance.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveAdvance(advance.id)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectAdvance(advance.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredAdvances.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No advances found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Advance Details Modal */}
        {showDetailsModal && selectedAdvance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Advance Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Advance ID</label>
                    <p className="text-lg font-semibold text-blue-600">{selectedAdvance.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {activeWorkers.find(w => w.id === selectedAdvance.workerId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <p className="text-lg font-semibold text-gray-900">₹{selectedAdvance.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAdvance.status)}`}>
                      {getStatusIcon(selectedAdvance.status)}
                      <span className="capitalize">{selectedAdvance.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                    <p className="text-lg text-gray-900">{new Date(selectedAdvance.requestDate).toLocaleDateString()}</p>
                  </div>
                  {selectedAdvance.installments && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Installments</label>
                      <p className="text-lg text-gray-900">{selectedAdvance.installments} months</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{selectedAdvance.reason}</p>
                </div>
                
                {selectedAdvance.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{selectedAdvance.notes}</p>
                  </div>
                )}
                
                {selectedAdvance.approvedBy && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                      <p className="text-lg text-gray-900">{selectedAdvance.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approved Date</label>
                      <p className="text-lg text-gray-900">{selectedAdvance.approvedDate && new Date(selectedAdvance.approvedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancesPage;