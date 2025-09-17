import React, { useState } from 'react';
import { useGetInvoicesQuery } from '../../api/apiService';
import { LoadingState } from '../common/LoadingSpinner';
import PaymentRecordModal from '../payments/PaymentRecordModal';
import {
  EyeIcon,
  PaperAirplaneIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  project: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  dueDate: string;
  total: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue';
  createdAt: string;
}

interface InvoiceListProps {
  clientId?: string;
  projectId?: string;
  showFilters?: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  clientId,
  projectId,
  showFilters = true
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agingFilter, setAgingFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: invoices = [], isLoading, error } = useGetInvoicesQuery({
    clientId,
    projectId,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    aging: agingFilter !== 'all' ? agingFilter : undefined
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'sent':
        return <PaperAirplaneIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgingBucket = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'current';
    if (diffDays <= 30) return '0-30';
    if (diffDays <= 60) return '31-60';
    if (diffDays <= 90) return '61-90';
    return '90+';
  };

  const getAgingColor = (bucket: string) => {
    switch (bucket) {
      case 'current':
        return 'text-green-600';
      case '0-30':
        return 'text-yellow-600';
      case '31-60':
        return 'text-orange-600';
      case '61-90':
        return 'text-red-600';
      case '90+':
        return 'text-red-800 font-bold';
      default:
        return 'text-gray-600';
    }
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      // This would call the send invoice API
      console.log('Sending invoice:', invoiceId);
      // await sendInvoice(invoiceId).unwrap();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    // This would open the invoice in a new tab or modal
    window.open(`/invoices/${invoiceId}/pdf`, '_blank');
  };

  const agingBuckets = {
    current: invoices.filter(inv => getAgingBucket(inv.dueDate) === 'current'),
    '0-30': invoices.filter(inv => getAgingBucket(inv.dueDate) === '0-30'),
    '31-60': invoices.filter(inv => getAgingBucket(inv.dueDate) === '31-60'),
    '61-90': invoices.filter(inv => getAgingBucket(inv.dueDate) === '61-90'),
    '90+': invoices.filter(inv => getAgingBucket(inv.dueDate) === '90+')
  };

  const totalOutstanding = invoices.reduce((sum, inv) => {
    if (inv.status !== 'paid') {
      return sum + (inv.total - inv.paidAmount);
    }
    return sum;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading invoices</h3>
        <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">Total Outstanding</div>
          <div className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</div>
        </div>
        
        {Object.entries(agingBuckets).map(([bucket, bucketInvoices]) => {
          const bucketTotal = bucketInvoices.reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
          return (
            <div key={bucket} className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-600">
                {bucket === 'current' ? 'Current' : `${bucket} days`}
              </div>
              <div className={`text-lg font-semibold ${getAgingColor(bucket)}`}>
                ${bucketTotal.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {bucketInvoices.length} invoice{bucketInvoices.length !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aging
            </label>
            <select
              value={agingFilter}
              onChange={(e) => setAgingFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Ages</option>
              <option value="current">Current</option>
              <option value="0-30">0-30 days</option>
              <option value="31-60">31-60 days</option>
              <option value="61-90">61-90 days</option>
              <option value="90+">90+ days</option>
            </select>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const agingBucket = getAgingBucket(invoice.dueDate);
                const remainingAmount = invoice.total - invoice.paidAmount;
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${getAgingColor(agingBucket)}`}>
                        {agingBucket === 'current' ? 'Current' : `${agingBucket} days overdue`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${invoice.total.toFixed(2)}
                      </div>
                      {invoice.paidAmount > 0 && (
                        <div className="text-xs text-green-600">
                          Paid: ${invoice.paidAmount.toFixed(2)}
                        </div>
                      )}
                      {remainingAmount > 0 && (
                        <div className="text-xs text-red-600">
                          Due: ${remainingAmount.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Invoice"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {invoice.status !== 'paid' && (
                          <>
                            <button
                              onClick={() => handleSendInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Send Invoice"
                            >
                              <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleRecordPayment(invoice)}
                              className="text-green-600 hover:text-green-900"
                              title="Record Payment"
                            >
                              <CurrencyDollarIcon className="h-4 w-4" />
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
        
        {invoices.length === 0 && (
          <div className="text-center py-8">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter !== 'all' || agingFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Create your first invoice to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Payment Recording Modal */}
      {selectedInvoice && (
        <PaymentRecordModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
};

export default InvoiceList;