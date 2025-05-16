
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
      
      // Obter dados do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Obter tenant atual do localStorage
      const tenantId = localStorage.getItem('tenant_id');
      
      if (!tenantId) {
        throw new Error('Tenant não selecionado');
      }
      
      // Try main table first
      let roleData;
      let roleError;
      
      try {
        const response = await supabase
          .from('business_users') // Use a table that maps businesses to users
          .select('role')
          .eq('business_id', tenantId)
          .eq('user_id', user.id)
          .single();
          
        roleData = response.data;
        roleError = response.error;
      } catch (err) {
        console.error("Error fetching from business_users:", err);
        roleError = err;
      }
      
      // Try fallback if needed
      if (roleError) {
        console.log("Trying fallback user role lookup");
        
        try {
          const response = await supabase
            .from('users') // Try users table
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
            
          roleData = response.data;
          roleError = response.error;
        } catch (err) {
          console.error("Error in fallback user role lookup:", err);
          roleError = err;
        }
      }
      
      if (roleError || !roleData) {
        console.log("No role found, using default 'staff' role");
        setRole('staff' as Role);
      } else {
        setRole(roleData.role as Role);
      }
      
      // Try permissions lookup
      try {
        // Example: fetch permissions for the role from a permissions table or role-based system
        // This is a placeholder - adjust according to your schema
        const perms: Permission[] = [
          { id: '1', name: 'appointments.view', description: 'View appointments' },
          { id: '2', name: 'appointments.create', description: 'Create appointments' },
          { id: '3', name: 'clients.view', description: 'View clients' },
          { id: '4', name: 'clients.create', description: 'Create clients' }
        ];
        
        if (roleData?.role === 'admin' || roleData?.role === 'manager') {
          perms.push(
            { id: '5', name: 'services.manage', description: 'Manage services' },
            { id: '6', name: 'staff.manage', description: 'Manage staff' },
            { id: '7', name: 'settings.access', description: 'Access settings' }
          );
        }
        
        setPermissions(perms);
      } catch (permError: any) {
        console.error('Error fetching permissions:', permError);
        setError(permError.message);
      }
    } catch (error: any) {
      console.error('Erro ao buscar papel e permissões do usuário:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verifica se o usuário tem uma permissão específica
  const hasPermission = useCallback((permissionName: string): boolean => {
    return permissions.some(permission => permission.name === permissionName);
  }, [permissions]);

  // Verifica se o usuário é admin
  const isAdmin = useCallback((): boolean => {
    return role === 'admin';
  }, [role]);

  // Verifica se o usuário é gerente
  const isManager = useCallback((): boolean => {
    return role === 'manager' || role === 'admin';
  }, [role]);

  // Verifica se o usuário tem acesso a uma seção protegida
  const canAccess = useCallback((requiredPermissions: string[]): boolean => {
    // Admins têm acesso a tudo
    if (isAdmin()) return true;
    
    // Verificar se o usuário tem pelo menos uma das permissões requeridas
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [hasPermission, isAdmin]);

  // Carregar papel e permissões quando o componente montar
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
