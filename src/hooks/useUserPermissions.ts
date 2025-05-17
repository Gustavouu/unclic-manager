
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserPermission {
  id: string;
  module: string;
  action: string;
  name: string;
  description?: string;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  isAdmin: boolean;
  permissions: UserPermission[];
}

export const useUserPermissions = (userId?: string) => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if user has admin access first
        const { data: adminCheck, error: adminError } = await supabase
          .rpc('user_is_admin');
          
        if (!adminError && adminCheck === true) {
          console.log('User is admin, granting full access');
          setIsAdmin(true);
          setUserRoles([{ 
            id: 'admin', 
            name: 'Admin', 
            description: 'Full access', 
            isAdmin: true,
            permissions: [] 
          }]);
          setPermissions([]);
          return;
        }
        
        // For demo purposes, set some default values
        // In a real app, these would come from the database
        setIsAdmin(true); // Default to admin for demo
        setUserRoles([{ 
          id: 'admin', 
          name: 'Admin', 
          description: 'Full access', 
          isAdmin: true,
          permissions: [{
            id: 'services-manage',
            module: 'services',
            action: 'manage',
            name: 'services.manage',
            description: 'Manage services'
          }] 
        }]);
        setPermissions([{
          id: 'services-manage',
          module: 'services',
          action: 'manage',
          name: 'services.manage',
          description: 'Manage services'
        }]);
        
      } catch (err: any) {
        console.error('Error in useUserPermissions:', err);
        setError(err.message);
        toast.error('Erro ao carregar permissões do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [userId]);

  // Helper method to check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    if (isAdmin) return true;
    return permissions.some(p => p.name === permissionName);
  };

  return { 
    userRoles, 
    permissions,
    isAdmin,
    isLoading,
    error,
    hasPermission
  };
};

export default useUserPermissions;
