
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
      
      // Get business association to determine role
      const { data: businessUser, error: businessError } = await supabase
        .from('business_users')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (businessError && businessError.code !== 'PGRST116') {
        throw businessError;
      }
      
      // Default to staff if no specific role found
      const userRole = (businessUser?.role as Role) || 'staff';
      setRole(userRole);
      
      // Set default permissions based on role
      const defaultPermissions: Permission[] = [];
      
      if (userRole === 'admin') {
        defaultPermissions.push(
          { id: '1', name: 'manage_all', description: 'Gerenciar tudo' },
          { id: '2', name: 'view_reports', description: 'Ver relatórios' },
          { id: '3', name: 'manage_users', description: 'Gerenciar usuários' },
          { id: '4', name: 'manage_appointments', description: 'Gerenciar agendamentos' },
          { id: '5', name: 'manage_clients', description: 'Gerenciar clientes' }
        );
      } else if (userRole === 'manager') {
        defaultPermissions.push(
          { id: '2', name: 'view_reports', description: 'Ver relatórios' },
          { id: '4', name: 'manage_appointments', description: 'Gerenciar agendamentos' },
          { id: '5', name: 'manage_clients', description: 'Gerenciar clientes' }
        );
      } else {
        defaultPermissions.push(
          { id: '4', name: 'manage_appointments', description: 'Gerenciar agendamentos' },
          { id: '5', name: 'manage_clients', description: 'Gerenciar clientes' }
        );
      }
      
      setPermissions(defaultPermissions);
    } catch (error: any) {
      console.error('Erro ao buscar papel e permissões do usuário:', error);
      setError(error.message);
      // Set default staff role on error
      setRole('staff');
      setPermissions([
        { id: '4', name: 'manage_appointments', description: 'Gerenciar agendamentos' },
        { id: '5', name: 'manage_clients', description: 'Gerenciar clientes' }
      ]);
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

  // Check if user can access a protected section
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
