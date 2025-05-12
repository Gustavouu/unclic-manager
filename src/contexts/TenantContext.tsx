
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
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

  // Set tenant context in Supabase RLS with better error handling
  const setTenantContext = useCallback(async (id: string): Promise<boolean> => {
    if (!id) {
      console.warn("setTenantContext called with empty ID, skipping");
      return true; // Return success to avoid breaking app flow
    }
    
    try {
      // Try to call the RPC function with a timeout to prevent hanging
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error("RPC timeout")), 3000)
      );
      
      const rpcPromise = supabase.rpc('set_tenant_context', { tenant_id: id });
      
      const { error } = await Promise.race([rpcPromise, timeoutPromise]);
      
      if (error) {
        console.warn("Failed to set tenant context:", error.message);
        // Don't throw - return true to continue app initialization
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
  }, []);
  
  // Refresh business data with error handling
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
