
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';

type Permission = 'agendamentos' | 'clientes' | 'financeiro' | 'estoque' | 'relatorios' | 'configuracoes' | 'marketing';

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState<Record<Permission, boolean>>({
    agendamentos: false,
    clientes: false,
    financeiro: false,
    estoque: false,
    relatorios: false,
    configuracoes: false,
    marketing: false
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const checkPermissions = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Check if user is admin using the updated function
        const { data: isAdminData, error: isAdminError } = await supabase.rpc('user_is_admin_for_tenant', {
          tenant_id: businessId
        });

        if (isAdminError) {
          console.error('Error checking admin status:', isAdminError);
          toast.error('Erro ao verificar permissões de administrador');
        } else {
          setIsAdmin(!!isAdminData);
          
          // If user is admin, set all permissions to true
          if (isAdminData) {
            setPermissions({
              agendamentos: true,
              clientes: true,
              financeiro: true,
              estoque: true,
              relatorios: true,
              configuracoes: true,
              marketing: true
            });
          } else {
            // Otherwise, check individual permissions
            const permissionsChecks = await Promise.all([
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'agendamentos' }),
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'clientes' }),
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'financeiro' }),
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'estoque' }),
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'relatorios' }),
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'configuracoes' }),
              supabase.rpc('user_has_permission_on_resource', { resource_name: 'marketing' })
            ]);

            setPermissions({
              agendamentos: !!permissionsChecks[0].data,
              clientes: !!permissionsChecks[1].data,
              financeiro: !!permissionsChecks[2].data,
              estoque: !!permissionsChecks[3].data,
              relatorios: !!permissionsChecks[4].data,
              configuracoes: !!permissionsChecks[5].data,
              marketing: !!permissionsChecks[6].data
            });
          }
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        toast.error('Erro ao verificar permissões');
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [businessId]);

  return {
    permissions,
    isAdmin,
    loading,
    hasPermission: (permission: Permission): boolean => {
      return isAdmin || permissions[permission];
    }
  };
};

export default useUserPermissions;
