
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { safeDataExtract } from '@/utils/databaseUtils';

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
        
        // Fetch user roles
        let userRolesData: UserRole[] = [];
        let fetchedPermissions: UserPermission[] = [];

        try {
          // Try to fetch user roles from the modern schema
          const response = await supabase
            .from('user_roles')
            .select(`
              id,
              role:roleId (
                id,
                name,
                description
              )
            `)
            .eq('userId', userId);

          const roleData = safeDataExtract(response);

          if (roleData && roleData.length > 0) {
            // Process role data
            const roles: UserRole[] = [];

            for (const userRole of roleData) {
              if (!userRole.role) continue;
              
              // Get permissions for this role
              const permResponse = await supabase
                .from('role_permissions')
                .select(`
                  permission:permissionId (
                    id,
                    name,
                    description,
                    module,
                    action
                  )
                `)
                .eq('roleId', userRole.role.id);
              
              const permissions = safeDataExtract(permResponse);
              
              const rolePermissions = permissions
                ? permissions.map(p => p.permission as UserPermission).filter(Boolean)
                : [];
              
              roles.push({
                id: userRole.role.id,
                name: userRole.role.name,
                description: userRole.role.description,
                isAdmin: userRole.role.name.toLowerCase() === 'admin',
                permissions: rolePermissions
              });
              
              fetchedPermissions = [...fetchedPermissions, ...rolePermissions];
            }

            setUserRoles(roles);
            setPermissions(fetchedPermissions);
            setIsAdmin(roles.some(role => role.isAdmin));
          }
        } catch (err) {
          console.error('Error fetching user roles:', err);
          throw err;
        }
        
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

  return { 
    userRoles, 
    permissions,
    isAdmin, 
    isLoading, 
    error 
  };
};

export default useUserPermissions;
