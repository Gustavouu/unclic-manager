
import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchWithCache } from '@/integrations/supabase/client';

export type Role = 'admin' | 'manager' | 'staff';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface UsePermissionsResult {
  role: Role | null;
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
  hasPermission: (permissionName: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  canAccess: (requiredPermissions: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(): UsePermissionsResult {
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current user data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get current business ID from localStorage
      const businessId = localStorage.getItem('currentBusinessId');
      
      if (!businessId) {
        throw new Error('No business selected');
      }
      
      // Try to get from cache first
      const cacheKey = `user_role_${user.id}_${businessId}`;
      const roleData = await fetchWithCache(
        cacheKey,
        async () => {
          // Fetch the user's role in the current business
          const { data, error } = await supabase
            .from('business_users')
            .select('role')
            .eq('business_id', businessId)
            .eq('user_id', user.id)
            .single();
          
          if (error) throw error;
          
          return data;
        },
        30 * 60 * 1000 // cache for 30 minutes
      );
      
      setRole(roleData.role as Role);
      
      // Fetch permissions associated with the role using cache
      const permCacheKey = `user_permissions_${user.id}_${roleData.role}_${businessId}`;
      const permissionsData = await fetchWithCache(
        permCacheKey,
        async () => {
          const { data, error } = await supabase
            .from('role_permissions')
            .select(`
              permissions:permission_id (
                id,
                name,
                description
              )
            `)
            .eq('role_id', roleData.role)
            .order('permissions.name');
          
          if (error) throw error;
          
          return data;
        },
        30 * 60 * 1000 // cache for 30 minutes
      );
      
      // Extract permissions from the result and fix the type
      const userPermissions = permissionsData
        .map(item => item.permissions as unknown as Permission)
        .filter(Boolean);
      
      setPermissions(userPermissions);
    } catch (error: any) {
      console.error('Error fetching user role and permissions:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has a specific permission
  const hasPermission = useCallback((permissionName: string): boolean => {
    return permissions.some(permission => permission.name === permissionName);
  }, [permissions]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return role === 'admin';
  }, [role]);

  // Check if user is manager
  const isManager = useCallback((): boolean => {
    return role === 'manager' || role === 'admin';
  }, [role]);

  // Check if user has access to a protected section
  const canAccess = useCallback((requiredPermissions: string[]): boolean => {
    // Admins have access to everything
    if (isAdmin()) return true;
    
    // Check if user has at least one of the required permissions
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [hasPermission, isAdmin]);

  // Load role and permissions when component mounts
  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  return {
    role,
    permissions,
    isLoading,
    error,
    hasPermission,
    isAdmin,
    isManager,
    canAccess,
    refreshPermissions: fetchUserRole
  };
}
