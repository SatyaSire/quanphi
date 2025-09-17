import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RolePermissions } from '../types/workers';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: keyof RolePermissions;
  role?: 'admin' | 'site_manager' | 'accountant' | 'hr_manager';
  roles?: ('admin' | 'site_manager' | 'accountant' | 'hr_manager')[];
  workerId?: string;
  action?: 'view' | 'edit' | 'delete';
  fallback?: ReactNode;
  showFallback?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  role,
  roles,
  workerId,
  action,
  fallback = null,
  showFallback = false
}) => {
  const { user, hasPermission, canAccessWorkerData, canEditWorkerData, canDeleteWorker } = useAuth();

  // If no user is logged in, deny access
  if (!user) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check specific role
  if (role && user.role !== role) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check if user has one of the specified roles
  if (roles && !roles.includes(user.role)) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check worker-specific permissions
  if (workerId && action) {
    switch (action) {
      case 'view':
        if (!canAccessWorkerData(workerId)) {
          return showFallback ? <>{fallback}</> : null;
        }
        break;
      case 'edit':
        if (!canEditWorkerData(workerId)) {
          return showFallback ? <>{fallback}</> : null;
        }
        break;
      case 'delete':
        if (!canDeleteWorker(workerId)) {
          return showFallback ? <>{fallback}</> : null;
        }
        break;
    }
  }

  // If all checks pass, render children
  return <>{children}</>;
};

// Convenience components for common use cases
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard role="admin" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const ManagerOrAdmin: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard roles={['admin', 'site_manager', 'hr_manager']} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanViewWorkers: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard permission="canViewWorkers" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanEditWorkers: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard permission="canEditWorkers" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanDeleteWorkers: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard permission="canDeleteWorkers" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanViewPayments: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard permission="canViewPayments" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanViewDocuments: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard permission="canViewDocuments" fallback={fallback}>
    {children}
  </PermissionGuard>
);

// Hook for checking permissions in components
export const usePermissions = () => {
  const { user, hasPermission, canAccessWorkerData, canEditWorkerData, canDeleteWorker } = useAuth();

  return {
    user,
    hasPermission,
    canAccessWorkerData,
    canEditWorkerData,
    canDeleteWorker,
    isAdmin: user?.role === 'admin',
    isSiteManager: user?.role === 'site_manager',
    isAccountant: user?.role === 'accountant',
    isHRManager: user?.role === 'hr_manager',
    canViewWorkers: hasPermission('canViewWorkers'),
    canCreateWorkers: hasPermission('canCreateWorkers'),
    canEditWorkers: hasPermission('canEditWorkers'),
    canDeleteWorkers: hasPermission('canDeleteWorkers'),
    canViewDocuments: hasPermission('canViewDocuments'),
    canUploadDocuments: hasPermission('canUploadDocuments'),
    canViewPayments: hasPermission('canViewPayments'),
    canEditPayments: hasPermission('canEditPayments'),
    canViewAttendance: hasPermission('canViewAttendance'),
    canEditAttendance: hasPermission('canEditAttendance'),
    canViewReports: hasPermission('canViewReports'),
    canManageRoles: hasPermission('canManageRoles'),
    canViewAuditLogs: hasPermission('canViewAuditLogs')
  };
};

export default PermissionGuard;