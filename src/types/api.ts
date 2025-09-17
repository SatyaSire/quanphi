// API Types for ContractorPro CRM

// Common types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardData {
  kpis: {
    activeProjects: number;
    pendingQuotations: number;
    duePayments: number;
    workersOnsite: number;
    lowStockMaterials: number;
  };
  charts: {
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    expenseSplit: Array<{ category: string; amount: number; percentage: number }>;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'project' | 'task' | 'payment' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// AI Chat types
export interface AIQueryRequest {
  question: string;
  contextPayload: {
    role: string;
    orgId: string;
    allowedScope: string[];
  };
  userId: string;
  allowedResourceIds: string[];
}

export interface AIResponse {
  answer: string;
  references: Array<{
    id: string;
    type: string;
    title: string;
    link: string;
  }>;
}

// Project types
export interface Project extends BaseEntity {
  name: string;
  clientId: string;
  clientName: string;
  address: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  assignedStaff: string[];
  linkedQuotationId?: string;
  tags: string[];
  progress: number;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
  milestones: Milestone[];
  expenses: ProjectExpense[];
  documents: ProjectDocument[];
  payments: Payment[];
  workers: ProjectWorker[];
  materials: ProjectMaterial[];
}

export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  clientId?: string;
  status?: string;
  managerId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreateProjectRequest {
  name: string;
  clientId: string;
  address: string;
  startDate: string;
  endDate: string;
  budget: number;
  assignedStaff: string[];
  linkedQuotationId?: string;
  tags: string[];
}

// Task types
export interface Task extends BaseEntity {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  assigneeName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate: string;
  attachments: TaskAttachment[];
  checklist: ChecklistItem[];
  comments: TaskComment[];
  position: number;
}

export interface TasksQueryParams {
  projectId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  checklist?: Array<{ text: string; completed: boolean }>;
}

export interface TaskAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// Milestone types
export interface Milestone extends BaseEntity {
  title: string;
  description: string;
  projectId: string;
  dueDate: string;
  paymentAmount?: number;
  status: 'pending' | 'in-progress' | 'completed';
  linkedTasks: string[];
  completedAt?: string;
}

export interface CreateMilestoneRequest {
  title: string;
  description: string;
  dueDate: string;
  paymentAmount?: number;
  linkedTasks: string[];
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  paymentAmount?: number;
  linkedTasks?: string[];
  status?: 'pending' | 'in-progress' | 'completed';
}

// Client types
export type ClientStatus = 'active' | 'archived' | 'blacklisted';
export type CompanyType = 'individual' | 'company' | 'government';
export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'sms';
export type RiskLevel = 'low' | 'medium' | 'high';
export type CommunicationType = 'email' | 'call' | 'meeting' | 'whatsapp' | 'sms';

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

export interface ClientDocument {
  id: string;
  filename: string;
  type: 'pan' | 'gst' | 'aadhar' | 'incorporation' | 'contract' | 'sitemap' | 'other';
  url: string;
  size: number;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CommunicationEntry {
  id: string;
  type: CommunicationType;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  contactPerson?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  attachments?: string[];
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

export interface ClientFinancialSummary {
  totalProjects: number;
  totalInvoices: number;
  totalAmountInvoiced: number;
  totalAmountPaid: number;
  outstandingAmount: number;
  overdueAmount: number;
  creditLimit?: number;
  averagePaymentDelay: number; // in days
  lastPaymentDate?: string;
}

export interface Client extends BaseEntity {
  // Basic Information
  name: string;
  businessName?: string;
  companyType: CompanyType;
  
  // Contact Information
  primaryContact: ClientContact;
  additionalContacts: ClientContact[];
  preferredContactMethod: ContactMethod;
  
  // Address Information
  addresses: ClientAddress[];
  
  // Business Information
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  
  // Status and Classification
  status: ClientStatus;
  riskLevel: RiskLevel;
  tags: ClientTag[];
  
  // Financial Information
  financialSummary: ClientFinancialSummary;
  
  // Internal Information
  notes: ClientNote[];
  internalComments?: string;
  
  // Metadata
  lastActivity?: string;
  createdBy: string;
  assignedManager?: string;
}

export interface ClientDetail extends Client {
  projects: Project[];
  quotations: QuotationSummary[];
  invoices: Invoice[];
  payments: Payment[];
  documents: ClientDocument[];
  communicationHistory: CommunicationEntry[];
  paymentLedger: PaymentLedgerEntry[];
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  reason?: string;
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
  // Basic Information
  name: string;
  businessName?: string;
  companyType: CompanyType;
  
  // Primary Contact
  primaryContact: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  
  // Additional Contacts
  additionalContacts?: Array<{
    name: string;
    designation: string;
    email: string;
    phone: string;
  }>;
  
  // Address Information
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
  
  // Business Information
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  
  // Preferences
  preferredContactMethod: ContactMethod;
  creditLimit?: number;
  
  // Internal Information
  internalComments?: string;
  assignedManager?: string;
  tags?: string[];
}

export interface UpdateClientRequest {
  name?: string;
  businessName?: string;
  companyType?: CompanyType;
  primaryContact?: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  additionalContacts?: Array<{
    id?: string;
    name: string;
    designation: string;
    email: string;
    phone: string;
  }>;
  addresses?: Array<{
    id?: string;
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
  preferredContactMethod?: ContactMethod;
  creditLimit?: number;
  status?: ClientStatus;
  riskLevel?: RiskLevel;
  internalComments?: string;
  assignedManager?: string;
  tags?: string[];
}

export interface CreateClientNoteRequest {
  content: string;
  type: 'general' | 'warning' | 'legal' | 'payment';
  isInternal: boolean;
}

export interface CreateCommunicationEntryRequest {
  type: CommunicationType;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  contactPerson?: string;
  attachments?: File[];
}

export interface UploadClientDocumentRequest {
  file: File;
  type: 'pan' | 'gst' | 'aadhar' | 'incorporation' | 'contract' | 'sitemap' | 'other';
  description?: string;
}

// Invoice types
export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  quotationId?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidAmount: number;
  remainingAmount: number;
  sentAt?: string;
  paidAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoicesQueryParams {
  page?: number;
  limit?: number;
  clientId?: string;
  status?: string;
  overdue?: boolean;
  search?: string;
}

export interface CreateInvoiceRequest {
  clientId: string;
  projectId?: string;
  quotationId?: string;
  items: Omit<InvoiceItem, 'id'>[];
  taxRate: number;
  dueDate: string;
}

// Payment types
export interface Payment extends BaseEntity {
  invoiceId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank-transfer' | 'cheque' | 'card' | 'upi';
  reference: string;
  notes?: string;
  receiptUrl?: string;
}

export interface CreatePaymentRequest {
  invoiceId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank-transfer' | 'cheque' | 'card' | 'upi';
  reference: string;
  notes?: string;
  idempotencyKey: string;
}

export interface RecordPaymentRequest {
  invoiceId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank-transfer' | 'cheque' | 'card' | 'upi';
  reference: string;
  notes?: string;
  receiptFile?: File;
  idempotencyKey: string;
}

export interface PaymentLedgerEntry {
  id: string;
  type: 'invoice' | 'payment';
  amount: number;
  balance: number;
  description: string;
  date: string;
}

// Supporting types
export interface QuotationSummary extends BaseEntity {
  quotationNumber: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  totalAmount: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

export interface ProjectExpense extends BaseEntity {
  projectId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
}

export interface ProjectDocument extends BaseEntity {
  projectId: string;
  filename: string;
  url: string;
  size: number;
  uploadedBy: string;
}

export interface ProjectWorker {
  userId: string;
  userName: string;
  role: string;
  attendanceToday: boolean;
  hoursWorked: number;
}

export interface ProjectMaterial {
  materialId: string;
  materialName: string;
  allocatedQuantity: number;
  usedQuantity: number;
  unit: string;
}