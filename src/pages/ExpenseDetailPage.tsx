import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft, 
  Receipt, 
  Calendar, 
  DollarSign,
  Building,
  User,
  Tag,
  CreditCard,
  FileText,
  Download,
  Eye,
  Trash2,
  MapPin,
  Paperclip
} from 'lucide-react';
import { mockExpenses, getCategoryById, formatCurrency, getPaymentModeColor } from '../data/expensesData';
import { Expense, PaymentMode, PaidBy } from '../types/expenses';

const ExpenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const foundExpense = mockExpenses.find(exp => exp.id === id);
      if (foundExpense) {
        setExpense(foundExpense);
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleEditExpense = () => {
    navigate(`/expenses/${id}/edit`);
  };

  const handleDeleteExpense = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setActionLoading('delete');
      // Simulate API call
      setTimeout(() => {
        setActionLoading(null);
        navigate('/expenses', {
          state: {
            message: 'Expense deleted successfully',
            type: 'success'
          }
        });
      }, 1000);
    }
  };

  const getPaymentModeDisplay = (mode: PaymentMode): string => {
    const modeMap = {
      [PaymentMode.CASH]: 'Cash',
      [PaymentMode.CREDIT_CARD]: 'Credit Card',
      [PaymentMode.DEBIT_CARD]: 'Debit Card',
      [PaymentMode.BANK_TRANSFER]: 'Bank Transfer',
      [PaymentMode.CHECK]: 'Check',
      [PaymentMode.DIGITAL_WALLET]: 'Digital Wallet',
      [PaymentMode.OTHER]: 'Other'
    };
    return modeMap[mode] || mode;
  };

  const getPaidByDisplay = (paidBy: PaidBy): string => {
    const paidByMap = {
      [PaidBy.COMPANY]: 'Company',
      [PaidBy.EMPLOYEE]: 'Employee',
      [PaidBy.CONTRACTOR]: 'Contractor',
      [PaidBy.CLIENT]: 'Client',
      [PaidBy.SITE_MANAGER]: 'Site Manager'
    };
    return paidByMap[paidBy] || paidBy;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Expense Not Found</h2>
          <p className="text-gray-600 mb-4">The expense you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/expenses')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </button>
        </div>
      </div>
    );
  }

  const category = getCategoryById(expense.categoryId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Action Buttons */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Back Button - Top Left */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/expenses')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expenses
            </button>
          </div>
          
          {/* Title and Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Expense Details
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg"
                    style={{ backgroundColor: category?.color || '#6B7280' }}
                  >
                    {expense.categoryName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditExpense}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Expense
              </button>
              
              <button
                onClick={handleDeleteExpense}
                disabled={actionLoading === 'delete'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {actionLoading === 'delete' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Expense Information</h3>
                    <p className="text-sm text-gray-600">Essential expense details and categorization</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Date</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Amount</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(expense.amount)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Project</label>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">{expense.projectName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      <span 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg"
                        style={{ backgroundColor: category?.color || '#6B7280' }}
                      >
                        {expense.categoryName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Payment Mode</label>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      <span 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg"
                        style={{ backgroundColor: getPaymentModeColor(expense.paymentMode) }}
                      >
                        {getPaymentModeDisplay(expense.paymentMode)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Paid By</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">{getPaidByDisplay(expense.paidBy)}</p>
                    </div>
                  </div>
                </div>
                
                {expense.vendorName && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">{expense.vendorName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Description</h3>
                    <p className="text-sm text-gray-600">Detailed expense description and purpose</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {expense.description || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Notes Card */}
            {expense.notes && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Notes</h3>
                      <p className="text-sm text-gray-600">Additional notes and comments</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {expense.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Attachments & Metadata */}
          <div className="space-y-8">
            {/* Attachments Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Attachments</h3>
                    <p className="text-sm text-gray-600">Supporting documents and files</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {expense.attachments && expense.attachments.length > 0 ? (
                  <div className="space-y-4">
                    {expense.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <FileText className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            Attachment {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
                            <Eye className="h-3 w-3" />
                          </button>
                          <button className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors">
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No attachments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Metadata</h3>
                    <p className="text-sm text-gray-600">Creation and modification details</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Created</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(expense.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Last Updated</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(expense.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailPage;