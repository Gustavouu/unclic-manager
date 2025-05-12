import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'admin' | 'manager' | 'staff';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

// Helper function to work with cached data
const getCachedData = (key: string): any | null => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
      const { data, timestamp } = JSON.parse(cachedItem);
      const cacheAge = (Date.now() - timestamp) / (1000 * 60); // in minutes
      
      if (cacheAge < 30) { // Cache valid for 30 minutes
        return data;
      }
    }
  } catch (error) {
    console.error('Error processing cache:', error);
  }
  return null;
};

// Helper function to set cached data
const setCacheData = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error storing in cache:', error);
  }
};

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
      const cachedRole = getCachedData(cacheKey);
      
      let roleData;
      if (cachedRole) {
        roleData = cachedRole;
      } else {
        // Buscar o papel do usuário no tenant atual
        const { data, error } = await supabase
          .from('tenant_users')
          .select('role')
          .eq('tenant_id', tenantId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        roleData = data;
        setCacheData(cacheKey, roleData);
      }
      
      setRole(roleData.role as Role);
      
      // Buscar permissões associadas ao papel com cache
      const permCacheKey = `user_permissions_${user.id}_${roleData.role}_${tenantId}`;
      const cachedPermissions = getCachedData(permCacheKey);
      
      let permissionsData;
      if (cachedPermissions) {
        permissionsData = cachedPermissions;
      } else {
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
        
        permissionsData = data;
        setCacheData(permCacheKey, permissionsData);
      }
      
      // Extrair permissões do resultado e corrigir o tipo
      const userPermissions = permissionsData
        .map(item => item.permissions as unknown as Permission)
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
    hasPermission: useCallback((permissionName: string): boolean => {
      return permissions.some(permission => permission.name === permissionName);
    }, [permissions]),
    isAdmin: useCallback((): boolean => {
      return role === 'admin';
    }, [role]),
    isManager: useCallback((): boolean => {
      return role === 'manager' || role === 'admin';
    }, [role]),
    canAccess: useCallback((requiredPermissions: string[]): boolean => {
      // Admins têm acesso a tudo
      if (role === 'admin') return true;
      
      // Verificar se o usuário tem pelo menos uma das permissões requeridas
      return requiredPermissions.some(permission => 
        permissions.some(p => p.name === permission)
      );
    }, [permissions, role]),
    refreshPermissions: fetchUserRole
  };
}
