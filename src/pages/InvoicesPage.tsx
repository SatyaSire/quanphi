import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetInvoicesQuery,
  // useDeleteInvoiceMutation, // Not available in apiService
  useSendInvoiceMutation
} from '../api/apiService';
// TODO: Temporarily commented out due to import issues
// import { Invoice } from '../types/api';
import DataTable from '../components/common/DataTable';
import { LoadingState } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/Modal';
import {
  PlusIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    clientId: '',
    dateFrom: '',
    dateTo: ''
  });
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<Invoice | null>(null);

  const {
    data: invoicesData,
    isLoading,
    error
  } = useGetInvoicesQuery(queryParams);

  const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();
  const [sendInvoice, { isLoading: isSending }] = useSendInvoiceMutation();

  const handleDelete = async () => {
    if (!deletingInvoice) return;
    try {
      await deleteInvoice(deletingInvoice.id).unwrap();
      setDeletingInvoice(null);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  const handleSend = async () => {
    if (!sendingInvoice) return;
    try {
      await sendInvoice(sendingInvoice.id).unwrap();
      setSendingInvoice(null);
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      sent: { color: 'bg-blue-100 text-blue-800', label: 'Sent' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      sortable: true,
      render: (invoice: Invoice) => (
        <div className="flex items-center">
          <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
        </div>
      )
    },
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (invoice: Invoice) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{invoice.client.name}</div>
          <div className="text-sm text-gray-500">{invoice.client.email}</div>
        </div>
      )
    },
    {
      key: 'project',
      label: 'Project',
      render: (invoice: Invoice) => (
        invoice.project ? (
          <span className="text-sm text-gray-900">{invoice.project.name}</span>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (invoice: Invoice) => (
        <div className="text-sm font-medium text-gray-900">
          ${invoice.amount.toLocaleString()}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (invoice: Invoice) => getStatusBadge(invoice.status)
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (invoice: Invoice) => (
        <span className="text-sm text-gray-900">
          {new Date(invoice.dueDate).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (invoice: Invoice) => (
        <span className="text-sm text-gray-500">
          {new Date(invoice.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  const rowActions = [
    {
      label: 'View',
      icon: EyeIcon,
      onClick: (invoice: Invoice) => navigate(`/invoices/${invoice.id}`)
    },
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: (invoice: Invoice) => navigate(`/invoices/${invoice.id}/edit`),
      show: (invoice: Invoice) => invoice.status === 'draft'
    },
    {
      label: 'Send',
      icon: PaperAirplaneIcon,
      onClick: (invoice: Invoice) => setSendingInvoice(invoice),
      show: (invoice: Invoice) => invoice.status === 'draft'
    },
    {
      label: 'Record Payment',
      icon: CurrencyDollarIcon,
      onClick: (invoice: Invoice) => navigate(`/invoices/${invoice.id}/payment`),
      show: (invoice: Invoice) => ['sent', 'overdue'].includes(invoice.status)
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: (invoice: Invoice) => setDeletingInvoice(invoice),
      className: 'text-red-600 hover:text-red-900',
      show: (invoice: Invoice) => invoice.status === 'draft'
    }
  ];

  const bulkActions = [
    {
      label: 'Send Selected',
      onClick: (selectedIds: string[]) => {
        // Handle bulk send
        console.log('Send invoices:', selectedIds);
      }
    },
    {
      label: 'Delete Selected',
      onClick: (selectedIds: string[]) => {
        // Handle bulk delete
        console.log('Delete invoices:', selectedIds);
      },
      className: 'text-red-600 hover:text-red-900'
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date' as const
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date' as const
    }
  ];

  if (isLoading) return <LoadingState />;
  if (error) return <div className="p-6 text-red-600">Error loading invoices</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage invoices and track payments
          </p>
        </div>
        <button
          onClick={() => navigate('/invoices/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Invoices</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {invoicesData?.pagination.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Paid Amount</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${invoicesData?.summary?.paidAmount?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Amount</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${invoicesData?.summary?.pendingAmount?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue Amount</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${invoicesData?.summary?.overdueAmount?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={invoicesData?.data || []}
        columns={columns}
        pagination={invoicesData?.pagination}
        onPaginationChange={(page, limit) => setQueryParams({ ...queryParams, page, limit })}
        onSortChange={(sortBy, sortOrder) => setQueryParams({ ...queryParams, sortBy, sortOrder })}
        onSearchChange={(search) => setQueryParams({ ...queryParams, search, page: 1 })}
        onFilterChange={(filters) => setQueryParams({ ...queryParams, ...filters, page: 1 })}
        rowActions={rowActions}
        bulkActions={bulkActions}
        selectedRows={selectedInvoices}
        onSelectionChange={setSelectedInvoices}
        filters={filters}
        searchPlaceholder="Search invoices..."
      />

      {/* Send Invoice Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sendingInvoice}
        onClose={() => setSendingInvoice(null)}
        onConfirm={handleSend}
        title="Send Invoice"
        message={`Are you sure you want to send invoice ${sendingInvoice?.invoiceNumber} to ${sendingInvoice?.client.name}?`}
        confirmText="Send Invoice"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
        isLoading={isSending}
        icon={<PaperAirplaneIcon className="h-6 w-6 text-blue-600" />}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingInvoice}
        onClose={() => setDeletingInvoice(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${deletingInvoice?.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />}
      />
    </div>
  );
};

export default InvoicesPage;