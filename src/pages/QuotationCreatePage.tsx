import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Save, 
  Eye, 
  Wand2, 
  Upload, 
  X, 
  Calculator,
  FileText,
  Building,
  MapPin,
  User,
  Calendar,
  Percent,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  DollarSign,
  Settings,
  Clock,
  CheckCircle
} from 'lucide-react';
import { 
  createQuotation, 
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

interface QuotationTermsConditions {
  warranty: string;
  deliveryTime: string;
  paymentTerms: string;
  additionalTerms: string[];
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
  title: string;
  siteAddress: string;
  workDescription: string;
  lineItems: QuotationLineItem[];
  taxPercentage: number;
  validityPeriod: number;
  validUntil: string;
  termsConditions: string[];
  paymentTerms: QuotationPaymentTerms;
  attachments: any[];
  notes?: string;
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

// Wizard steps
type WizardStep = 'client' | 'project' | 'lineitems' | 'terms' | 'preview' | 'send';

const WIZARD_STEPS: { key: WizardStep; title: string; description: string; icon: any }[] = [
  { key: 'client', title: 'Client Selection', description: 'Choose client and basic info', icon: User },
  { key: 'project', title: 'Project Details', description: 'Site address and work description', icon: Building },
  { key: 'lineitems', title: 'Line Items', description: 'Add quotation items and pricing', icon: Calculator },
  { key: 'terms', title: 'Terms & Payment', description: 'Configure terms and payment structure', icon: FileText },
  { key: 'preview', title: 'Preview & Review', description: 'Review quotation before sending', icon: Eye },
  { key: 'send', title: 'Send & Finalize', description: 'Send to client or save as draft', icon: Send }
];

const QuotationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [clients] = useState<Client[]>(getAllClients());
  const [isLoading, setIsLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('client');
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form Data
  const [formData, setFormData] = useState<QuotationFormData>({
    clientId: '',
    projectId: '',
    title: '',
    siteAddress: '',
    workDescription: '',
    lineItems: [],
    taxPercentage: 18,
    validityPeriod: 15,
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
    termsConditions: defaultTermsConditions.filter(tc => tc.isDefault).map(tc => tc.id),
    paymentTerms: defaultPaymentTerms,
    attachments: [],
    notes: ''
  });
  
  // AI Input
  const [aiInput, setAiInput] = useState('');
  const [showAiHelper, setShowAiHelper] = useState(false);
  
  // Line Item Form
  const [newLineItem, setNewLineItem] = useState({
    id: '',
    category: '',
    description: '',
    unit: 'Sqft' as const,
    quantity: 0,
    rate: 0,
    amount: 0
  });
  
  // Enhanced calculations with GST and profit margin
  const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * formData.taxPercentage) / 100;
  const totalAmount = subtotal + taxAmount;
  
  // Profit margin calculation (if cost is provided)
  const totalCost = formData.lineItems.reduce((sum, item) => {
    const cost = (item as any).cost || (item.rate * 0.7); // Default 30% margin if no cost provided
    return sum + (item.quantity * cost);
  }, 0);
  const profitAmount = subtotal - totalCost;
  const profitMargin = subtotal > 0 ? (profitAmount / subtotal) * 100 : 0;
  
  // Auto-calculate expiry date and check status
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + formData.validityPeriod);
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate days until expiry
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;
  
  // Get expiry status color and message
  const getExpiryStatus = () => {
    if (isExpired) {
      return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', message: 'Expired', icon: '⚠️' };
    } else if (isExpiringSoon) {
      return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`, icon: '⏰' };
    } else {
      return { color: 'text-green-600', bg: 'bg-green-50 border-green-200', message: `${daysUntilExpiry} days remaining`, icon: '✅' };
    }
  };
  
  const expiryStatus = getExpiryStatus();
  
  const selectedClient = clients.find(c => c.id === formData.clientId);
  
  // Wizard navigation functions
  const getCurrentStepIndex = () => WIZARD_STEPS.findIndex(step => step.key === currentStep);
  
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'client':
        return formData.clientId !== '';
      case 'project':
        return formData.siteAddress !== '' && formData.workDescription !== '' && formData.title !== '' && formData.validUntil !== '';
      case 'lineitems':
        return formData.lineItems.length > 0;
      case 'terms':
        return true;
      case 'preview':
        return true;
      case 'send':
        return true;
      default:
        return false;
    }
  };
  
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 'client':
        if (!formData.clientId) newErrors.clientId = 'Please select a client';
        break;
      case 'project':
        if (!formData.siteAddress) newErrors.siteAddress = 'Site address is required';
        if (!formData.workDescription) newErrors.workDescription = 'Work description is required';
        if (!formData.title) newErrors.title = 'Quotation title is required';
        if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required';
        break;
      case 'lineitems':
        if (formData.lineItems.length === 0) newErrors.lineItems = 'Please add at least one line item';
        break;
      case 'terms':
        // Terms validation can be added here if needed
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const goToNextStep = () => {
    if (!validateCurrentStep()) return;
    
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < WIZARD_STEPS.length - 1) {
      const nextStep = WIZARD_STEPS[currentIndex + 1].key;
      setCurrentStep(nextStep);
      
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      const prevStep = WIZARD_STEPS[currentIndex - 1].key;
      setCurrentStep(prevStep);
    }
  };
  
  const goToStep = (step: WizardStep) => {
    const stepIndex = WIZARD_STEPS.findIndex(s => s.key === step);
    const currentIndex = getCurrentStepIndex();
    
    // Only allow going to previous steps or next step if current is valid
    if (stepIndex <= currentIndex || (stepIndex === currentIndex + 1 && canProceedToNextStep())) {
      setCurrentStep(step);
    }
  };
  
  useEffect(() => {
    if (selectedClient && !formData.siteAddress && selectedClient.addresses && selectedClient.addresses.length > 0) {
      setFormData(prev => ({
        ...prev,
        siteAddress: selectedClient.addresses[0].fullAddress || ''
      }));
    }
  }, [selectedClient, formData.siteAddress]);
  
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
      id: '',
      category: '',
      description: '',
      unit: 'Sqft',
      quantity: 0,
      rate: 0,
      amount: 0
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
        lineItems: [...prev.lineItems, ...suggestion.suggestedLineItems],
        workDescription: prev.workDescription || aiInput
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
  
  const handleSubmit = async (status: 'draft' | 'finalized') => {
    if (!formData.clientId || !formData.siteAddress || !formData.workDescription) {
      alert('Please fill all required fields');
      return;
    }
    
    if (formData.lineItems.length === 0) {
      alert('Please add at least one line item');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const quotation = createQuotation(formData);
      
      if (status === 'finalized') {
        // Update status to finalized
        // In real app, this would be a separate API call
      }
      
      navigate(`/quotations/${quotation.id}`);
    } catch (error) {
      console.error('Failed to create quotation:', error);
      alert('Failed to create quotation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadTemplate = (templateId: string) => {
    const template = quotationTemplates.find(t => t.id === templateId);
    if (!template) return;
    
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
  
  // Render wizard step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = completedSteps.includes(step.key);
          const canAccess = index <= getCurrentStepIndex() || (index === getCurrentStepIndex() + 1 && canProceedToNextStep());
          const StepIcon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => canAccess && goToStep(step.key)}
                disabled={!canAccess}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : isCompleted 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : canAccess 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-600 text-white' : isActive ? 'bg-white text-blue-600' : ''
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Helper functions and render methods

  // Client Selection Step
  const renderClientStep = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <User className="w-5 h-5" />
        Select Client
      </h2>
     
     <div className="space-y-4">
       <div>
         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => {
              handleInputChange('clientId', e.target.value);
              setErrors(prev => ({ ...prev, clientId: '' }));
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.clientId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
         >
           <option value="">Choose a client...</option>
           {clients.map(client => (
             <option key={client.id} value={client.id}>
               {client.name} {client.businessName && `(${client.businessName})`}
             </option>
           ))}
         </select>
         {errors.clientId && (
           <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
             <AlertCircle className="w-4 h-4" />
             {errors.clientId}
           </p>
         )}
       </div>
       
       {selectedClient && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">Contact:</span>
                <p className="text-blue-800 dark:text-blue-200">{selectedClient.primaryContact.name}</p>
                <p className="text-blue-600 dark:text-blue-400">{selectedClient.primaryContact.email}</p>
                <p className="text-blue-600 dark:text-blue-400">{selectedClient.primaryContact.phone}</p>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">Business:</span>
                <p className="text-blue-800 dark:text-blue-200">{selectedClient.businessName || 'Individual'}</p>
                <p className="text-blue-600 dark:text-blue-400">{selectedClient.companyType}</p>
              </div>
            </div>
          </div>
        )}
     </div>
   </div>
  );

  // Project Details Step
  const renderProjectStep = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Building className="w-5 h-5" />
          Project Details
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project (Optional)
              </label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => handleInputChange('projectId', e.target.value || undefined)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">No project selected</option>
                <option value="proj-1">Office Complex Phase 1</option>
                <option value="proj-2">Residential Tower A</option>
                <option value="proj-3">Villa Construction</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.siteAddress}
                onChange={(e) => {
                  handleInputChange('siteAddress', e.target.value);
                  setErrors(prev => ({ ...prev, siteAddress: '' }));
                }}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.siteAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter the complete site address where work will be performed"
              />
              {errors.siteAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.siteAddress}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.workDescription}
                onChange={(e) => {
                  handleInputChange('workDescription', e.target.value);
                  setErrors(prev => ({ ...prev, workDescription: '' }));
                }}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.workDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe the scope of work, materials, and deliverables in detail"
              />
              {errors.workDescription && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.workDescription}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quotation Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => {
                  handleInputChange('title', e.target.value);
                  setErrors(prev => ({ ...prev, title: '' }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Kitchen Renovation Project"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validUntil || ''}
                  onChange={(e) => {
                    handleInputChange('validUntil', e.target.value);
                    setErrors(prev => ({ ...prev, validUntil: '' }));
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.validUntil ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.validUntil && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.validUntil}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Percentage
                </label>
                <input
                  type="number"
                  value={formData.taxPercentage || ''}
                  onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="18"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Any additional notes or special instructions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Line Items Step
  const renderLineItemsStep = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Line Items
          </h2>
          <button
            type="button"
            onClick={addLineItem}
            disabled={!newLineItem.description || !newLineItem.quantity || !newLineItem.rate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
        
        {/* Add New Item Form */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={newLineItem.category}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select category</option>
                <option value="Materials">Materials</option>
                <option value="Labor">Labor</option>
                <option value="Equipment">Equipment</option>
                <option value="Services">Services</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={newLineItem.description}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Item description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
              <select
                value={newLineItem.unit}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, unit: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="Sqft">Sqft</option>
                <option value="Nos">Nos</option>
                <option value="Kg">Kg</option>
                <option value="Meter">Meter</option>
                <option value="Hour">Hour</option>
                <option value="Day">Day</option>
                <option value="Lump Sum">Lump Sum</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
              <input
                type="number"
                value={newLineItem.quantity || ''}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (₹)</label>
              <input
                type="number"
                value={newLineItem.rate || ''}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          {newLineItem.quantity > 0 && newLineItem.rate > 0 && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Amount: ₹{(newLineItem.quantity * newLineItem.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          )}
        </div>
        
        {/* Existing Line Items */}
        {formData.lineItems.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Added Items ({formData.lineItems.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.lineItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">₹{item.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => removeLineItem(index)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Tax ({formData.taxPercentage}%):</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-gray-100">Total:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No line items added yet</p>
            <p className="text-sm">Add items above to build your quotation</p>
          </div>
        )}
        
        {errors.lineItems && (
          <p className="mt-4 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.lineItems}
          </p>
        )}
      </div>
      
      {/* AI Helper */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Quotation Assistant</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAiHelper(!showAiHelper)}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            {showAiHelper ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showAiHelper && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Describe your project requirements and let AI generate line items for you.
            </p>
            <div className="flex gap-3">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., 'I need to paint a 2000 sqft house with premium paint, including labor and materials'"
                rows={3}
                onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleAIGeneration()}
              />
              <button
                type="button"
                onClick={handleAIGeneration}
                disabled={aiProcessing || !aiInput.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {aiProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: Press Ctrl+Enter to generate quickly
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Preview Step
  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preview Quotation
        </h2>
        
        <div className="space-y-6">
          {/* Client & Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Client Information</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{selectedClient?.name}</p>
                <p>{selectedClient?.primaryContact.email}</p>
                <p>{selectedClient?.primaryContact.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Project Details</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Site:</strong> {formData.siteAddress}</p>
                <p><strong>Work:</strong> {formData.workDescription}</p>
              </div>
            </div>
          </div>
          
          {/* Line Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Line Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax ({formData.taxPercentage}%):</span>
                <span>₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          {/* Terms & Conditions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Terms & Conditions</h3>
            <div className="space-y-2">
              {formData.termsConditions.map(tcId => {
                const tc = defaultTermsConditions.find(t => t.id === tcId);
                return tc ? (
                  <div key={tcId} className="text-sm text-gray-600">
                    <strong>{tc.title}:</strong> {tc.content}
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          {/* Payment Terms */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Payment Terms</h3>
            <div className="text-sm text-gray-600">
              <p>• Advance: {formData.paymentTerms.advance}%</p>
              <p>• Milestone 1: {formData.paymentTerms.milestone1}%</p>
              {formData.paymentTerms.milestone2 && (
                <p>• Milestone 2: {formData.paymentTerms.milestone2}%</p>
              )}
              <p>• Final: {formData.paymentTerms.final}%</p>
              <p className="mt-2 italic">{formData.paymentTerms.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Terms & Payment Step
  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Terms & Payment Structure
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Payment Terms</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Advance Payment (%)
                </label>
                <input
                  type="number"
                  value={formData.paymentTerms.advance || ''}
                  onChange={(e) => handleInputChange('paymentTerms', {
                    ...formData.paymentTerms,
                    advance: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Milestone 1 (%)
                </label>
                <input
                  type="number"
                  value={formData.paymentTerms.milestone1 || ''}
                  onChange={(e) => handleInputChange('paymentTerms', {
                    ...formData.paymentTerms,
                    milestone1: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="40"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Milestone 2 (%) - Optional
                </label>
                <input
                  type="number"
                  value={formData.paymentTerms.milestone2 || ''}
                  onChange={(e) => handleInputChange('paymentTerms', {
                    ...formData.paymentTerms,
                    milestone2: parseFloat(e.target.value) || undefined
                  })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Final Payment (%)
                </label>
                <input
                  type="number"
                  value={formData.paymentTerms.final || ''}
                  onChange={(e) => handleInputChange('paymentTerms', {
                    ...formData.paymentTerms,
                    final: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="30"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Terms Description
              </label>
              <textarea
                value={formData.paymentTerms.description || ''}
                onChange={(e) => handleInputChange('paymentTerms', {
                  ...formData.paymentTerms,
                  description: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Payment terms and conditions..."
              />
            </div>
            
            {/* Payment Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Payment Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Advance:</span>
                  <span className="text-blue-900 dark:text-blue-100">{formData.paymentTerms.advance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Milestone 1:</span>
                  <span className="text-blue-900 dark:text-blue-100">{formData.paymentTerms.milestone1}%</span>
                </div>
                {formData.paymentTerms.milestone2 && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Milestone 2:</span>
                    <span className="text-blue-900 dark:text-blue-100">{formData.paymentTerms.milestone2}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Final:</span>
                  <span className="text-blue-900 dark:text-blue-100">{formData.paymentTerms.final}%</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-1 mt-2">
                  <span className="text-blue-800 dark:text-blue-200 font-medium">Total:</span>
                  <span className="text-blue-900 dark:text-blue-100 font-medium">
                    {(formData.paymentTerms.advance + formData.paymentTerms.milestone1 + (formData.paymentTerms.milestone2 || 0) + formData.paymentTerms.final)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terms & Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Terms & Conditions</h3>
            
            <div className="space-y-3">
              {defaultTermsConditions.map(tc => (
                <div key={tc.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <input
                    type="checkbox"
                    id={tc.id}
                    checked={formData.termsConditions.includes(tc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('termsConditions', [...formData.termsConditions, tc.id]);
                      } else {
                        handleInputChange('termsConditions', formData.termsConditions.filter(id => id !== tc.id));
                      }
                    }}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <label htmlFor={tc.id} className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                      {tc.title}
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{tc.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Selected Terms Summary</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.termsConditions.length} terms selected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Send Step
  const renderSendStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Send Quotation
        </h2>
        
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-900">Quotation Ready</h3>
            </div>
            <p className="text-sm text-green-700">
              Your quotation is complete and ready to be sent to the client or saved as a draft.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Save as Draft</h3>
              <p className="text-sm text-gray-600 mb-4">
                Save the quotation for later editing and sending. You can make changes anytime.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Can be edited later</li>
                <li>• Not visible to client</li>
                <li>• No notifications sent</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Send to Client</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send the quotation directly to the client via email with a professional format.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Email sent immediately</li>
                <li>• Client can view online</li>
                <li>• Tracking enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Live Preview Sidebar
  const renderLivePreview = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Eye className="w-5 h-5" />
        Live Preview
      </h3>
      
      <div className="space-y-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Client:</span>
          <p className="text-gray-600">{selectedClient?.name || 'Not selected'}</p>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Site:</span>
          <p className="text-gray-600">{formData.siteAddress || 'Not specified'}</p>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Items:</span>
          <p className="text-gray-600">{formData.lineItems.length} items</p>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Total:</span>
          <p className="text-lg font-bold text-blue-600">₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Valid Until:</span>
          <p className="text-gray-600">{formattedExpiryDate}</p>
        </div>
        
        <div className="pt-4 border-t">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            expiryStatus === 'valid' ? 'bg-green-100 text-green-800' :
            expiryStatus === 'expiring' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {expiryStatus === 'valid' ? 'Valid' :
             expiryStatus === 'expiring' ? 'Expiring Soon' :
             'Expired'}
          </div>
        </div>
      </div>
    </div>
  );

  // Render step-specific content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'client':
        return renderClientStep();
      case 'project':
        return renderProjectStep();
      case 'lineitems':
        return renderLineItemsStep();
      case 'terms':
        return renderTermsStep();
      case 'preview':
        return renderPreviewStep();
      case 'send':
        return renderSendStep();
      default:
        return renderClientStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/quotations')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Quotations
          </button>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Quotation</h1>
              <p className="text-gray-600 dark:text-gray-400">Build your quotation step by step with live preview</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  if (e.target.value) {
                    loadTemplate(e.target.value);
                  }
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Template</option>
                {quotationTemplates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((step, index) => {
              const isActive = step.key === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              const isAccessible = index <= getCurrentStepIndex();
              
              return (
                <div key={step.key} className="flex items-center">
                  <button
                    onClick={() => isAccessible && setCurrentStep(step.key)}
                    disabled={!isAccessible}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isAccessible
                        ? 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </button>
                  <div className="ml-3 min-w-0">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 
                      isCompleted ? 'text-green-600 dark:text-green-400' : 
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  {index < WIZARD_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                onClick={goToPreviousStep}
                disabled={getCurrentStepIndex() === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex gap-3">
                {currentStep === 'send' ? (
                  <>
                    <button
                      onClick={() => handleSubmit('draft')}
                      disabled={isLoading}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save as Draft
                    </button>
                    <button
                      onClick={() => handleSubmit('finalized')}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      Send to Client
                    </button>
                  </>
                ) : (
                  <button
                    onClick={goToNextStep}
                    disabled={!canProceedToNextStep()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Live Preview Sidebar */}
          <div className="space-y-6">
            {renderLivePreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationCreatePage;