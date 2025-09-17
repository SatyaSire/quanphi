export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  changes?: AuditChange[];
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'LOGIN'
  | 'LOGOUT'
  | 'UPLOAD_DOCUMENT'
  | 'DELETE_DOCUMENT'
  | 'DOWNLOAD_DOCUMENT'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'ASSIGN_PROJECT'
  | 'UNASSIGN_PROJECT'
  | 'CHANGE_ROLE'
  | 'RESET_PASSWORD'
  | 'EXPORT_DATA'
  | 'BULK_UPDATE'
  | 'BULK_DELETE';

export type EntityType = 
  | 'WORKER'
  | 'DOCUMENT'
  | 'PROJECT'
  | 'USER'
  | 'ROLE'
  | 'PAYMENT'
  | 'ATTENDANCE'
  | 'REPORT';

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  fieldType?: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
}

export interface AuditFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction;
  entityType?: EntityType;
  entityId?: string;
  search?: string;
}

export interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  weekLogs: number;
  monthLogs: number;
  topActions: { action: AuditAction; count: number }[];
  topUsers: { userId: string; userName: string; count: number }[];
  activityByHour: { hour: number; count: number }[];
}

export interface AuditExport {
  format: 'csv' | 'excel' | 'pdf';
  filters: AuditFilter;
  includeMetadata: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}