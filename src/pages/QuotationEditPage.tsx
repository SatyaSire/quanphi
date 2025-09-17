import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Eye, 
  Wand2, 
  History, 
  AlertCircle, 
  Calculator, 
  Building, 
  User, 
  MapPin, 
  Calendar, 
  Percent, 
  FileText, 
  Undo2, 
  RotateCcw
} from 'lucide-react';
import { 
  getQuotationById, 
  updateQuotation, 
  generateAIQuotation,
  defaultTermsConditions,
  defaultPaymentTerms,
  quotationTemplates
} from '../data/quotationsData';
import { getAllClients } from '../data/clientsData';
// Local quotation type definitions to avoid import issues
type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

interface QuotationLineItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface QuotationPaymentTerms {
  advance: number;
  milestone1: number;
  milestone2?: number;
  final: number;
  description: string;
}

interface QuotationVersion {
  id: string;
  version: number;
  changes: string;
  createdAt: string;
  createdBy: string;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  siteAddress: string;
  workDescription: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  validityPeriod: number;
  validUntil: string;
  status: QuotationStatus;
  termsConditions: string[];
  paymentTerms: QuotationPaymentTerms;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  notes?: string;
}

interface QuotationFormData {
  clientId: string;
  projectId?: string;
  siteAddress: string;
  workDescription: string;
  lineItems: QuotationLineItem[];
  taxPercentage: number;
  validityPeriod: number;
  termsConditions: string[];
  paymentTerms: QuotationPaymentTerms;
  attachments: any[];
}
// Local Client type definition to avoid import issues
interface ClientContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface Client {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  businessName?: string;
  companyType: string;
  primaryContact: ClientContact;
  additionalContacts: ClientContact[];
  preferredContactMethod: string;
  addresses: any[];
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  status: string;
  riskLevel: string;
  tags: any[];
  financialSummary: any;
  notes: any[];
  internalComments?: string;
  lastActivity?: string;
  createdBy: string;
  assignedManager?: string;
}

// Local AI types to avoid import issues
interface AIQuotationInput {
  rawDescription: string;
  clientType?: 'residential' | 'commercial';
  projectType?: string;
  previousQuotations?: any[];
}

const QuotationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clients] = useState<Client[]>(getAllClients());
  const [originalQuotation, setOriginalQuotation] = useState<Quotation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState<QuotationFormData>({
    clientId: '',
    projectId: '',
    siteAddress: '',
    workDescription: '',
    lineItems: [],
    taxPercentage: 18,
    validityPeriod: 15,
    termsConditions: [],
    paymentTerms: defaultPaymentTerms,
    attachments: []
  });
  
  // AI Input
  const [aiInput, setAiInput] = useState('');
  const [showAiHelper, setShowAiHelper] = useState(false);
  
  // Line Item Form
  const [newLineItem, setNewLineItem] = useState({
    category: '',
    description: '',
    unit: 'Sqft' as const,
    quantity: 0,
    rate: 0
  });
  
  // Version History (mock data - in real app this would come from API)
  const [versionHistory] = useState<QuotationVersionHistory[]>([
    {
      id: 'v1',
      version: 1,
      modifiedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      modifiedBy: 'John Doe',
      changes: ['Initial creation'],
      totalAmount: 125000
    },
    {
      id: 'v2',
      version: 2,
      modifiedAt: new Date(Date.now() - 86400000).toISOString(),
      modifiedBy: 'Jane Smith',
      changes: ['Updated line item rates', 'Added new painting work'],
      totalAmount: 135000
    }
  ]);
  
  // Calculations
  const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * formData.taxPercentage) / 100;
  const totalAmount = subtotal + taxAmount;
  
  const selectedClient = clients.find(c => c.id === formData.clientId);
  
  useEffect(() => {
    if (id) {
      const quotation = getQuotationById(id);
      if (quotation) {
        setOriginalQuotation(quotation);
        
        // Convert quotation to form data
        const validUntil = new Date(quotation.validUntil);
        const createdAt = new Date(quotation.createdAt);
        const validityPeriod = Math.ceil((validUntil.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        
        setFormData({
          clientId: quotation.clientId,
          projectId: quotation.projectId,
          siteAddress: quotation.siteAddress,
          workDescription: quotation.workDescription,
          lineItems: quotation.lineItems,
          taxPercentage: quotation.taxPercentage,
          validityPeriod: validityPeriod,
          termsConditions: quotation.termsConditions || [],
          paymentTerms: quotation.paymentTerms,
          attachments: quotation.attachments || []
        });
      }
    }
    setIsLoading(false);
  }, [id]);
  
  // Track changes
  useEffect(() => {
    if (originalQuotation) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify({
        clientId: originalQuotation.clientId,
        projectId: originalQuotation.projectId,
        siteAddress: originalQuotation.siteAddress,
        workDescription: originalQuotation.workDescription,
        lineItems: originalQuotation.lineItems,
        taxPercentage: originalQuotation.taxPercentage,
        validityPeriod: Math.ceil((new Date(originalQuotation.validUntil).getTime() - new Date(originalQuotation.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        termsConditions: originalQuotation.termsConditions || [],
        paymentTerms: originalQuotation.paymentTerms,
        attachments: originalQuotation.attachments || []
      });
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, originalQuotation]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!originalQuotation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quotation Not Found</h2>
        <p className="text-gray-600 mb-4">The quotation you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('/quotations')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Back to Quotations
        </button>
      </div>
    );
  }
  
  const handleInputChange = (field: keyof QuotationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLineItemChange = (field: string, value: any) => {
    setNewLineItem(prev => ({ ...prev, [field]: value }));
  };
  
  const addLineItem = () => {
    if (!newLineItem.category || !newLineItem.description || newLineItem.quantity <= 0 || newLineItem.rate <= 0) {
      alert('Please fill all line item fields with valid values');
      return;
    }
    
    const lineItem = {
      ...newLineItem,
      id: `temp-${Date.now()}`,
      amount: newLineItem.quantity * newLineItem.rate
    };
    
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, lineItem]
    }));
    
    // Reset form
    setNewLineItem({
      category: '',
      description: '',
      unit: 'Sqft',
      quantity: 0,
      rate: 0
    });
  };
  
  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };
  
  const updateLineItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => 
        i === index 
          ? { ...item, [field]: value, amount: field === 'quantity' || field === 'rate' 
              ? (field === 'quantity' ? value : item.quantity) * (field === 'rate' ? value : item.rate)
              : item.amount
            }
          : item
      )
    }));
  };
  
  const handleAIGeneration = async () => {
    if (!aiInput.trim()) {
      alert('Please enter a description for AI to process');
      return;
    }
    
    setAiProcessing(true);
    
    try {
      const aiInputData: AIQuotationInput = {
        rawDescription: aiInput,
        clientType: selectedClient?.type === 'Corporate' ? 'commercial' : 'residential'
      };
      
      const suggestion = generateAIQuotation(aiInputData);
      
      // Add AI suggested line items
      setFormData(prev => ({
        ...prev,
        lineItems: [...prev.lineItems, ...suggestion.suggestedLineItems]
      }));
      
      setAiInput('');
      setShowAiHelper(false);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setAiProcessing(false);
    }
  };
  
  const handleSave = async () => {
    if (!formData.clientId || !formData.siteAddress || !formData.workDescription) {
      alert('Please fill all required fields');
      return;
    }
    
    if (formData.lineItems.length === 0) {
      alert('Please add at least one line item');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedQuotation = updateQuotation(originalQuotation.id, formData);
      setOriginalQuotation(updatedQuotation);
      setHasUnsavedChanges(false);
      alert('Quotation updated successfully!');
    } catch (error) {
      console.error('Failed to update quotation:', error);
      alert('Failed to update quotation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to discard all unsaved changes?');
      if (!confirmed) return;
    }
    
    // Reset to original data
    const validUntil = new Date(originalQuotation.validUntil);
    const createdAt = new Date(originalQuotation.createdAt);
    const validityPeriod = Math.ceil((validUntil.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    setFormData({
      clientId: originalQuotation.clientId,
      projectId: originalQuotation.projectId,
      siteAddress: originalQuotation.siteAddress,
      workDescription: originalQuotation.workDescription,
      lineItems: originalQuotation.lineItems,
      taxPercentage: originalQuotation.taxPercentage,
      validityPeriod: validityPeriod,
      termsConditions: originalQuotation.termsConditions || [],
      paymentTerms: originalQuotation.paymentTerms,
      attachments: originalQuotation.attachments || []
    });
  };
  
  const loadTemplate = (templateId: string) => {
    const template = quotationTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const confirmed = window.confirm('Loading a template will replace current line items. Continue?');
    if (!confirmed) return;
    
    setFormData(prev => ({
      ...prev,
      lineItems: template.defaultLineItems.map((item, index) => ({
        ...item,
        id: `template-${Date.now()}-${index}`,
        quantity: 1,
        amount: item.rate
      })),
      termsConditions: template.defaultTerms.map(tc => tc.id),
      paymentTerms: template.defaultPaymentTerms,
      validityPeriod: template.defaultValidityPeriod
    }));
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (hasUnsavedChanges) {
              const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
              if (!confirmed) return;
            }
            navigate('/quotations');
          }}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Quotation
        </button>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Edit {originalQuotation.quotationNumber}</h1>
              {hasUnsavedChanges && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                  Unsaved Changes
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">Last modified: {new Date(originalQuotation.lastModified || originalQuotation.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVersionHistory(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <History className="w-4 h-4" />
            History
          </button>
          
          <button
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={() => setShowPreview(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
      
      {/* Status Warning */}
      {originalQuotation.status !== 'draft' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Warning: This quotation has status '{originalQuotation.status}'. Changes may affect client communications.
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project (Optional)
                </label>
                <select
                  value={formData.projectId || ''}
                  onChange={(e) => handleInputChange('projectId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No project selected</option>
                  <option value="proj-1">Office Complex Phase 1</option>
                  <option value="proj-2">Residential Tower A</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.siteAddress}
                onChange={(e) => handleInputChange('siteAddress', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the site address"
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the work to be done"
                required
              />
            </div>
          </div>
          
          {/* AI Helper */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                AI Quotation Assistant
              </h2>
              <button
                onClick={() => setShowAiHelper(!showAiHelper)}
                className="text-purple-600 hover:text-purple-800 transition-colors"
              >
                {showAiHelper ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showAiHelper && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add more items by describing work in natural language.
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="e.g., Add electrical work for 3 rooms, 15000 per room"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleAIGeneration()}
                  />
                  <button
                    onClick={handleAIGeneration}
                    disabled={aiProcessing || !aiInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {aiProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    Add Items
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600">Quick templates:</span>
                  {quotationTemplates.filter(t => t.isActive).map(template => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template.id)}
                      className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Line Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Line Items
            </h2>
            
            {/* Add New Line Item */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Category"
                    value={newLineItem.category}
                    onChange={(e) => handleLineItemChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newLineItem.description}
                    onChange={(e) => handleLineItemChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <select
                    value={newLineItem.unit}
                    onChange={(e) => handleLineItemChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Sqft">Sqft</option>
                    <option value="Nos">Nos</option>
                    <option value="Rft">Rft</option>
                    <option value="Lumpsum">Lumpsum</option>
                    <option value="Day">Day</option>
                    <option value="Kg">Kg</option>
                    <option value="Meter">Meter</option>
                    <option value="Hour">Hour</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newLineItem.quantity || ''}
                    onChange={(e) => handleLineItemChange('quantity', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Rate"
                    value={newLineItem.rate || ''}
                    onChange={(e) => handleLineItemChange('rate', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={addLineItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Line Items List */}
            {formData.lineItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No line items added yet</p>
                <p className="text-sm">Add items above or use the AI assistant</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.lineItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                      <div>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateLineItem(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <select
                          value={item.unit}
                          onChange={(e) => updateLineItem(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="Sqft">Sqft</option>
                          <option value="Nos">Nos</option>
                          <option value="Rft">Rft</option>
                          <option value="Lumpsum">Lumpsum</option>
                          <option value="Day">Day</option>
                          <option value="Kg">Kg</option>
                          <option value="Meter">Meter</option>
                          <option value="Hour">Hour</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{(item.quantity * item.rate).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeLineItem(index)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Terms & Conditions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
            
            <div className="space-y-3">
              {defaultTermsConditions.map(tc => (
                <label key={tc.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.termsConditions.includes(tc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('termsConditions', [...formData.termsConditions, tc.id]);
                      } else {
                        handleInputChange('termsConditions', formData.termsConditions.filter(id => id !== tc.id));
                      }
                    }}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{tc.title}</div>
                    <div className="text-sm text-gray-600">{tc.content}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Updated Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({formData.taxPercentage}%):</span>
                <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Change Indicator */}
            {originalQuotation && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <span className="text-gray-600">Original Total: </span>
                  <span className="font-medium">₹{(originalQuotation.lineItems.reduce((sum, item) => sum + item.amount, 0) * (1 + originalQuotation.taxPercentage / 100)).toLocaleString()}</span>
                </div>
                {totalAmount !== (originalQuotation.lineItems.reduce((sum, item) => sum + item.amount, 0) * (1 + originalQuotation.taxPercentage / 100)) && (
                  <div className="text-sm mt-1">
                    <span className={`font-medium ${
                      totalAmount > (originalQuotation.lineItems.reduce((sum, item) => sum + item.amount, 0) * (1 + originalQuotation.taxPercentage / 100))
                        ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {totalAmount > (originalQuotation.lineItems.reduce((sum, item) => sum + item.amount, 0) * (1 + originalQuotation.taxPercentage / 100))
                        ? '+' : ''}₹{(totalAmount - (originalQuotation.lineItems.reduce((sum, item) => sum + item.amount, 0) * (1 + originalQuotation.taxPercentage / 100))).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.taxPercentage}
                    onChange={(e) => handleInputChange('taxPercentage', Number(e.target.value))}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validity Period (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.validityPeriod}
                    onChange={(e) => handleInputChange('validityPeriod', Number(e.target.value))}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="365"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Terms */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Advance:</span>
                <span>{formData.paymentTerms.advance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Milestone 1:</span>
                <span>{formData.paymentTerms.milestone1}%</span>
              </div>
              {formData.paymentTerms.milestone2 && (
                <div className="flex justify-between text-sm">
                  <span>Milestone 2:</span>
                  <span>{formData.paymentTerms.milestone2}%</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Final:</span>
                <span>{formData.paymentTerms.final}%</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-600">{formData.paymentTerms.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {versionHistory.map((version, index) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Version {version.version}</h4>
                      <p className="text-sm text-gray-600">
                        Modified by {version.modifiedBy} on {new Date(version.modifiedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">₹{version.totalAmount.toLocaleString()}</div>
                      {index === 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Current</span>}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Changes:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {version.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationEditPage;