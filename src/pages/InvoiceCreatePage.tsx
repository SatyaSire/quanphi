import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetProjectsQuery,
  useGetClientsQuery,
  useCreateInvoiceMutation,
  // useUpdateInvoiceMutation, // Not available in apiService
  // useGetInvoiceQuery // Not available in apiService
} from '../api/apiService';
// TODO: Temporarily commented out due to import issues
// import { CreateInvoiceRequest, InvoiceItem } from '../types/api';
import LoadingSpinner, { LoadingState } from '../components/common/LoadingSpinner';
import { InputField, SelectField, TextAreaField, DateField } from '../components/common/FormField';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';

interface InvoiceFormData {
  clientId: string;
  projectId?: string;
  quotationId?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes: string;
  terms: string;
}

const InvoiceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: '',
    projectId: '',
    quotationId: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }],
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.'
  });

  const { data: projects } = useGetProjectsQuery({ limit: 100 });
  const { data: clients } = useGetClientsQuery({ limit: 100 });
  const { data: existingInvoice, isLoading: isLoadingInvoice } = useGetInvoiceQuery(id!, { skip: !isEditing });
  
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();

  useEffect(() => {
    if (existingInvoice && isEditing) {
      setFormData({
        clientId: existingInvoice.clientId,
        projectId: existingInvoice.projectId || '',
        quotationId: existingInvoice.quotationId || '',
        invoiceNumber: existingInvoice.invoiceNumber,
        issueDate: existingInvoice.issueDate.split('T')[0],
        dueDate: existingInvoice.dueDate.split('T')[0],
        items: existingInvoice.items,
        subtotal: existingInvoice.subtotal,
        taxRate: existingInvoice.taxRate,
        taxAmount: existingInvoice.taxAmount,
        discountAmount: existingInvoice.discountAmount || 0,
        total: existingInvoice.total,
        notes: existingInvoice.notes || '',
        terms: existingInvoice.terms || 'Payment is due within 30 days of invoice date.'
      });
    }
  }, [existingInvoice, isEditing]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.taxRate, formData.discountAmount]);

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount - formData.discountAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      const invoiceData: CreateInvoiceRequest = {
        ...formData,
        status: isDraft ? 'draft' : 'sent'
      };
      
      if (isEditing) {
        await updateInvoice({ id: id!, ...invoiceData }).unwrap();
      } else {
        await createInvoice(invoiceData).unwrap();
      }
      
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Client and project details' },
    { id: 2, name: 'Items', description: 'Add invoice items' },
    { id: 3, name: 'Calculations', description: 'Tax and totals' },
    { id: 4, name: 'Review', description: 'Review and save' }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.clientId && formData.invoiceNumber && formData.issueDate && formData.dueDate;
      case 2:
        return formData.items.length > 0 && formData.items.every(item => item.description && item.quantity > 0 && item.rate >= 0);
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (isLoadingInvoice) return <LoadingState />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Invoices
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? 'Update invoice details' : 'Create a new invoice for your client'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                )}
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= step.id
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  <span className="text-sm font-medium">{step.id}</span>
                </div>
                <div className="mt-2">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Client"
                name="clientId"
                type="select"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
                options={[
                  { value: '', label: 'Select a client' },
                  ...(clients?.data || []).map(client => ({
                    value: client.id,
                    label: client.name
                  }))
                ]}
              />
              
              <FormField
                label="Project (Optional)"
                name="projectId"
                type="select"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                options={[
                  { value: '', label: 'No project' },
                  ...(projects?.data || []).map(project => ({
                    value: project.id,
                    label: project.name
                  }))
                ]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
                placeholder="INV-001"
              />
              
              <FormField
                label="Issue Date"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
              />
              
              <FormField
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Items */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Invoice Items</h2>
              <button
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                  <div className="col-span-5">
                    <FormField
                      label="Description"
                      name={`item-description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      label="Quantity"
                      name={`item-quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      label="Rate ($)"
                      name={`item-rate-${item.id}`}
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="text-lg font-medium text-gray-900">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Calculations */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Tax & Calculations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tax Rate (%)"
                name="taxRate"
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                step="0.01"
              />
              
              <FormField
                label="Discount Amount ($)"
                name="discountAmount"
                type="number"
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <CalculatorIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Invoice Summary</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                  <span className="font-medium">${formData.taxAmount.toFixed(2)}</span>
                </div>
                {formData.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-600">-${formData.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-gray-900">${formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <FormField
                label="Notes"
                name="notes"
                type="textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes for the client"
              />
              
              <FormField
                label="Terms & Conditions"
                name="terms"
                type="textarea"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Review Invoice</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Invoice Preview</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Bill To:</h4>
                  <p className="text-sm text-gray-600">
                    {clients?.data?.find(c => c.id === formData.clientId)?.name}
                  </p>
                </div>
                
                <div className="text-right">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Invoice Details:</h4>
                  <p className="text-sm text-gray-600">Invoice #: {formData.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">Issue Date: {new Date(formData.issueDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.rate.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${formData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                      <span>${formData.taxAmount.toFixed(2)}</span>
                    </div>
                    {formData.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-red-600">-${formData.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${formData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          <div className="flex space-x-3">
            {currentStep === 4 ? (
              <>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isCreating || isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {isCreating || isUpdating ? <LoadingSpinner size="sm" /> : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isCreating || isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isCreating || isUpdating ? <LoadingSpinner size="sm" /> : 'Create & Send Invoice'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={!canProceed()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreatePage;