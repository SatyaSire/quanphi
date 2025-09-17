export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
  subcategory?: string;
  uploadDate: string;
  expiryDate?: string;
  version: number;
  versions: DocumentVersion[];
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  linkedEntity?: {
    type: 'worker' | 'project' | 'client';
    id: string;
    name: string;
  };
  tags: string[];
  notes?: string;
  status: 'active' | 'expired' | 'archived' | 'pending';
  accessLevel: 'public' | 'restricted' | 'confidential';
  downloadCount: number;
  lastAccessed?: string;
  isEncrypted: boolean;
  thumbnailUrl?: string;
  fileUrl: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  notes?: string;
  fileUrl: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subcategories: string[];
  mandatoryFields?: string[];
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
  requiresExpiry: boolean;
}

export interface DocumentFilter {
  search?: string;
  category?: string;
  subcategory?: string;
  status?: string;
  linkedEntityType?: 'worker' | 'project' | 'client';
  linkedEntityId?: string;
  uploadDateFrom?: string;
  uploadDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  uploadedBy?: string;
  tags?: string[];
  accessLevel?: string;
  fileType?: string;
}

export interface DocumentStats {
  totalDocuments: number;
  uploadedToday: number;
  uploadedThisMonth: number;
  expiringThisWeek: number;
  expiringThisMonth: number;
  expiredDocuments: number;
  documentsByCategory: { [key: string]: number };
  documentsByStatus: { [key: string]: number };
  totalStorageUsed: number; // in MB
  averageFileSize: number; // in MB
}

export interface DocumentUpload {
  file: File;
  category: string;
  subcategory?: string;
  linkedEntity?: {
    type: 'worker' | 'project' | 'client';
    id: string;
  };
  tags: string[];
  notes?: string;
  expiryDate?: string;
  accessLevel: 'public' | 'restricted' | 'confidential';
}

export interface DocumentAuditLog {
  id: string;
  documentId: string;
  action: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'archive' | 'restore';
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export interface DocumentNotification {
  id: string;
  type: 'expiry_warning' | 'upload_notification' | 'missing_document' | 'access_request';
  documentId?: string;
  title: string;
  message: string;
  recipient: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface DocumentPermission {
  userId: string;
  documentId: string;
  permissions: {
    view: boolean;
    download: boolean;
    edit: boolean;
    delete: boolean;
    share: boolean;
  };
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface DocumentShareLink {
  id: string;
  documentId: string;
  token: string;
  expiresAt: string;
  maxDownloads?: number;
  downloadCount: number;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  requiresPassword: boolean;
}

export type DocumentSortField = 'name' | 'uploadDate' | 'expiryDate' | 'fileSize' | 'category' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface DocumentSort {
  field: DocumentSortField;
  order: SortOrder;
}

export interface DocumentBulkAction {
  action: 'download' | 'delete' | 'archive' | 'change_category' | 'add_tags' | 'remove_tags';
  documentIds: string[];
  metadata?: {
    category?: string;
    tags?: string[];
    notes?: string;
  };
}

export interface DocumentExportOptions {
  format: 'excel' | 'csv' | 'pdf';
  includeFields: string[];
  filters?: DocumentFilter;
  dateRange?: {
    from: string;
    to: string;
  };
}