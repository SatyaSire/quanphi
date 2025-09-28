// Client Portal Types

export interface ClientUser {
  id: string;
  email: string;
  name: string;
  companyName: string;
  phone: string;
  role: 'client_admin' | 'client_user';
  clientId: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  preferences: ClientPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ClientPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    inApp: boolean;
  };
  notificationTypes: {
    milestoneCompleted: boolean;
    changeRequestUpdated: boolean;
    invoiceGenerated: boolean;
    paymentDue: boolean;
    projectUpdates: boolean;
    documentUploaded: boolean;
  };
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  estimatedEndDate?: string;
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  milestones: ProjectMilestone[];
  team: {
    projectManager: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    workersCount: number;
  };
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  documents: ClientDocument[];
  recentUpdates: ProjectUpdate[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  dependencies: string[];
  deliverables: string[];
}

export interface ProjectUpdate {
  id: string;
  type: 'progress' | 'milestone' | 'issue' | 'photo' | 'document';
  title: string;
  description: string;
  images?: string[];
  videos?: string[];
  documents?: string[];
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: 'contract' | 'permit' | 'report' | 'drawing' | 'photo' | 'video' | 'other';
  category: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  isPublic: boolean;
  canDownload: boolean;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  uploadedAt: string;
  version: number;
  versions?: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  version: number;
  fileUrl: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
  changes: string;
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: 'design' | 'material' | 'scope' | 'timeline' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'clarification_needed';
  attachments: {
    images: string[];
    documents: string[];
  };
  impact: {
    cost: {
      estimated: number;
      approved?: number;
    };
    timeline: {
      estimatedDays: number;
      approvedDays?: number;
    };
    scope: string;
  };
  submittedBy: {
    id: string;
    name: string;
  };
  submittedAt: string;
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewedAt?: string;
  reviewComments?: string;
  approvalHistory: ChangeRequestApproval[];
}

export interface ChangeRequestApproval {
  id: string;
  action: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'clarification_requested';
  comments: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  performedAt: string;
}

export interface ClientInvoice {
  id: string;
  projectId: string;
  projectName: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  milestoneId?: string;
  milestoneName?: string;
  items: InvoiceItem[];
  taxes: {
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
  };
  paymentHistory: PaymentRecord[];
  createdAt: string;
  dueAt: string;
  paidAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card' | 'online';
  reference: string;
  paidAt: string;
  notes?: string;
}

export interface ClientMessage {
  id: string;
  projectId?: string;
  threadId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'system';
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  sender: {
    id: string;
    name: string;
    role: 'client' | 'admin' | 'project_manager' | 'system';
    avatar?: string;
  };
  isRead: boolean;
  sentAt: string;
  editedAt?: string;
}

export interface MessageThread {
  id: string;
  title: string;
  projectId?: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage: ClientMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientNotification {
  id: string;
  type: 'milestone_completed' | 'change_request_updated' | 'invoice_generated' | 'payment_due' | 'project_update' | 'document_uploaded' | 'message_received';
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'milestone' | 'change_request' | 'invoice' | 'document' | 'message';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  createdAt: string;
}

export interface ClientDashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    onHold: number;
  };
  payments: {
    totalDue: number;
    overdue: number;
    paidThisMonth: number;
    nextPaymentDue?: {
      amount: number;
      dueDate: string;
      projectName: string;
    };
  };
  changeRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  milestones: {
    upcoming: ProjectMilestone[];
    overdue: ProjectMilestone[];
    completed: number;
  };
}

export interface ClientReport {
  id: string;
  type: 'project_progress' | 'expense_summary' | 'payment_history' | 'custom';
  title: string;
  description: string;
  projectId?: string;
  dateRange: {
    from: string;
    to: string;
  };
  format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'ready' | 'failed';
  fileUrl?: string;
  requestedBy: {
    id: string;
    name: string;
  };
  requestedAt: string;
  generatedAt?: string;
  expiresAt: string;
}

export interface ClientApproval {
  id: string;
  type: 'document' | 'expense' | 'variation' | 'milestone';
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  relatedEntityId: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  documents: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  approvalHistory: {
    action: 'submitted' | 'approved' | 'rejected';
    comments?: string;
    performedBy: {
      id: string;
      name: string;
      role: string;
    };
    performedAt: string;
  }[];
  submittedBy: {
    id: string;
    name: string;
    role: string;
  };
  submittedAt: string;
}

export interface ClientMeeting {
  id: string;
  title: string;
  description: string;
  type: 'site_visit' | 'online_review' | 'progress_meeting' | 'other';
  projectId?: string;
  projectName?: string;
  scheduledAt: string;
  duration: number; // in minutes
  location?: {
    type: 'physical' | 'online';
    address?: string;
    meetingLink?: string;
  };
  attendees: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative';
  }[];
  agenda: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// API Response Types
export interface ClientPortalLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ClientUser;
  client: {
    id: string;
    name: string;
    businessName: string;
    logo?: string;
  };
}

export interface ClientPortalDashboardResponse {
  stats: ClientDashboardStats;
  recentProjects: ClientProject[];
  upcomingMilestones: ProjectMilestone[];
  recentNotifications: ClientNotification[];
  pendingApprovals: ClientApproval[];
}

// Form Types
export interface ClientLoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ClientOTPForm {
  email: string;
  otp: string;
}

export interface ClientProfileForm {
  name: string;
  phone: string;
  preferences: ClientPreferences;
}

export interface ChangeRequestForm {
  title: string;
  description: string;
  category: ChangeRequest['category'];
  priority: ChangeRequest['priority'];
  attachments: {
    images: File[];
    documents: File[];
  };
  estimatedCost?: number;
  estimatedDays?: number;
}

export interface ClientMessageForm {
  content: string;
  attachments?: File[];
}

export interface MeetingRequestForm {
  title: string;
  description: string;
  type: ClientMeeting['type'];
  projectId?: string;
  preferredDates: string[];
  duration: number;
  locationType: 'physical' | 'online';
  agenda: string[];
}