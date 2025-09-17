import React, { useState, useMemo } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  University,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  Send,
  Eye,
  Download
} from 'lucide-react';
import { PaymentCalculationResult } from '../../utils/paymentCalculations';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPayments: PaymentCalculationResult[];
  onProcessPayments: (payments: PaymentCalculationResult[], method: string) => void;
}

type PaymentMethod = 'bank_transfer' | 'upi' | 'cash' | 'mixed';

const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  isOpen,
  onClose,
  selectedPayments,
  onProcessPayments
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bank_transfer');
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notes, setNotes] = useState('');

  // Calculate totals
  const totals = useMemo(() => {
    const totalAmount = selectedPayments.reduce((sum, payment) => sum + payment.netPay, 0);
    const totalWorkers = selectedPayments.length;
    const bankTransfers = selectedPayments.filter(p => p.paymentMethod === 'bank_transfer').length;
    const upiPayments = selectedPayments.filter(p => p.paymentMethod === 'upi').length;
    const cashPayments = selectedPayments.filter(p => p.paymentMethod === 'cash').length;
    
    return {
      totalAmount,
      totalWorkers,
      bankTransfers,
      upiPayments,
      cashPayments
    };
  }, [selectedPayments]);

  const handleProcessPayments = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onProcessPayments(selectedPayments, selectedMethod);
    setProcessing(false);
    setShowConfirmation(false);
    onClose();
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'bank_transfer':
        return <University className="w-5 h-5" />;
      case 'upi':
        return <Smartphone className="w-5 h-5" />;
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      case 'mixed':
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodColor = (method: PaymentMethod) => {
    switch (method) {
      case 'bank_transfer':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'upi':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cash':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'mixed':
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Process Batch Payments</h2>
                <p className="text-blue-100">
                  {totals.totalWorkers} workers • ₹{totals.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {!showConfirmation ? (
            <>
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-900">₹{totals.totalAmount.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Workers</p>
                      <p className="text-2xl font-bold text-green-900">{totals.totalWorkers}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Bank Transfers</p>
                      <p className="text-2xl font-bold text-purple-900">{totals.bankTransfers}</p>
                    </div>
                    <University className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">UPI Payments</p>
                      <p className="text-2xl font-bold text-orange-900">{totals.upiPayments}</p>
                    </div>
                    <Smartphone className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['bank_transfer', 'upi', 'cash', 'mixed'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedMethod(method)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getPaymentMethodIcon(method)}
                        <span className="text-sm font-medium capitalize">
                          {method.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {selectedPayments.map((payment) => (
                      <div key={payment.workerId} className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {payment.profilePicture ? (
                            <img
                              src={payment.profilePicture}
                              alt={payment.workerName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {payment.workerName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{payment.workerName}</p>
                            <p className="text-sm text-gray-500">{payment.workerRole}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{payment.netPay.toLocaleString()}</p>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getPaymentMethodColor(payment.paymentMethod as PaymentMethod)
                          }`}>
                            {getPaymentMethodIcon(payment.paymentMethod as PaymentMethod)}
                            <span className="ml-1 capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes for this batch payment..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Process Payments</span>
                </button>
              </div>
            </>
          ) : (
            /* Confirmation Screen */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Payment Processing</h3>
              <p className="text-gray-600 mb-6">
                You are about to process payments for {totals.totalWorkers} workers totaling ₹{totals.totalAmount.toLocaleString()}.
                This action cannot be undone.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-800">Important:</p>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Ensure sufficient balance in payment accounts</li>
                      <li>• Verify all worker bank details are correct</li>
                      <li>• Payment notifications will be sent to workers</li>
                      <li>• Transaction records will be logged for audit</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleProcessPayments}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm & Process</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingModal;