
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';

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
  | 'inventory.view'
  | 'inventory.create'
  | 'inventory.edit'
  | 'inventory.delete'
  | 'settings.view'
  | 'settings.edit'
  | 'admin.full_access';

export const usePermissions = () => {
  const { user } = useAuth();
  const { businessId } = useTenant();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !businessId) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: rpcError } = await supabase.rpc(
          'get_user_permissions', 
          {
            user_id_param: user.id,
            business_id_param: businessId
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        setPermissions(data || []);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user, businessId]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission) || permissions.includes('admin.full_access');
  };

  const hasAnyPermission = (permissionList: Permission[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: Permission[]): boolean => {
    return permissionList.every(permission => hasPermission(permission));
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: hasPermission('admin.full_access'),
  };
};
