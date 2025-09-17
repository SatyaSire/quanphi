import React, { useState } from 'react';
import { useCreatePaymentMutation } from '../../api/apiService';
import Modal from '../common/Modal';
import { InputField, SelectField, TextAreaField, DateField } from '../common/FormField';
import { LoadingState } from '../common/LoadingSpinner';
import {
  CurrencyDollarIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface PaymentFormData {
  invoiceId: string;
  amount: number;
  method: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card';
  date: string;
  reference: string;
  notes: string;
  receiptFile?: File;
}

interface PaymentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceNumber: string;
    total: number;
    paidAmount: number;
    client: {
      name: string;
    };
  };
}

const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    invoiceId: invoice.id,
    amount: invoice.total - invoice.paidAmount, // Default to remaining amount
    method: 'upi',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
    receiptFile: undefined
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [idempotencyKey] = useState(() => `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();

  const remainingAmount = invoice.total - invoice.paidAmount;
  const isPartialPayment = formData.amount < remainingAmount;
  const isOverpayment = formData.amount > remainingAmount;

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, and PDF files are allowed');
      return;
    }

    setFormData(prev => ({ ...prev, receiptFile: file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, receiptFile: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      alert('Payment amount must be greater than 0');
      return;
    }

    if (formData.amount > remainingAmount && !confirm('This payment exceeds the remaining amount. Continue?')) {
      return;
    }

    try {
      // Simulate file upload progress if receipt is attached
      if (formData.receiptFile) {
        setUploadProgress(0);
        for (let i = 0; i <= 100; i += 20) {
          setUploadProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const paymentData = {
        ...formData,
        idempotencyKey
      };

      await createPayment(paymentData).unwrap();
      
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Failed to record payment:', error);
      setUploadProgress(null);
      
      if (error?.data?.message?.includes('duplicate')) {
        alert('This payment has already been recorded. Please check the payment history.');
      } else {
        alert('Failed to record payment. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceId: invoice.id,
      amount: invoice.total - invoice.paidAmount,
      method: 'upi',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      notes: '',
      receiptFile: undefined
    });
    setUploadProgress(null);
  };

  const getMethodLabel = (method: string) => {
    const labels = {
      cash: 'Cash',
      upi: 'UPI',
      bank_transfer: 'Bank Transfer',
      cheque: 'Cheque',
      card: 'Card'
    };
    return labels[method as keyof typeof labels] || method;
  };

  if (uploadProgress !== null) {
    return (
      <Modal isOpen={isOpen} onClose={() => {}} title="Recording Payment">
        <div className="text-center py-8">
          <LoadingState />
          <p className="mt-4 text-sm text-gray-600">
            {uploadProgress < 100 ? `Uploading receipt... ${uploadProgress}%` : 'Processing payment...'}
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title="Record Payment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Invoice:</span>
              <span className="ml-2 font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Client:</span>
              <span className="ml-2 font-medium">{invoice.client.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <span className="ml-2 font-medium">${invoice.total.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Remaining:</span>
              <span className="ml-2 font-medium text-red-600">${remainingAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputField
              label="Payment Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              min="0.01"
              step="0.01"
              required
            />
            {isPartialPayment && (
              <p className="mt-1 text-xs text-yellow-600">
                This is a partial payment. Remaining: ${(remainingAmount - formData.amount).toFixed(2)}
              </p>
            )}
            {isOverpayment && (
              <p className="mt-1 text-xs text-red-600">
                This exceeds the remaining amount by ${(formData.amount - remainingAmount).toFixed(2)}
              </p>
            )}
          </div>

          <SelectField
            label="Payment Method"
            name="method"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
            required
          >
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="card">Card</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DateField
            label="Payment Date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <InputField
            label="Reference Number"
            name="reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="Transaction ID, Cheque number, etc."
          />
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Receipt (Optional)
          </label>
          
          {!formData.receiptFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop receipt here or click to upload
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PNG, JPG, GIF, PDF up to 10MB
                  </span>
                </label>
                <input
                  id="receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formData.receiptFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(formData.receiptFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <TextAreaField
          label="Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Additional notes about this payment..."
        />

        {/* Payment Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${formData.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium">{getMethodLabel(formData.method)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(formData.date).toLocaleDateString()}</span>
            </div>
            {formData.reference && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium">{formData.reference}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isCreating ? (
              <LoadingState size="sm" />
            ) : (
              <>
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                Record Payment
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentRecordModal;