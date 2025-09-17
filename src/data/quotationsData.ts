// Local type definitions to avoid circular imports
type QuotationStatus = 'draft' | 'finalized' | 'sent' | 'accepted' | 'rejected' | 'expired';

interface QuotationLineItem {
  id: string;
  category: string;
  description: string;
  unit: 'Sqft' | 'Nos' | 'Rft' | 'Lumpsum' | 'Day' | 'Kg' | 'Meter' | 'Hour';
  quantity: number;
  rate: number;
  amount: number;
  discount?: number;
  discountAmount?: number;
}

interface QuotationPaymentTerms {
  advance: number;
  milestone1: number;
  milestone2?: number;
  final: number;
  description: string;
}

interface QuotationTermsConditions {
  id: string;
  title: string;
  content: string;
  isDefault: boolean;
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
  totalDiscount: number;
  totalAmount: number;
  termsConditions: QuotationTermsConditions[];
  paymentTerms: QuotationPaymentTerms;
  validityPeriod: number;
  validUntil: string;
  status: QuotationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  attachments: any[];
  sendHistory: any[];
  versions: any[];
  currentVersion: number;
  aiGenerated: boolean;
  originalInput?: string;
  companyLogo?: string;
  companyName: string;
  companyAddress: string;
  companyGSTIN?: string;
  companyPhone: string;
  companyEmail: string;
  followUpDate?: string;
  followUpNotes?: string;
  convertedToProject: boolean;
  convertedProjectId?: string;
  convertedAt?: string;
}

interface QuotationStats {
  totalQuotations: number;
  quotationsSentThisMonth: number;
  quotationsAccepted: number;
  quotationsRejected: number;
  averageQuotationAmount: number;
  conversionRate: number;
  totalValue: number;
  pendingFollowUps: number;
}

