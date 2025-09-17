import React, { useState, useEffect } from 'react';
import { useCreateInvoiceMutation, useSendInvoiceMutation, useGetClientsQuery, useGetProjectsQuery } from '../../api/apiService';
import Modal from '../common/Modal';
import { InputField, SelectField, TextAreaField, DateField } from '../common/FormField';
import { LoadingState } from '../common/LoadingSpinner';
import {
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceFormData {
  clientId: string;
  projectId?: string;
  invoiceNumber: string;
  dueDate: string;
  notes: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface InvoiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  projectId?: string;
  milestoneId?: string;
  initialData?: Partial<InvoiceFormData>;
}

const InvoiceCreateModal: React.FC<InvoiceCreateModalProps> = ({
  isOpen,
  onClose,
  clientId: initialClientId,
  projectId: initialProjectId,
  milestoneId,
  initialData
}) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: initialClientId || '',
    projectId: initialProjectId || '',
    invoiceNumber: '',
    dueDate: '',
    notes: '',
    lineItems: [{
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0
  });

  const [saveAndSend, setSaveAndSend] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sendProgress, setSendProgress] = useState<string | null>(null);

  const { data: clients } = useGetClientsQuery({});
  const { data: projects } = useGetProjectsQuery({});
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [sendInvoice, { isLoading: isSending }] = useSendInvoiceMutation();

  // Generate invoice number on mount
  useEffect(() => {
    if (isOpen && !formData.invoiceNumber) {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, invoiceNumber }));
    }
  }, [isOpen]);

  // Apply initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Calculate totals when line items change
  useEffect(() => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [formData.lineItems, formData.taxRate]);

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    if (formData.lineItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount when quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const invoiceData = {
        ...formData,
        milestoneId
      };
      
      const result = await createInvoice(invoiceData).unwrap();
      
      if (saveAndSend) {
        setSendProgress('Generating PDF...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate PDF generation
        
        setSendProgress('Sending invoice...');
        await sendInvoice({ id: result.id }).unwrap();
        
        setSendProgress('Invoice sent successfully!');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create invoice:', error);
      setSendProgress(null);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: initialClientId || '',
      projectId: initialProjectId || '',
      invoiceNumber: '',
      dueDate: '',
      notes: '',
      lineItems: [{
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 0
    });
    setSaveAndSend(false);
    setShowPreview(false);
    setSendProgress(null);
  };

  const filteredProjects = projects?.filter(project => 
    !formData.clientId || project.clientId === formData.clientId
  );

  if (sendProgress) {
    return (
      <Modal isOpen={isOpen} onClose={() => {}} title="Creating Invoice">
        <div className="text-center py-8">
          <LoadingState />
          <p className="mt-4 text-sm text-gray-600">{sendProgress}</p>
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
      title="Create Invoice"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value, projectId: '' })}
            required
          >
            <option value="">Select Client</option>
            {clients?.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Project (Optional)"
            name="projectId"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
          >
            <option value="">Select Project</option>
            {filteredProjects?.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Invoice Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            required
          />

          <DateField
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>

        {/* Line Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <InputField
                    label={index === 0 ? "Description" : ""}
                    name={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={index === 0 ? "Qty" : ""}
                    name={`quantity-${item.id}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={index === 0 ? "Rate" : ""}
                    name={`rate-${item.id}`}
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={index === 0 ? "Amount" : ""}
                    name={`amount-${item.id}`}
                    type="number"
                    value={item.amount.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  {formData.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
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

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium">${formData.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-600">Tax (%):</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax Amount:</span>
                <span className="text-sm font-medium">${formData.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <TextAreaField
          label="Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Additional notes or terms..."
        />

        {/* Save and Send Option */}
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-center">
            <input
              id="save-and-send"
              type="checkbox"
              checked={saveAndSend}
              onChange={(e) => setSaveAndSend(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="save-and-send" className="ml-2 text-sm text-gray-700">
              Save and send invoice to client
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            The invoice will be generated as PDF and sent to the client's email address.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview
          </button>
          
          <div className="flex space-x-3">
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
              disabled={isCreating || isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saveAndSend ? (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Save & Send
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default InvoiceCreateModal;