
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
        // First try to fetch from new table
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user profile:', userError);
          
          // Try fallback to legacy table
          const { data: legacyUserProfile, error: legacyError } = await supabase
            .from('application_users')
            .select('id, role')
            .eq('id', user.id)
            .maybeSingle();
            
          if (legacyError) {
            console.error('Error fetching legacy user profile:', legacyError);
            // In case of error, use default permissions
            setPermissions(defaultPermissions);
            return;
          }
          
          if (legacyUserProfile) {
            setPermissions({
              isAdmin: legacyUserProfile.role === 'admin',
              isProfessional: legacyUserProfile.role === 'professional',
              canCreateService: legacyUserProfile.role === 'admin',
              canEditService: legacyUserProfile.role === 'admin',
              canDeleteService: legacyUserProfile.role === 'admin',
              canManageUsers: legacyUserProfile.role === 'admin' || legacyUserProfile.role === 'owner',
              canManageSecurityPolicies: legacyUserProfile.role === 'owner',
              canManageDatabaseSchema: legacyUserProfile.role === 'owner',
              canManageEdgeFunctions: legacyUserProfile.role === 'owner',
              canManageAuthentication: legacyUserProfile.role === 'owner',
              canManageBusiness: legacyUserProfile.role === 'admin' || legacyUserProfile.role === 'owner',
              canViewAnalytics: legacyUserProfile.role === 'admin' || legacyUserProfile.role === 'owner',
              canCreateClient: true,
              canManageAppointments: true
            });
            return;
          }
        }

        if (userProfile) {
          setPermissions({
            isAdmin: userProfile.role === 'admin',
            isProfessional: userProfile.role === 'professional',
            canCreateService: userProfile.role === 'admin',
            canEditService: userProfile.role === 'admin',
            canDeleteService: userProfile.role === 'admin',
            canManageUsers: userProfile.role === 'admin' || userProfile.role === 'owner',
            canManageSecurityPolicies: userProfile.role === 'owner',
            canManageDatabaseSchema: userProfile.role === 'owner',
            canManageEdgeFunctions: userProfile.role === 'owner',
            canManageAuthentication: userProfile.role === 'owner',
            canManageBusiness: userProfile.role === 'admin' || userProfile.role === 'owner',
            canViewAnalytics: userProfile.role === 'admin' || userProfile.role === 'owner',
            canCreateClient: true,
            canManageAppointments: true
          });
        } else {
          // If no user profile found, use default permissions
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions(defaultPermissions);
      }
    };

    fetchPermissions();
  }, [user]);

  return permissions;
};
