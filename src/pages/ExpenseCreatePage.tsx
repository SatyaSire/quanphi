import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertTriangle,
  DollarSign,
  Calendar,
  Building,
  Tag,
  User,
  FileText,
  Camera,
  Paperclip
} from 'lucide-react';
import {
  ExpenseFormData,
  PaymentMode,
  PaidBy,
  ExpenseValidationError
} from '../types/expenses';
import {
  expenseCategories,
  formatCurrency
} from '../data/expensesData';
import { projects } from '../data/projectsData';

const ExpenseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    categoryId: '',
    description: '',
    vendorName: '',
    amount: '',
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: [],
    notes: ''
  });

  const [errors, setErrors] = useState<ExpenseValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  // Get project budget info
  const selectedProject = projects.find(p => p.id === formData.projectId);
  const projectBudget = selectedProject?.budget || 0;
  const currentExpenses = 50000; // Mock current expenses
  const remainingBudget = projectBudget - currentExpenses;
  const expenseAmount = typeof formData.amount === 'string' ? parseFloat(formData.amount) || 0 : formData.amount;
  const budgetAfterExpense = remainingBudget - expenseAmount;

  useEffect(() => {
    // Check for budget warnings
    if (selectedProject && expenseAmount > 0) {
      if (budgetAfterExpense < 0) {
        setBudgetWarning(
          `This expense will exceed the project budget by ${formatCurrency(Math.abs(budgetAfterExpense))}`
        );
      } else if (budgetAfterExpense < projectBudget * 0.1) {
        setBudgetWarning(
          `Warning: Only ${formatCurrency(budgetAfterExpense)} remaining in project budget`
        );
      } else {
        setBudgetWarning(null);
      }
    }
  }, [selectedProject, expenseAmount, budgetAfterExpense, projectBudget]);

  useEffect(() => {
    // Check for duplicate entries
    if (formData.projectId && formData.date && formData.vendorName) {
      // Mock duplicate check
      const isDuplicate = false; // Replace with actual duplicate check logic
      if (isDuplicate) {
        setDuplicateWarning(
          'A similar expense entry exists for this project, date, and vendor. Please verify this is not a duplicate.'
        );
      } else {
        setDuplicateWarning(null);
      }
    }
  }, [formData.projectId, formData.date, formData.vendorName]);

  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setErrors(prev => [...prev, {
        field: 'attachments',
        message: 'Some files were rejected. Only PDF, JPG, PNG files under 5MB are allowed.'
      }]);
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));

    // Create preview URLs
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachmentPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: ExpenseValidationError[] = [];

    if (!formData.projectId) {
      newErrors.push({ field: 'projectId', message: 'Project is required' });
    }

    if (!formData.categoryId) {
      newErrors.push({ field: 'categoryId', message: 'Category is required' });
    }

    if (!formData.description.trim()) {
      newErrors.push({ field: 'description', message: 'Description is required' });
    }

    const amount = typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount;
    if (!amount || amount <= 0) {
      newErrors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    }

    if (amount > 100000) {
      newErrors.push({ field: 'amount', message: 'Amount exceeds maximum limit of ₹1,00,000' });
    }

    if (!formData.date) {
      newErrors.push({ field: 'date', message: 'Date is required' });
    }

    // Check if date is more than 3 days old
    const expenseDate = new Date(formData.date);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    if (expenseDate < threeDaysAgo) {
      newErrors.push({ field: 'date', message: 'Expense date is more than 3 days old. Please provide justification in notes.' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message and navigate
      navigate('/expenses', { 
        state: { 
          message: 'Expense created successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      setErrors([{ field: 'general', message: 'Failed to create expense. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/expenses')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Expenses
          </button>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Expense</h1>
              <p className="text-gray-600 dark:text-gray-400">Record and track your expense entry</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Errors */}
          {errors.some(error => error.field === 'general') && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 shadow-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {getFieldError('general')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {(duplicateWarning || budgetWarning) && (
            <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-4 shadow-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  {duplicateWarning && (
                    <p className="text-sm text-yellow-700 mt-1">{duplicateWarning}</p>
                  )}
                  {budgetWarning && (
                    <p className="text-sm text-yellow-700 mt-1">{budgetWarning}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the basic details of your expense
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date of Expense *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('date') ? 'border-red-300' : ''
                    }`}
                  />
                  {getFieldError('date') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('date')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Project *
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('projectId') ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError('projectId') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('projectId')}</p>
                  )}
                  {selectedProject && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md">
                      <div className="text-sm text-blue-800">
                        <div className="flex justify-between">
                          <span>Project Budget:</span>
                          <span className="font-medium">{formatCurrency(projectBudget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className={`font-medium ${
                            budgetAfterExpense < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(budgetAfterExpense)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Expense Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    getFieldError('categoryId') ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {getFieldError('categoryId') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('categoryId')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cement for basement slab"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    getFieldError('description') ? 'border-red-300' : ''
                  }`}
                />
                {getFieldError('description') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('description')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Local Cement Supplier"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Financial Details</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter amount and payment information
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Amount (₹) *
                  </label>
                  <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        getFieldError('amount') ? 'border-red-300' : ''
                      }`}
                    />
                  {getFieldError('amount') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('amount')}</p>
                  )}
                  {expenseAmount > 10000 && (
                    <p className="text-yellow-600 text-sm mt-1">
                      ⚠️ High amount expense - Admin notification will be sent
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => handleInputChange('paymentMode', e.target.value as PaymentMode)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.values(PaymentMode).map(mode => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Paid By
                  </label>
                  <select
                    value={formData.paidBy}
                    onChange={(e) => handleInputChange('paidBy', e.target.value as PaidBy)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.values(PaidBy).map(paidBy => (
                      <option key={paidBy} value={paidBy}>
                        {paidBy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                  <Paperclip className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload bills, invoices, or receipts (PDF, JPG, PNG - Max 5MB each)
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Drop files here or click to upload
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PDF, JPG, PNG up to 5MB each
                  </p>
                </div>
              </div>

              {/* File Previews */}
              {formData.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Uploaded Files ({formData.attachments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="relative border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            {file.type === 'application/pdf' ? (
                              <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                            ) : (
                              <Camera className="h-8 w-8 text-blue-500 flex-shrink-0" />
                            )}
                            <div className="ml-3 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {attachmentPreviews[index] && (
                          <div className="mt-2">
                            <img
                              src={attachmentPreviews[index]}
                              alt="Preview"
                              className="w-full h-20 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {getFieldError('attachments') && (
                <p className="text-red-600 text-sm mt-2">{getFieldError('attachments')}</p>
              )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Additional Notes</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Add any additional notes or remarks
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <textarea
                rows={4}
                placeholder="Any additional notes or remarks..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/expenses"
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseCreatePage;