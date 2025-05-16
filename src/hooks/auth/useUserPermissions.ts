

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserPermissions {
  // Permissões básicas
  isAdmin: boolean;
  isProfessional: boolean;
  
  // Permissões de serviços
  canCreateService: boolean;
  canEditService: boolean;
  canDeleteService: boolean;
  
  // Permissões de usuários
  canManageUsers: boolean;
  
  // Permissões de administração do Supabase
  canManageSecurityPolicies: boolean;
  canManageDatabaseSchema: boolean;
  canManageEdgeFunctions: boolean;
  canManageAuthentication: boolean;
  
  // Permissões de negócio
  canManageBusiness: boolean;
  canViewAnalytics: boolean;

  canCreateClient: boolean;
  canManageAppointments: boolean;
}

const defaultPermissions: UserPermissions = {
  isAdmin: false,
  isProfessional: true, // Por padrão, assume que é profissional
  canCreateService: false,
  canEditService: false,
  canDeleteService: false,
  canManageUsers: false,
  canManageSecurityPolicies: false,
  canManageDatabaseSchema: false,
  canManageEdgeFunctions: false,
  canManageAuthentication: false,
  canManageBusiness: false,
  canViewAnalytics: false,
  canCreateClient: true, // Permite criar cliente por padrão
  canManageAppointments: true // Permite gerenciar agendamentos por padrão
};

export const useUserPermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions(defaultPermissions);
        return;
      }

      try {
        // Primeiro tenta buscar o usuário
        const { data: userProfile, error: userError } = await supabase
          .from('usuarios')
          .select('cargo, id')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) {
          console.error('Erro ao buscar usuário:', userError);
          // Em caso de erro, usa permissões padrão
          setPermissions(defaultPermissions);
          return;
        }

        if (userProfile) {
          setPermissions({
            isAdmin: userProfile.cargo === 'admin',
            isProfessional: userProfile.cargo === 'profissional',
            canCreateService: userProfile.cargo === 'admin',
            canEditService: userProfile.cargo === 'admin',
            canDeleteService: userProfile.cargo === 'admin',
            canManageUsers: userProfile.cargo === 'admin' || userProfile.cargo === 'owner',
            canManageSecurityPolicies: userProfile.cargo === 'owner',
            canManageDatabaseSchema: userProfile.cargo === 'owner',
            canManageEdgeFunctions: userProfile.cargo === 'owner',
            canManageAuthentication: userProfile.cargo === 'owner',
            canManageBusiness: userProfile.cargo === 'admin' || userProfile.cargo === 'owner',
            canViewAnalytics: userProfile.cargo === 'admin' || userProfile.cargo === 'owner',
            canCreateClient: true,
            canManageAppointments: true
          });
        } else {
          // Se não encontrou o usuário, usa permissões padrão
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        setPermissions(defaultPermissions);
      }
    };

    fetchPermissions();
  }, [user]);

  return permissions;
}; 
