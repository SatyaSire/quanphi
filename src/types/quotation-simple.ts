// Simplified quotation types to avoid module resolution issues

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

// Export all types
export type {
  QuotationStatus,
  QuotationLineItem,
  QuotationPaymentTerms,
  QuotationTermsConditions,
  Quotation,
  QuotationStats,
  QuotationFilters,
  QuotationFormData,
  QuotationTemplate
};