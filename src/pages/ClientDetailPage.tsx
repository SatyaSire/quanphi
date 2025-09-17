import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import {
//   useGetClientQuery,
//   useGetClientProjectsQuery,
//   useGetClientInvoicesQuery,
//   useGetClientPaymentsQuery
// } from '../api/apiService'; // Will reconnect when backend is ready
import { LoadingState } from '../components/common/LoadingSpinner';
// import InvoiceList from '../components/invoices/InvoiceList'; // Will reconnect when component is ready
// import PaymentRecordModal from '../components/payments/PaymentRecordModal'; // Will reconnect when component is ready
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getClientById, getClientProjects, getClientInvoices, getClientPayments } from '../data/clientsData';

interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientStats {
  totalProjects: number;
  activeProjects: number;
  totalInvoices: number;
  outstandingAmount: number;
  totalPaid: number;
  openQuotations: number;
  lastActivity: string;
}

const ClientDetailPage: React.FC = () => {
  const { id: clientId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Get client data based on ID
  const client = clientId ? getClientById(clientId) : null;
  const projects = clientId ? getClientProjects(clientId) : [];
  const invoices = clientId ? getClientInvoices(clientId) : [];
  const payments = clientId ? getClientPayments(clientId) : [];

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Client not found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The client you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              to="/clients"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Back to Clients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const clientLoading = false;
  const clientError = null;
  const projectsLoading = false;
  const invoicesLoading = false;
  const paymentsLoading = false;

  // Calculate client statistics
  const stats: ClientStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalInvoices: invoices.length,
    outstandingAmount: invoices.reduce((sum, inv) => {
      if (inv.status !== 'paid') {
        return sum + (inv.total - inv.paidAmount);
      }
      return sum;
    }, 0),
    totalPaid: payments.reduce((sum, payment) => sum + payment.amount, 0),
    openQuotations: 0, // This would come from quotations API
    lastActivity: Math.max(
      ...projects.map(p => new Date(p.updatedAt).getTime()),
      ...invoices.map(i => new Date(i.createdAt).getTime()),
      ...payments.map(p => new Date(p.createdAt).getTime())
    ).toString()
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'quotations', name: 'Quotations', icon: ClipboardDocumentListIcon },
    { id: 'invoices', name: 'Invoices', icon: DocumentTextIcon },
    { id: 'payments', name: 'Payments', icon: BanknotesIcon },
    { id: 'documents', name: 'Documents', icon: FolderIcon },
    { id: 'notes', name: 'Notes', icon: ChatBubbleLeftRightIcon }
  ];

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (clientLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Client not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The client you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/clients"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }



  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Client Information</h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Contact Person
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{client.primaryContact?.name || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {client.primaryContact?.email ? (
                  <a href={`mailto:${client.primaryContact.email}`} className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    {client.primaryContact.email}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {client.primaryContact?.phone ? (
                  <a href={`tel:${client.primaryContact.phone}`} className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    {client.primaryContact.phone}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                GSTIN
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{client.gstin || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2" />
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {client.addresses?.[0] ? (
                  `${client.addresses[0].addressLine1}, ${client.addresses[0].city}, ${client.addresses[0].state} ${client.addresses[0].pincode}`
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            {client.internalComments && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{client.internalComments}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Projects</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{stats.totalProjects}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Invoices</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{stats.totalInvoices}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Outstanding</dt>
                  <dd className="text-lg font-medium text-red-600 dark:text-red-400">${stats.outstandingAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Paid</dt>
                  <dd className="text-lg font-medium text-green-600 dark:text-green-400">${stats.totalPaid.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Activity</h3>
        </div>
        <div className="px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last activity: {stats.lastActivity ? new Date(parseInt(stats.lastActivity)).toLocaleDateString() : 'No recent activity'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Projects</h3>
        <Link
          to={`/projects/new?clientId=${clientId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Link>
      </div>

      {projectsLoading ? (
        <LoadingState />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project: any) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FolderIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{project.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProjectStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ${project.budget?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          
          {projects.length === 0 && (
            <div className="text-center py-8">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No projects</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new project for this client.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Invoices</h3>
        <Link
          to={`/invoices/new?clientId=${clientId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Invoice
        </Link>
      </div>
      
      {/* <InvoiceList clientId={clientId} showFilters={false} /> */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Invoice List Coming Soon</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Invoice management features will be available when the InvoiceList component is ready.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Payment History</h3>
      </div>

      {paymentsLoading ? (
        <LoadingState />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {payment.invoice?.invoiceNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {payment.method.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.reference || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {payments.length === 0 && (
            <div className="text-center py-8">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No payments</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Payment history will appear here once payments are recorded.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'projects':
        return renderProjectsTab();
      case 'invoices':
        return renderInvoicesTab();
      case 'payments':
        return renderPaymentsTab();
      case 'quotations':
      case 'documents':
      case 'notes':
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This feature is under development.
            </p>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {/* Header Section with improved layout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {/* Back Button - Top Left */}
            <div className="mb-6">
              <Link
                to="/clients"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Clients
              </Link>
            </div>
            
            {/* Client Details Header with Edit Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{client.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      Client since {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                    {client.primaryContact?.name && (
                      <span className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {client.primaryContact.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Edit Button - Right Side */}
              <div className="flex space-x-3">
                <Link
                  to={`/clients/${clientId}/edit`}
                  className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Client
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon
                    className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                    }`}
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Payment Modal - Will be enabled when PaymentRecordModal component is ready */}
      {/* {selectedInvoice && (
        <PaymentRecordModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )} */}
    </div>
  );
};

export default ClientDetailPage;