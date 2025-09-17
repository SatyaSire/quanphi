import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, User, FileText, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';

interface AdvanceForm {
  workerId: string;
  amount: number;
  reason: string;
  requestDate: string;
  expectedRepaymentDate: string;
  notes: string;
}

const NewAdvancePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdvanceForm>({
    workerId: '',
    amount: 0,
    reason: '',
    requestDate: new Date().toISOString().split('T')[0],
    expectedRepaymentDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<AdvanceForm>>({});

  const activeWorkers = workersData.filter(worker => worker.status === 'active');

  const validateForm = (): boolean => {
    const newErrors: Partial<AdvanceForm> = {};
    
    if (!formData.workerId) newErrors.workerId = 'Please select a worker';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Please enter a valid amount';
    if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason';
    if (!formData.expectedRepaymentDate) newErrors.expectedRepaymentDate = 'Please select expected repayment date';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to create the advance
      console.log('Creating advance:', formData);
      
      // Navigate back to advances page
      navigate('/advances');
    } catch (error) {
      console.error('Error creating advance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AdvanceForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedWorker = activeWorkers.find(w => w.id === formData.workerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/advances')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Advances</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-green-200 text-sm font-medium">New Request • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">New Advance Request</h1>
                <p className="text-xl text-green-100">Create a new salary advance request</p>
              </div>
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Worker Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Select Worker
                </label>
                <select
                  value={formData.workerId}
                  onChange={(e) => handleInputChange('workerId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.workerId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a worker...</option>
                  {activeWorkers.map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.department} ({worker.designation})
                    </option>
                  ))}
                </select>
                {errors.workerId && <p className="text-red-500 text-sm mt-1">{errors.workerId}</p>}
                
                {selectedWorker && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Daily Rate:</span>
                        <p className="font-semibold">₹{selectedWorker.dailyRate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <p className="font-semibold">{selectedWorker.department}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-semibold">{selectedWorker.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {selectedWorker.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Advance Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              {/* Request Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Request Date
                </label>
                <input
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) => handleInputChange('requestDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Expected Repayment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Expected Repayment Date
                </label>
                <input
                  type="date"
                  value={formData.expectedRepaymentDate}
                  onChange={(e) => handleInputChange('expectedRepaymentDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.expectedRepaymentDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  min={formData.requestDate}
                />
                {errors.expectedRepaymentDate && <p className="text-red-500 text-sm mt-1">{errors.expectedRepaymentDate}</p>}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Reason for Advance
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select reason...</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Education Expenses">Education Expenses</option>
                  <option value="Home Repair">Home Repair</option>
                  <option value="Festival Expenses">Festival Expenses</option>
                  <option value="Personal Loan Repayment">Personal Loan Repayment</option>
                  <option value="Other">Other</option>
                </select>
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Any additional information or special circumstances..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/advances')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Advance Request'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAdvancePage;