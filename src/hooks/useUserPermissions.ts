
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export type Role = 'admin' | 'manager' | 'staff' | 'owner';

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
  const { businessId } = useCurrentBusiness();

  const fetchUserRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      if (!businessId) {
        throw new Error('Business ID não encontrado');
      }
      
      // Get user's role from business_users and roles tables
      const { data: businessUser, error: businessError } = await supabase
        .from('business_users')
        .select(`
          role,
          roles!inner(
            id,
            name,
            role_type,
            role_permissions!inner(
              permissions!inner(
                id,
                name,
                description
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('business_id', businessId)
        .eq('status', 'active')
        .single();
      
      if (businessError && businessError.code !== 'PGRST116') {
        throw businessError;
      }
      
      // Set role and permissions based on the new system
      if (businessUser?.roles) {
        const userRole = businessUser.roles.role_type as Role;
        setRole(userRole);
        
        // Extract permissions from the nested structure
        const userPermissions: Permission[] = businessUser.roles.role_permissions
          ?.map(rp => rp.permissions)
          .filter(Boolean) || [];
        
        setPermissions(userPermissions);
      } else {
        // Fallback: set default staff role with basic permissions
        setRole('staff');
        setPermissions([
          { id: '4', name: 'appointments.view', description: 'Ver agendamentos' },
          { id: '5', name: 'appointments.create', description: 'Criar agendamentos' },
          { id: '6', name: 'clients.view', description: 'Ver clientes' },
          { id: '7', name: 'clients.create', description: 'Criar clientes' }
        ]);
      }
    } catch (error: any) {
      console.error('Erro ao buscar papel e permissões do usuário:', error);
      setError(error.message);
      // Set default staff role on error
      setRole('staff');
      setPermissions([
        { id: '4', name: 'appointments.view', description: 'Ver agendamentos' },
        { id: '5', name: 'appointments.create', description: 'Criar agendamentos' },
        { id: '6', name: 'clients.view', description: 'Ver clientes' },
        { id: '7', name: 'clients.create', description: 'Criar clientes' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permissionName: string): boolean => {
    return permissions.some(permission => permission.name === permissionName);
  }, [permissions]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return role === 'admin' || role === 'owner';
  }, [role]);

  // Check if user is manager
  const isManager = useCallback((): boolean => {
    return role === 'manager' || role === 'admin' || role === 'owner';
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
