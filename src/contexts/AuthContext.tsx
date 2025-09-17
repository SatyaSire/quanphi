import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RolePermissions } from '../types/workers';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'site_manager' | 'accountant' | 'hr_manager';
  permissions: RolePermissions;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  canAccessWorkerData: (workerId: string) => boolean;
  canEditWorkerData: (workerId: string) => boolean;
  canDeleteWorker: (workerId: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default permissions for different roles
const rolePermissions: Record<string, RolePermissions> = {
  admin: {
    canViewWorkers: true,
    canCreateWorkers: true,
    canEditWorkers: true,
    canDeleteWorkers: true,
    canViewDocuments: true,
    canUploadDocuments: true,
    canViewPayments: true,
    canEditPayments: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canViewReports: true,
    canManageRoles: true,
    canViewAuditLogs: true
  },
  site_manager: {
    canViewWorkers: true,
    canCreateWorkers: true,
    canEditWorkers: true,
    canDeleteWorkers: false,
    canViewDocuments: true,
    canUploadDocuments: true,
    canViewPayments: false,
    canEditPayments: false,
    canViewAttendance: true,
    canEditAttendance: true,
    canViewReports: true,
    canManageRoles: false,
    canViewAuditLogs: false
  },
  accountant: {
    canViewWorkers: true,
    canCreateWorkers: false,
    canEditWorkers: false,
    canDeleteWorkers: false,
    canViewDocuments: true,
    canUploadDocuments: false,
    canViewPayments: true,
    canEditPayments: true,
    canViewAttendance: true,
    canEditAttendance: false,
    canViewReports: true,
    canManageRoles: false,
    canViewAuditLogs: false
  },
  hr_manager: {
    canViewWorkers: true,
    canCreateWorkers: true,
    canEditWorkers: true,
    canDeleteWorkers: true,
    canViewDocuments: true,
    canUploadDocuments: true,
    canViewPayments: false,
    canEditPayments: false,
    canViewAttendance: true,
    canEditAttendance: false,
    canViewReports: true,
    canManageRoles: false,
    canViewAuditLogs: true
  }
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    permissions: rolePermissions.admin
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@company.com',
    role: 'site_manager',
    permissions: rolePermissions.site_manager
  },
  {
    id: '3',
    name: 'Mike Accountant',
    email: 'accountant@company.com',
    role: 'accountant',
    permissions: rolePermissions.accountant
  },
  {
    id: '4',
    name: 'Lisa HR',
    email: 'hr@company.com',
    role: 'hr_manager',
    permissions: rolePermissions.hr_manager
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') { // Simple password check for demo
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!user) return false;
    return user.permissions[permission] || false;
  };

  const canAccessWorkerData = (workerId: string): boolean => {
    if (!user) return false;
    
    // Admin and HR can access all worker data
    if (user.role === 'admin' || user.role === 'hr_manager') {
      return true;
    }
    
    // Site managers can access workers in their projects
    if (user.role === 'site_manager') {
      // In a real app, you'd check if the worker is assigned to the manager's projects
      return hasPermission('canViewWorkers');
    }
    
    // Accountants can view worker data for payment purposes
    if (user.role === 'accountant') {
      return hasPermission('canViewWorkers');
    }
    
    return false;
  };

  const canEditWorkerData = (workerId: string): boolean => {
    if (!user) return false;
    
    // Check basic edit permission first
    if (!hasPermission('canEditWorkers')) {
      return false;
    }
    
    // Admin and HR can edit all worker data
    if (user.role === 'admin' || user.role === 'hr_manager') {
      return true;
    }
    
    // Site managers can edit workers in their projects (limited fields)
    if (user.role === 'site_manager') {
      // In a real app, you'd check project assignments and limit editable fields
      return true;
    }
    
    return false;
  };

  const canDeleteWorker = (workerId: string): boolean => {
    if (!user) return false;
    
    // Only admin and HR can delete workers
    return (user.role === 'admin' || user.role === 'hr_manager') && hasPermission('canDeleteWorkers');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    canAccessWorkerData,
    canEditWorkerData,
    canDeleteWorker,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: keyof RolePermissions
) => {
  return (props: P) => {
    const { user, hasPermission } = useAuth();
    
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }
    
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;