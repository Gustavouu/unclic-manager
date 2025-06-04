
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';

interface Role {
  id: string;
  name: string;
  description: string;
  role_type: string;
  is_system: boolean;
}

export const useRoles = () => {
  const { businessId } = useOptimizedTenant();
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

        // For now, return default roles since the table structure isn't defined
        const defaultRoles: Role[] = [
          {
            id: '1',
            name: 'Administrador',
            description: 'Acesso completo ao sistema',
            role_type: 'admin',
            is_system: true
          },
          {
            id: '2',
            name: 'Gerente',
            description: 'Acesso gerencial',
            role_type: 'manager',
            is_system: true
          },
          {
            id: '3',
            name: 'Funcionário',
            description: 'Acesso básico',
            role_type: 'staff',
            is_system: true
          }
        ];

        setRoles(defaultRoles);
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

  return {
    roles,
    loading,
    error,
  };
};
