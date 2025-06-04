
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export type RoleType = 'owner' | 'admin' | 'manager' | 'staff' | 'professional';

export interface Role {
  id: string;
  business_id: string;
  name: string;
  description: string;
  role_type: RoleType;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export const useRoles = () => {
  const { businessId } = useTenant();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!businessId) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('roles')
          .select('*')
          .eq('business_id', businessId)
          .order('role_type', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setRoles(data || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [businessId]);

  const createDefaultRoles = async () => {
    if (!businessId) return;

    try {
      const { error } = await supabase.rpc('create_default_roles_for_business', {
        business_id_param: businessId
      });

      if (error) throw error;

      // Refresh roles after creation
      const { data, error: fetchError } = await supabase
        .from('roles')
        .select('*')
        .eq('business_id', businessId)
        .order('role_type', { ascending: true });

      if (fetchError) throw fetchError;
      setRoles(data || []);
    } catch (err) {
      console.error('Error creating default roles:', err);
      throw err;
    }
  };

  return {
    roles,
    loading,
    error,
    createDefaultRoles,
  };
};
