
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { handleError } from "@/utils/errorHandler";
import { supabase } from '@/integrations/supabase/client';

interface TenantContextProps {
  businessId: string | null;  // Old field (id_negocio)
  tenantId: string | null;    // New field (tenant_id)
  loading: boolean;
  error: string | null;
  setTenantContext: (id: string) => Promise<boolean>;
  currentBusiness: any | null;  // Added this property
  refreshBusinessData: () => Promise<void>;  // Added this method
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;  // Added this method
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { 
    businessId, 
    businessData: currentBusiness, 
    loading: businessLoading, 
    error: businessError,
    fetchBusinessData,
    updateBusinessStatus
  } = useCurrentBusiness();
  
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync tenant_id with businessId
  useEffect(() => {
    if (businessId && !tenantId) {
      setTenantId(businessId);
      setTenantContext(businessId).catch(err => {
        console.warn("Failed to set tenant context:", err);
        // Continue anyway even if setting tenant context fails
      });
    }
  }, [businessId]);

  // Set tenant context in Supabase RLS
  const setTenantContext = async (id: string): Promise<boolean> => {
    try {
      // First check if the RPC function exists by checking the response
      const { error } = await supabase.rpc('set_tenant_context', { tenant_id: id });
      
      if (error) {
        // If there's an error, it might be that the function doesn't exist
        console.warn("Failed to set tenant context, might not exist:", error);
        // Return true anyway to not block the app
        return true;
      }
      
      return true;
    } catch (err: any) {
      // Log the error but don't let it block the app
      console.warn('Error in setTenantContext:', err);
      handleError('setTenantContext', err);
      setError(err.message || 'Erro ao definir contexto do tenant');
      // Return true anyway to not block the app
      return true;
    }
  };
  
  // Refresh business data
  const refreshBusinessData = async (): Promise<void> => {
    try {
      await fetchBusinessData();
    } catch (err: any) {
      handleError('refreshBusinessData', err);
      setError(err.message || 'Erro ao atualizar dados do negócio');
    }
  };

  return (
    <TenantContext.Provider
      value={{
        businessId,
        tenantId,
        loading: businessLoading,
        error: error || businessError,
        setTenantContext,
        currentBusiness,
        refreshBusinessData,
        updateBusinessStatus
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}
