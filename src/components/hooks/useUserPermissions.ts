import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchWithCache } from '@/integrations/supabase/client';

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
      
      // Tentar obter do cache primeiro
      const cacheKey = `user_role_${user.id}_${tenantId}`;
      const roleData = await fetchWithCache(
        cacheKey,
        async () => {
          // Buscar o papel do usuário no tenant atual
          const { data, error } = await supabase
            .from('tenant_users')
            .select('role')
            .eq('tenant_id', tenantId)
            .eq('user_id', user.id)
            .single();
          
          if (error) throw error;
          
          return data;
        },
        30 // cache por 30 minutos
      );
      
      setRole(roleData.role as Role);
      
      // Buscar permissões associadas ao papel com cache
      const permCacheKey = `user_permissions_${user.id}_${roleData.role}_${tenantId}`;
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
        30 // cache por 30 minutos
      );
      
      // Extrair permissões do resultado
      const userPermissions = permissionsData
        .map(item => item.permissions)
        .filter(Boolean);
      
      setPermissions(userPermissions);
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