interface QuotationFilters {
  clientId?: string;
  status?: QuotationStatus;
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

interface QuotationFormData {
  clientId: string;
  projectId?: string;
  siteAddress: string;
  workDescription: string;
  lineItems: Omit<QuotationLineItem, 'id' | 'amount'>[];
  taxPercentage: number;
  validityPeriod: number;
  termsConditions: string[];
  paymentTerms: QuotationPaymentTerms;
  attachments: File[];
}

interface QuotationTemplate {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'maintenance';
  defaultTerms: QuotationTermsConditions[];
  defaultPaymentTerms: QuotationPaymentTerms;
  defaultValidityPeriod: number;
  defaultLineItems: Omit<QuotationLineItem, 'id' | 'quantity' | 'amount'>[];
  isActive: boolean;
}

// Local AI types to avoid import issues
interface AIQuotationInput {
  rawDescription: string;
  clientType?: 'residential' | 'commercial';
  projectType?: string;
  previousQuotations?: any[];
}

interface AIQuotationSuggestion {
  suggestedLineItems: QuotationLineItem[];
  suggestedRates: { [category: string]: number };
  confidence: number;
  reasoning: string;
}

// Sample Terms & Conditions
export const defaultTermsConditions: QuotationTermsConditions[] = [
  {
    id: 'tc-1',
    title: 'Payment Terms',
    content: 'Payment to be made as per agreed schedule. Advance payment required before work commencement.',
    isDefault: true
  },
  {
    id: 'tc-2', 
    title: 'Material Quality',
    content: 'All materials used will be of standard quality as per specifications. Client approval required for any changes.',
    isDefault: true
  },
  {
    id: 'tc-3',
    title: 'Work Timeline',
    content: 'Work completion timeline is subject to weather conditions and material availability.',
    isDefault: true
  },
  {
    id: 'tc-4',
    title: 'Exclusions',
    content: 'Electrical work, plumbing, and government approvals are not included unless specifically mentioned.',
    isDefault: false
  }
];

// Sample Payment Terms
export const defaultPaymentTerms: QuotationPaymentTerms = {
  advance: 40,
  milestone1: 30,
  milestone2: 20,
  final: 10,
  description: '40% advance, 30% on completion of structure, 20% on completion of finishing, 10% final payment'
};

// Sample Quotation Templates
export const quotationTemplates: QuotationTemplate[] = [
  {
    id: 'template-1',
    name: 'Residential Interior',
    type: 'residential',
    defaultTerms: defaultTermsConditions.filter(tc => tc.isDefault),
    defaultPaymentTerms,
    defaultValidityPeriod: 15,
    defaultLineItems: [
      {
        category: 'Painting',
        description: 'Interior wall painting',
        unit: 'Sqft',
        rate: 12
      },
      {
        category: 'Flooring',
        description: 'Tile flooring work',
        unit: 'Sqft',
        rate: 45
      }
    ],
    isActive: true
  },
  {
    id: 'template-2',
    name: 'Commercial Construction',
    type: 'commercial',
    defaultTerms: defaultTermsConditions,
    defaultPaymentTerms: {
      advance: 30,
      milestone1: 40,
      milestone2: 20,
      final: 10,
      description: '30% advance, 40% on structure completion, 20% on finishing, 10% final'
    },
    defaultValidityPeriod: 30,
    defaultLineItems: [
      {
        category: 'Civil Work',
        description: 'RCC structure work',
        unit: 'Sqft',
        rate: 85
      }
    ],
    isActive: true
  }
];

// Sample Quotations Data
export const quotationsData: Quotation[] = [
  {
    id: 'quo-1',
    quotationNumber: 'QUO-2024-001',
    clientId: 'client-1',
    clientName: 'Metro Development Corp',
    projectId: 'proj-1',
    projectName: 'Office Complex Phase 1',
    siteAddress: '123 Business District, Mumbai, Maharashtra 400001',
    workDescription: 'Complete interior work for 3BHK apartment including painting, flooring, and electrical fittings',
    
    lineItems: [
      {
        id: 'li-1',
        category: 'Painting',
        description: 'Interior wall painting - Hall and bedrooms',
        unit: 'Sqft',
        quantity: 800,
        rate: 12,
        amount: 9600
      },
      {
        id: 'li-2',
        category: 'Flooring',
        description: 'Vitrified tile flooring',
        unit: 'Sqft',
        quantity: 600,
        rate: 45,
        amount: 27000
      },
      {
        id: 'li-3',
        category: 'Electrical',
        description: 'Complete electrical fittings and wiring',
        unit: 'Lumpsum',
        quantity: 1,
        rate: 25000,
        amount: 25000
      }
    ],
    
    subtotal: 61600,
    taxPercentage: 18,
    taxAmount: 11088,
    totalDiscount: 0,
    totalAmount: 72688,
    
    termsConditions: defaultTermsConditions.filter(tc => tc.isDefault),
    paymentTerms: defaultPaymentTerms,
    validityPeriod: 15,
    validUntil: '2024-02-15',
    
    status: 'sent',
    createdBy: 'admin',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    finalizedAt: '2024-01-16T14:20:00Z',
    
    attachments: [
      {
        id: 'att-1',
        name: 'floor_plan.pdf',
        type: 'pdf',
        url: '/attachments/floor_plan.pdf',
        size: 2048576,
        uploadedAt: '2024-01-15T10:35:00Z'
      }
    ],
    
    sendHistory: [
      {
        id: 'send-1',
        method: 'email',
        sentAt: '2024-01-16T14:25:00Z',
        sentTo: 'client@metrodevelopment.com',
        status: 'opened',
        openedAt: '2024-01-16T16:10:00Z'
      }
    ],
    
    versions: [
      {
        id: 'ver-1',
        version: 1,
        modifiedBy: 'admin',
        modifiedAt: '2024-01-15T10:30:00Z',
        changes: 'Initial creation',
        lineItems: [],
        totalAmount: 72688
      }
    ],
    currentVersion: 1,
    
    aiGenerated: true,
    originalInput: 'Painting hall and bedroom 20×10, rate 12 rs/sqft, flooring 600 sqft at 45/sqft, electrical work 25k',
    
    companyName: 'BuildCraft Solutions',
    companyAddress: '456 Construction Avenue, Mumbai 400002',
    companyGSTIN: '27ABCDE1234F1Z5',
    companyPhone: '+91 98765 43210',
    companyEmail: 'info@buildcraft.com',
    
    followUpDate: '2024-01-20',
    followUpNotes: 'Follow up for approval',
    
    convertedToProject: false
  },
  {
    id: 'quo-2',
    quotationNumber: 'QUO-2024-002',
    clientId: 'client-2',
    clientName: 'Sharma Residency',
    siteAddress: '789 Residential Colony, Pune, Maharashtra 411001',
    workDescription: 'Bathroom renovation and waterproofing work',
    
    lineItems: [
      {
        id: 'li-4',
        category: 'Waterproofing',
        description: 'Bathroom waterproofing treatment',
        unit: 'Sqft',
        quantity: 100,
        rate: 25,
        amount: 2500
      },
      {
        id: 'li-5',
        category: 'Tiling',
        description: 'Ceramic wall and floor tiles',
        unit: 'Sqft',
        quantity: 120,
        rate: 35,
        amount: 4200
      }
    ],
    
    subtotal: 6700,
    taxPercentage: 18,
    taxAmount: 1206,
    totalDiscount: 200,
    totalAmount: 7706,
    
    termsConditions: defaultTermsConditions.slice(0, 2),
    paymentTerms: {
      advance: 50,
      milestone1: 30,
      final: 20,
      description: '50% advance, 30% on completion, 20% final payment'
    },
    validityPeriod: 10,
    validUntil: '2024-02-10',
    
    status: 'accepted',
    createdBy: 'manager',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    finalizedAt: '2024-01-20T15:45:00Z',
    
    attachments: [],
    sendHistory: [
      {
        id: 'send-2',
        method: 'whatsapp',
        sentAt: '2024-01-20T16:00:00Z',
        sentTo: '+91 98765 12345',
        status: 'delivered'
      }
    ],
    
    versions: [
      {
        id: 'ver-2',
        version: 1,
        modifiedBy: 'manager',
        modifiedAt: '2024-01-20T09:15:00Z',
        changes: 'Initial creation',
        lineItems: [],
        totalAmount: 7706
      }
    ],
    currentVersion: 1,
    
    aiGenerated: false,
    
    companyName: 'BuildCraft Solutions',
    companyAddress: '456 Construction Avenue, Mumbai 400002',
    companyPhone: '+91 98765 43210',
    companyEmail: 'info@buildcraft.com',
    
    convertedToProject: true,
    convertedProjectId: 'proj-2',
    convertedAt: '2024-01-22T11:30:00Z'
  },
  {
    id: 'quo-3',
    quotationNumber: 'QUO-2024-003',
    clientId: 'client-3',
    clientName: 'Green Valley Apartments',
    siteAddress: '321 Green Valley, Bangalore, Karnataka 560001',
    workDescription: 'External painting and maintenance work for apartment complex',
    
    lineItems: [
      {
        id: 'li-6',
        category: 'Painting',
        description: 'External wall painting',
        unit: 'Sqft',
        quantity: 2000,
        rate: 8,
        amount: 16000
      },
      {
        id: 'li-7',
        category: 'Maintenance',
        description: 'General maintenance and repairs',
        unit: 'Lumpsum',
        quantity: 1,
        rate: 15000,
        amount: 15000
      }
    ],
    
    subtotal: 31000,
    taxPercentage: 18,
    taxAmount: 5580,
    totalDiscount: 1000,
    totalAmount: 35580,
    
    termsConditions: defaultTermsConditions,
    paymentTerms: defaultPaymentTerms,
    validityPeriod: 20,
    validUntil: '2024-02-20',
    
    status: 'draft',
    createdBy: 'admin',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-01-25T14:20:00Z',
    
    attachments: [],
    sendHistory: [],
    
    versions: [
      {
        id: 'ver-3',
        version: 1,
        modifiedBy: 'admin',
        modifiedAt: '2024-01-25T14:20:00Z',
        changes: 'Initial creation',
        lineItems: [],
        totalAmount: 35580
      }
    ],
    currentVersion: 1,
    
    aiGenerated: false,
    
    companyName: 'BuildCraft Solutions',
    companyAddress: '456 Construction Avenue, Mumbai 400002',
    companyPhone: '+91 98765 43210',
    companyEmail: 'info@buildcraft.com',
    
    convertedToProject: false
  }
];

// CRUD Operations
export const getAllQuotations = (): Quotation[] => {
  return quotationsData;
};

export const getQuotationById = (id: string): Quotation | undefined => {
  return quotationsData.find(quotation => quotation.id === id);
};

export const getQuotationsByClient = (clientId: string): Quotation[] => {
  return quotationsData.filter(quotation => quotation.clientId === clientId);
};

export const getQuotationsByStatus = (status: string): Quotation[] => {
  return quotationsData.filter(quotation => quotation.status === status);
};

export const getFilteredQuotations = (filters: QuotationFilters): Quotation[] => {
  let filtered = quotationsData;
  
  if (filters.clientId) {
    filtered = filtered.filter(q => q.clientId === filters.clientId);
  }
  
  if (filters.status) {
    filtered = filtered.filter(q => q.status === filters.status);
  }
  
  if (filters.projectId) {
    filtered = filtered.filter(q => q.projectId === filters.projectId);
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(q => new Date(q.createdAt) >= new Date(filters.dateFrom!));
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(q => new Date(q.createdAt) <= new Date(filters.dateTo!));
  }
  
  if (filters.amountMin) {
    filtered = filtered.filter(q => q.totalAmount >= filters.amountMin!);
  }
  
  if (filters.amountMax) {
    filtered = filtered.filter(q => q.totalAmount <= filters.amountMax!);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(q => 
      q.quotationNumber.toLowerCase().includes(searchLower) ||
      q.clientName.toLowerCase().includes(searchLower) ||
      q.workDescription.toLowerCase().includes(searchLower) ||
      (q.projectName && q.projectName.toLowerCase().includes(searchLower))
    );
  }
  
  return filtered;
};

export const createQuotation = (formData: QuotationFormData): Quotation => {
  const newId = `quo-${Date.now()}`;
  const quotationNumber = `QUO-${new Date().getFullYear()}-${String(quotationsData.length + 1).padStart(3, '0')}`;
  
  // Calculate line item amounts
  const lineItems: QuotationLineItem[] = formData.lineItems.map((item, index) => ({
    ...item,
    id: `li-${newId}-${index}`,
    amount: item.quantity * item.rate
  }));
  
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * formData.taxPercentage) / 100;
  const totalAmount = subtotal + taxAmount;
  
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + formData.validityPeriod);
  
  const newQuotation: Quotation = {
    id: newId,
    quotationNumber,
    clientId: formData.clientId,
    clientName: 'Client Name', // This should be fetched from client data
    projectId: formData.projectId,
    projectName: formData.projectId ? 'Project Name' : undefined,
    siteAddress: formData.siteAddress,
    workDescription: formData.workDescription,
    
    lineItems,
    
    subtotal,
    taxPercentage: formData.taxPercentage,
    taxAmount,
    totalDiscount: 0,
    totalAmount,
    
    termsConditions: defaultTermsConditions.filter(tc => 
      formData.termsConditions.includes(tc.id)
    ),
    paymentTerms: formData.paymentTerms,
    validityPeriod: formData.validityPeriod,
    validUntil: validUntil.toISOString().split('T')[0],
    
    status: 'draft',
    createdBy: 'current-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    attachments: [],
    sendHistory: [],
    
    versions: [{
      id: `ver-${newId}-1`,
      version: 1,
      modifiedBy: 'current-user',
      modifiedAt: new Date().toISOString(),
      changes: 'Initial creation',
      lineItems,
      totalAmount
    }],
    currentVersion: 1,
    
    aiGenerated: false,
    
    companyName: 'BuildCraft Solutions',
    companyAddress: '456 Construction Avenue, Mumbai 400002',
    companyPhone: '+91 98765 43210',
    companyEmail: 'info@buildcraft.com',
    
    convertedToProject: false
  };
  
  quotationsData.push(newQuotation);
  return newQuotation;
};

export const updateQuotation = (id: string, updates: Partial<Quotation>): Quotation | null => {
  const index = quotationsData.findIndex(quotation => quotation.id === id);
  if (index === -1) return null;
  
  const updatedQuotation = {
    ...quotationsData[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  quotationsData[index] = updatedQuotation;
  return updatedQuotation;
};

export const deleteQuotation = (id: string): boolean => {
  const index = quotationsData.findIndex(quotation => quotation.id === id);
  if (index === -1) return false;
  
  quotationsData.splice(index, 1);
  return true;
};

export const duplicateQuotation = (id: string): Quotation | null => {
  const original = getQuotationById(id);
  if (!original) return null;
  
  const newId = `quo-${Date.now()}`;
  const quotationNumber = `QUO-${new Date().getFullYear()}-${String(quotationsData.length + 1).padStart(3, '0')}`;
  
  const duplicated: Quotation = {
    ...original,
    id: newId,
    quotationNumber,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    finalizedAt: undefined,
    sendHistory: [],
    convertedToProject: false,
    convertedProjectId: undefined,
    convertedAt: undefined
  };
  
  quotationsData.push(duplicated);
  return duplicated;
};

// Statistics
export const getQuotationStats = (): QuotationStats => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthQuotations = quotationsData.filter(q => {
    const quotationDate = new Date(q.createdAt);
    return quotationDate.getMonth() === currentMonth && quotationDate.getFullYear() === currentYear;
  });
  
  const acceptedQuotations = quotationsData.filter(q => q.status === 'accepted');
  const rejectedQuotations = quotationsData.filter(q => q.status === 'rejected');
  const sentQuotations = quotationsData.filter(q => ['sent', 'accepted', 'rejected'].includes(q.status));
  
  const totalValue = quotationsData.reduce((sum, q) => sum + q.totalAmount, 0);
  const averageAmount = quotationsData.length > 0 ? totalValue / quotationsData.length : 0;
  
  const conversionRate = sentQuotations.length > 0 
    ? (acceptedQuotations.length / sentQuotations.length) * 100 
    : 0;
  
  const pendingFollowUps = quotationsData.filter(q => 
    q.followUpDate && new Date(q.followUpDate) <= new Date() && q.status === 'sent'
  ).length;
  
  return {
    totalQuotations: quotationsData.length,
    quotationsSentThisMonth: thisMonthQuotations.length,
    quotationsAccepted: acceptedQuotations.length,
    quotationsRejected: rejectedQuotations.length,
    averageQuotationAmount: averageAmount,
    conversionRate,
    totalValue,
    pendingFollowUps
  };
};

// AI Assistant Functions
export const generateAIQuotation = (input: AIQuotationInput): AIQuotationSuggestion => {
  // Mock AI processing - in real implementation, this would call an AI service
  const { rawDescription, clientType = 'residential' } = input;
  
  // Simple pattern matching for demo
  const suggestions: AIQuotationSuggestion = {
    suggestedLineItems: [],
    suggestedRates: {},
    confidence: 0.8,
    reasoning: 'Based on similar projects and current market rates'
  };
  
  // Parse common patterns
  if (rawDescription.toLowerCase().includes('painting')) {
    suggestions.suggestedLineItems.push({
      id: 'ai-1',
      category: 'Painting',
      description: 'Interior painting work',
      unit: 'Sqft',
      quantity: 400, // Default estimate
      rate: clientType === 'commercial' ? 15 : 12,
      amount: 0
    });
    suggestions.suggestedRates['Painting'] = clientType === 'commercial' ? 15 : 12;
  }
  
  if (rawDescription.toLowerCase().includes('flooring') || rawDescription.toLowerCase().includes('tile')) {
    suggestions.suggestedLineItems.push({
      id: 'ai-2',
      category: 'Flooring',
      description: 'Tile flooring work',
      unit: 'Sqft',
      quantity: 300,
      rate: clientType === 'commercial' ? 55 : 45,
      amount: 0
    });
    suggestions.suggestedRates['Flooring'] = clientType === 'commercial' ? 55 : 45;
  }
  
  if (rawDescription.toLowerCase().includes('electrical')) {
    suggestions.suggestedLineItems.push({
      id: 'ai-3',
      category: 'Electrical',
      description: 'Electrical fittings and wiring',
      unit: 'Lumpsum',
      quantity: 1,
      rate: clientType === 'commercial' ? 35000 : 25000,
      amount: 0
    });
    suggestions.suggestedRates['Electrical'] = clientType === 'commercial' ? 35000 : 25000;
  }
  
  // Calculate amounts
  suggestions.suggestedLineItems = suggestions.suggestedLineItems.map(item => ({
    ...item,
    amount: item.quantity * item.rate
  }));
  
  return suggestions;
};

// Missing functions that are imported elsewhere
export const getQuotations = (): Quotation[] => {
  return getAllQuotations();
};

export const getQuotationTemplates = (): QuotationTemplate[] => {
  return quotationTemplates;
};

export const exportQuotations = (quotations: Quotation[], format: 'csv' | 'excel' = 'csv'): string => {
  // Mock export functionality
  if (format === 'csv') {
    const headers = ['Quotation Number', 'Client Name', 'Total Amount', 'Status', 'Created Date'];
    const rows = quotations.map(q => [
      q.quotationNumber,
      q.clientName,
      q.totalAmount.toString(),
      q.status,
      new Date(q.createdAt).toLocaleDateString()
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  return 'Excel export not implemented';
};

// Additional utility functions
export const updateQuotationStatus = async (id: string, status: string): Promise<Quotation> => {
  const quotation = mockQuotations.find(q => q.id === id);
  if (!quotation) {
    throw new Error('Quotation not found');
  }
  quotation.status = status as any;
  quotation.updatedAt = new Date().toISOString();
  return quotation;
};

export const sendQuotationEmail = async (id: string, email: string): Promise<void> => {
  // Mock email sending
  console.log(`Sending quotation ${id} to ${email}`);
};

export const sendQuotationWhatsApp = async (id: string, phone: string): Promise<void> => {
  // Mock WhatsApp sending
  console.log(`Sending quotation ${id} to WhatsApp ${phone}`);
};

export const convertToProject = async (quotationId: string): Promise<string> => {
  // Mock project conversion
  const projectId = `proj-${Date.now()}`;
  console.log(`Converting quotation ${quotationId} to project ${projectId}`);
  return projectId;
};

export const generateQuotationPDF = async (id: string): Promise<Blob> => {
  // Mock PDF generation
  console.log(`Generating PDF for quotation ${id}`);
  return new Blob(['Mock PDF content'], { type: 'application/pdf' });
};