// Quotation Management Types

export interface QuotationLineItem {
  id: string;
  category: string; // e.g., Masonry, Painting, Electrical
  description: string;
  unit: 'Sqft' | 'Nos' | 'Rft' | 'Lumpsum' | 'Day' | 'Kg' | 'Meter' | 'Hour';
  quantity: number;
  rate: number; // per unit
  amount: number; // quantity × rate
  discount?: number; // percentage
  discountAmount?: number;
}

export interface QuotationAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
}

export interface QuotationTermsConditions {
  id: string;
  title: string;
  content: string;
  isDefault: boolean;
}

export interface QuotationVersion {
  id: string;
  version: number;
  modifiedBy: string;
  modifiedAt: string;
  changes: string;
  lineItems: QuotationLineItem[];
  totalAmount: number;
}

export type QuotationStatus = 'draft' | 'finalized' | 'sent' | 'accepted' | 'rejected' | 'expired';

export type QuotationSendMethod = 'email' | 'whatsapp' | 'print' | 'download';

export interface QuotationSendHistory {
  id: string;
  method: QuotationSendMethod;
  sentAt: string;
  sentTo: string; // email or phone
  status: 'sent' | 'delivered' | 'opened' | 'failed';
  openedAt?: string;
}

export interface QuotationPaymentTerms {
  advance: number; // percentage
  milestone1: number; // percentage
  milestone2?: number; // percentage
  final: number; // percentage
  description: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // QUO-2024-001
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  siteAddress: string;
  workDescription: string;
  
  // Line Items
  lineItems: QuotationLineItem[];
  
  // Financial Details
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  totalDiscount: number;
  totalAmount: number;
  
  // Terms & Conditions
  termsConditions: QuotationTermsConditions[];
  paymentTerms: QuotationPaymentTerms;
  validityPeriod: number; // days
  validUntil: string;
  
  // Status & Tracking
  status: QuotationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  
  // Attachments
  attachments: QuotationAttachment[];
  
  // Send History
  sendHistory: QuotationSendHistory[];
  
  // Version Control
  versions: QuotationVersion[];
  currentVersion: number;
  
  // AI Features
  aiGenerated: boolean;
  originalInput?: string; // raw input before AI processing
  
  // Branding
  companyLogo?: string;
  companyName: string;
  companyAddress: string;
  companyGSTIN?: string;
  companyPhone: string;
  companyEmail: string;
  
  // Follow-up
  followUpDate?: string;
  followUpNotes?: string;
  
  // Conversion
  convertedToProject: boolean;
  convertedProjectId?: string;
  convertedAt?: string;
}

export interface QuotationFormData {
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

export interface QuotationFilters {
  clientId?: string;
  status?: QuotationStatus;
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface QuotationStats {
  totalQuotations: number;
  quotationsSentThisMonth: number;
  quotationsAccepted: number;
  quotationsRejected: number;
  averageQuotationAmount: number;
  conversionRate: number; // percentage
  totalValue: number;
  pendingFollowUps: number;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'maintenance';
  defaultTerms: QuotationTermsConditions[];
  defaultPaymentTerms: QuotationPaymentTerms;
  defaultValidityPeriod: number;
  defaultLineItems: Omit<QuotationLineItem, 'id' | 'quantity' | 'amount'>[];
  isActive: boolean;
}

// AI Assistant Types moved to ../types/ai.ts

// Export/Import Types
export interface QuotationExportData {
  quotations: Quotation[];
  exportedAt: string;
  exportedBy: string;
  format: 'excel' | 'csv' | 'pdf';
}

// Notification Types
export interface QuotationNotification {
  id: string;
  quotationId: string;
  type: 'follow_up' | 'expiry_warning' | 'status_change';
  message: string;
  createdAt: string;
  isRead: boolean;
}