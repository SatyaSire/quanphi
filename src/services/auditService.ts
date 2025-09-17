import { AuditLog, AuditAction, EntityType, AuditChange, AuditFilter, AuditStats } from '../types/audit';

class AuditService {
  private logs: AuditLog[] = [];
  private listeners: ((log: AuditLog) => void)[] = [];

  constructor() {
    // Load existing logs from localStorage
    this.loadLogs();
    // Generate some sample audit logs for demonstration
    this.generateSampleLogs();
  }

  // Log an activity
  async logActivity(
    action: AuditAction,
    entityType: EntityType,
    entityId: string,
    entityName?: string,
    changes?: AuditChange[],
    metadata?: Record<string, any>
  ): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) return;

    const log: AuditLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      entityName,
      changes,
      metadata,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.logs.unshift(log); // Add to beginning for chronological order
    this.saveLogs();
    this.notifyListeners(log);
  }

  // Get logs with filtering and pagination
  getLogs(
    filter: AuditFilter = {},
    page: number = 1,
    limit: number = 50
  ): { logs: AuditLog[]; total: number; hasMore: boolean } {
    let filteredLogs = [...this.logs];

    // Apply filters
    if (filter.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(filter.startDate!)
      );
    }

    if (filter.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(filter.endDate!)
      );
    }

    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
    }

    if (filter.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filter.action);
    }

    if (filter.entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === filter.entityType);
    }

    if (filter.entityId) {
      filteredLogs = filteredLogs.filter(log => log.entityId === filter.entityId);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.userName.toLowerCase().includes(searchTerm) ||
        log.action.toLowerCase().includes(searchTerm) ||
        log.entityType.toLowerCase().includes(searchTerm) ||
        (log.entityName && log.entityName.toLowerCase().includes(searchTerm))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      hasMore: endIndex < filteredLogs.length
    };
  }

  // Get audit statistics
  getStats(): AuditStats {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayLogs = this.logs.filter(log => new Date(log.timestamp) >= today).length;
    const weekLogs = this.logs.filter(log => new Date(log.timestamp) >= weekAgo).length;
    const monthLogs = this.logs.filter(log => new Date(log.timestamp) >= monthAgo).length;

    // Top actions
    const actionCounts: Record<string, number> = {};
    this.logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action: action as AuditAction, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top users
    const userCounts: Record<string, { name: string; count: number }> = {};
    this.logs.forEach(log => {
      if (!userCounts[log.userId]) {
        userCounts[log.userId] = { name: log.userName, count: 0 };
      }
      userCounts[log.userId].count++;
    });
    const topUsers = Object.entries(userCounts)
      .map(([userId, data]) => ({ userId, userName: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Activity by hour
    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }
    this.logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts[hour]++;
    });
    const activityByHour = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));

    return {
      totalLogs: this.logs.length,
      todayLogs,
      weekLogs,
      monthLogs,
      topActions,
      topUsers,
      activityByHour
    };
  }

  // Subscribe to new audit logs
  subscribe(callback: (log: AuditLog) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Export audit logs
  async exportLogs(format: 'csv' | 'excel' | 'pdf', filter: AuditFilter = {}): Promise<Blob> {
    const { logs } = this.getLogs(filter, 1, 10000); // Get all matching logs

    switch (format) {
      case 'csv':
        return this.exportToCSV(logs);
      case 'excel':
        return this.exportToExcel(logs);
      case 'pdf':
        return this.exportToPDF(logs);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Clear old logs (retention policy)
  clearOldLogs(daysToKeep: number = 90): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    this.logs = this.logs.filter(log => new Date(log.timestamp) > cutoffDate);
    this.saveLogs();
  }

  // Private methods
  private getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real app, you'd get this from your backend
      return '192.168.1.1';
    } catch {
      return 'unknown';
    }
  }

  private loadLogs(): void {
    try {
      const stored = localStorage.getItem('auditLogs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
      this.logs = [];
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('auditLogs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving audit logs:', error);
    }
  }

  private notifyListeners(log: AuditLog): void {
    this.listeners.forEach(callback => {
      try {
        callback(log);
      } catch (error) {
        console.error('Error in audit log listener:', error);
      }
    });
  }

  private exportToCSV(logs: AuditLog[]): Blob {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Entity Name', 'Changes'];
    const rows = logs.map(log => [
      log.timestamp,
      log.userName,
      log.userRole,
      log.action,
      log.entityType,
      log.entityName || '',
      log.changes ? JSON.stringify(log.changes) : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  private exportToExcel(logs: AuditLog[]): Blob {
    // For demo purposes, export as CSV with Excel MIME type
    const csv = this.exportToCSV(logs);
    return new Blob([csv], { type: 'application/vnd.ms-excel' });
  }

  private exportToPDF(logs: AuditLog[]): Blob {
    // For demo purposes, create a simple text-based PDF
    const content = logs.map(log => 
      `${log.timestamp} - ${log.userName} (${log.userRole}) performed ${log.action} on ${log.entityType}${log.entityName ? ` (${log.entityName})` : ''}`
    ).join('\n');

    return new Blob([content], { type: 'application/pdf' });
  }

  private generateSampleLogs(): void {
    if (this.logs.length > 0) return; // Don't generate if logs already exist

    const sampleLogs: Partial<AuditLog>[] = [
      {
        action: 'CREATE',
        entityType: 'WORKER',
        entityId: 'worker-1',
        entityName: 'John Smith',
        changes: [{ field: 'status', oldValue: null, newValue: 'active' }]
      },
      {
        action: 'UPDATE',
        entityType: 'WORKER',
        entityId: 'worker-2',
        entityName: 'Jane Doe',
        changes: [{ field: 'role', oldValue: 'Worker', newValue: 'Senior Worker' }]
      },
      {
        action: 'UPLOAD_DOCUMENT',
        entityType: 'DOCUMENT',
        entityId: 'doc-1',
        entityName: 'ID Proof - John Smith'
      },
      {
        action: 'LOGIN',
        entityType: 'USER',
        entityId: 'user-1'
      },
      {
        action: 'DELETE',
        entityType: 'WORKER',
        entityId: 'worker-3',
        entityName: 'Bob Johnson'
      }
    ];

    const users = [
      { id: '1', name: 'John Admin', role: 'admin' },
      { id: '2', name: 'Sarah Manager', role: 'site_manager' },
      { id: '3', name: 'Mike Accountant', role: 'accountant' }
    ];

    sampleLogs.forEach((logData, index) => {
      const user = users[index % users.length];
      const timestamp = new Date(Date.now() - (index * 60 * 60 * 1000)).toISOString();
      
      const log: AuditLog = {
        id: this.generateId(),
        timestamp,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...logData
      } as AuditLog;

      this.logs.push(log);
    });

    this.saveLogs();
  }
}

// Export singleton instance
export const auditService = new AuditService();
export default auditService;