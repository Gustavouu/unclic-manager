
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'admin' | 'manager' | 'staff';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export function useUserPermissions() {
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Get tenant ID from localStorage
      const tenantId = localStorage.getItem('tenant_id');
      
      if (!tenantId) {
        // Try to get from business_users table
        const { data: businessUser, error: businessUserError } = await supabase
          .from('business_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (businessUserError) {
          console.log('Error getting role from business_users:', businessUserError);
          
          // Try from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('funcao')
            .eq('id', user.id)
            .maybeSingle();
            
          if (userError) {
            console.log('Error getting role from users:', userError);
            setRole('staff'); // Default fallback role
          } else if (userData) {
            setRole(mapLegacyRole(userData.funcao));
          } else {
            setRole('staff'); // Default fallback role
          }
        } else if (businessUser) {
          setRole(mapBusinessUserRole(businessUser.role));
        } else {
          setRole('staff'); // Default fallback role
        }
        
        // No tenant ID, so no permissions to load
        setPermissions([]);
        setIsLoading(false);
        return;
      }
      
      // With tenant ID, try to get roles and permissions
      try {
        // First try the modern roles system
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select(`
            roleId,
            roles:roleId (
              name
            )
          `)
          .eq('userId', user.id)
          .maybeSingle();
          
        if (roleError || !userRole) {
          console.log('No role found in user_roles, using default staff role');
          setRole('staff');
        } else {
          // Map role name to our Role type
          const roleName = userRole.roles?.name?.toLowerCase();
          if (roleName === 'admin' || roleName === 'manager') {
            setRole(roleName);
          } else {
            setRole('staff');
          }
          
          // Try to get permissions for this role
          const { data: permissionsData, error: permissionsError } = await supabase
            .from('role_permissions')
            .select(`
              permissions:permissionId (
                id,
                name,
                description
              )
            `)
            .eq('roleId', userRole.roleId);
            
          if (permissionsError) {
            console.error('Error fetching permissions:', permissionsError);
            setPermissions([]);
          } else if (permissionsData && permissionsData.length > 0) {
            // Extract permissions from result
            const extractedPermissions = permissionsData
              .map(item => item.permissions)
              .filter(Boolean);
              
            setPermissions(extractedPermissions);
          } else {
            setPermissions([]);
          }
        }
      } catch (err) {
        console.error('Error in permission loading:', err);
        setPermissions([]);
        setRole('staff'); // Default fallback
      }
    } catch (error: any) {
      console.error('Error in useUserPermissions:', error);
      setError(error.message);
      setRole('staff'); // Default fallback
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Map legacy role names to our Role type
  const mapLegacyRole = (role?: string): Role => {
    if (!role) return 'staff';
    
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('admin')) return 'admin';
    if (lowerRole.includes('gerente')) return 'manager';
    return 'staff';
  };
  
  // Map business_users role to our Role type
  const mapBusinessUserRole = (role?: string): Role => {
    if (!role) return 'staff';
    
    const lowerRole = role.toLowerCase();
    if (lowerRole === 'owner' || lowerRole === 'admin') return 'admin';
    if (lowerRole === 'manager') return 'manager';
    return 'staff';
  };

  // Check if user has a specific permission
  const hasPermission = useCallback((permissionName: string): boolean => {
    if (role === 'admin') return true; // Admins have all permissions
    return permissions.some(permission => permission.name === permissionName);
  }, [permissions, role]);

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
