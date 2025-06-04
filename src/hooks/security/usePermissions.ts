
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type Permission = 
  | 'appointments.view' 
  | 'appointments.create' 
  | 'appointments.edit' 
  | 'appointments.delete'
  | 'clients.view' 
  | 'clients.create' 
  | 'clients.edit' 
  | 'clients.delete'
  | 'services.view' 
  | 'services.create' 
  | 'services.edit' 
  | 'services.delete'
  | 'professionals.view' 
  | 'professionals.create' 
  | 'professionals.edit' 
  | 'professionals.delete'
  | 'financial.view' 
  | 'financial.create' 
  | 'financial.edit' 
  | 'financial.delete'
  | 'reports.view' 
  | 'reports.create' 
  | 'reports.edit' 
  | 'reports.delete'
  | 'inventory.view' 
  | 'inventory.create' 
  | 'inventory.edit' 
  | 'inventory.delete'
  | 'settings.view' 
  | 'settings.edit'
  | 'admin.full_access'
  | 'read' 
  | 'write' 
  | 'delete' 
  | 'admin';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock admin check - in real app this would check user roles
  const isAdmin = user?.email === 'admin@example.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    // Simulate loading permissions
    const loadPermissions = async () => {
      setLoading(true);
      
      // Mock permissions based on user
      setTimeout(() => {
        if (isAdmin) {
          setPermissions([
            'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
            'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
            'services.view', 'services.create', 'services.edit', 'services.delete',
            'professionals.view', 'professionals.create', 'professionals.edit', 'professionals.delete',
            'financial.view', 'financial.create', 'financial.edit', 'financial.delete',
            'reports.view', 'reports.create', 'reports.edit', 'reports.delete',
            'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
            'settings.view', 'settings.edit',
            'admin.full_access',
            'read', 'write', 'delete', 'admin'
          ]);
        } else if (user) {
          setPermissions([
            'appointments.view', 'appointments.create',
            'clients.view', 'clients.create',
            'services.view',
            'read', 'write'
          ]);
        } else {
          setPermissions([]);
        }
        setLoading(false);
      }, 500);
    };

    loadPermissions();
  }, [user, isAdmin]);

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  // Check if user has any of the provided permissions
  const hasAnyPermission = (permissionList: Permission[]): boolean => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  // Check if user has all of the provided permissions
  const hasAllPermissions = (permissionList: Permission[]): boolean => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    isAdmin,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
