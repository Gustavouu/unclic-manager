
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

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
  isProfessional: true,
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
  canCreateClient: true,
  canManageAppointments: true
};

export const useUserPermissions = () => {
  const { user } = useAuth();
  const { businessId } = useCurrentBusiness();
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !businessId) {
        setPermissions(defaultPermissions);
        return;
      }

      try {
        // Get role from the business_users table with proper RLS
        const { data: businessUser, error: businessError } = await supabase
          .from('business_users')
          .select(`
            role,
            roles!inner(
              role_type
            )
          `)
          .eq('user_id', user.id)
          .eq('business_id', businessId)
          .eq('status', 'active')
          .single();

        let userRole = 'staff'; // default role

        if (!businessError && businessUser?.roles) {
          userRole = businessUser.roles.role_type;
        } else {
          // Fallback to the role column if roles table join fails
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('business_users')
            .select('role')
            .eq('user_id', user.id)
            .eq('business_id', businessId)
            .eq('status', 'active')
            .single();

          if (!fallbackError && fallbackData?.role) {
            userRole = fallbackData.role;
          }
        }

        setPermissions({
          isAdmin: userRole === 'admin' || userRole === 'owner',
          isProfessional: userRole === 'professional' || userRole === 'staff',
          canCreateService: userRole === 'admin' || userRole === 'owner',
          canEditService: userRole === 'admin' || userRole === 'owner',
          canDeleteService: userRole === 'admin' || userRole === 'owner',
          canManageUsers: userRole === 'admin' || userRole === 'owner',
          canManageSecurityPolicies: userRole === 'owner',
          canManageDatabaseSchema: userRole === 'owner',
          canManageEdgeFunctions: userRole === 'owner',
          canManageAuthentication: userRole === 'owner',
          canManageBusiness: userRole === 'admin' || userRole === 'owner',
          canViewAnalytics: userRole === 'admin' || userRole === 'owner',
          canCreateClient: true,
          canManageAppointments: true
        });
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions(defaultPermissions);
      }
    };

    fetchPermissions();
  }, [user, businessId]);

  return permissions;
};
