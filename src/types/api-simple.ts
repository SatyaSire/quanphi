// Simplified API types to avoid module resolution issues

// Base types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Client types
export type ClientStatus = 'active' | 'archived' | 'blacklisted';
export type CompanyType = 'individual' | 'company' | 'government';
export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'sms';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface ClientAddress {
  id: string;
  type: 'headquarters' | 'site' | 'billing';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: boolean;
}

export interface ClientContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface ClientTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface ClientFinancialSummary {
  totalProjects: number;
  totalInvoices: number;
  totalAmountInvoiced: number;
  totalAmountPaid: number;
  outstandingAmount: number;
  overdueAmount: number;
  creditLimit?: number;
  averagePaymentDelay: number;
  lastPaymentDate?: string;
}

export interface ClientNote {
  id: string;
  content: string;
  type: 'general' | 'warning' | 'legal' | 'payment';
  isInternal: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface Client extends BaseEntity {
  name: string;
  businessName?: string;
  companyType: CompanyType;
  primaryContact: ClientContact;
  additionalContacts: ClientContact[];
  preferredContactMethod: ContactMethod;
  addresses: ClientAddress[];
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  status: ClientStatus;
  riskLevel: RiskLevel;
  tags: ClientTag[];
  financialSummary: ClientFinancialSummary;
  notes: ClientNote[];
  internalComments?: string;
  lastActivity?: string;
  createdBy: string;
  assignedManager?: string;
}

export interface ClientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ClientStatus;
  riskLevel?: RiskLevel;
  companyType?: CompanyType;
  hasOutstanding?: boolean;
  region?: string;
  assignedManager?: string;
  createdAfter?: string;
  createdBefore?: string;
  lastActivityAfter?: string;
  lastActivityBefore?: string;
  tags?: string[];
  sortBy?: 'name' | 'createdAt' | 'lastActivity' | 'outstandingAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateClientRequest {
  name: string;
  businessName?: string;
  companyType: CompanyType;
  primaryContact: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  additionalContacts?: Array<{
    name: string;
    designation: string;
    email: string;
    phone: string;
  }>;
  addresses: Array<{
    type: 'headquarters' | 'site' | 'billing';
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isPrimary: boolean;
  }>;
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  preferredContactMethod: ContactMethod;
  creditLimit?: number;
  internalComments?: string;
  assignedManager?: string;
  tags?: string[];
}