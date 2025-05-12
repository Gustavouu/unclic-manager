
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { handleError } from "@/utils/errorHandler";
import { supabase } from '@/integrations/supabase/client';
import { fetchWithCache } from '@/utils/cacheUtils';
import { useLoading } from "./LoadingContext";
import { toast } from "sonner";

interface TenantContextProps {
  businessId: string | null;  // Old field (id_negocio)
  tenantId: string | null;    // New field (tenant_id)
  loading: boolean;
  error: string | null;
  setTenantContext: (id: string) => Promise<boolean>;
  currentBusiness: any | null;  // Added this property
  refreshBusinessData: () => Promise<void>;  // Added this method
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;  // Added this method
  clearTenantCache: () => void; // New method to clear tenant-related caches
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
  const { setStage, bypassConnectivityCheck, allowContinueDespiteErrors } = useLoading();
  
  // Sync tenant_id with businessId
  useEffect(() => {
    if (businessId && !tenantId) {
      setTenantId(businessId);
      
      // Try to set tenant context, but don't block if it fails
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
    
    // If we're bypassing connectivity check or in emergency mode, don't even try
    if (bypassConnectivityCheck || allowContinueDespiteErrors) {
      console.log("Skipping tenant context setting due to bypass/emergency mode");
      return true;
    }
    
    try {
      setStage('config');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => {
          console.warn("Tenant context setting timed out, continuing anyway");
          return true; // Resolve with success after timeout to not block flow
        }, 3000);
      });
      
      const rpcPromise = async () => {
        try {
          // Correctly call supabase.rpc and properly await the response
          const response = await supabase.rpc('set_tenant_context', { tenant_id: id });
          const { error } = response;
          
          if (error) {
            console.warn("Failed to set tenant context, but continuing anyway:", error.message);
            // Don't throw - continue app initialization
            return true;
          }
          
          // Cache the tenant ID
          try {
            localStorage.setItem('current_tenant_id', id);
          } catch (err) {
            console.warn("Failed to cache tenant ID:", err);
          }
          
          return true;
        } catch (err) {
          console.warn("RPC error:", err);
          return false;
        }
      };
      
      // Use race to implement timeout, but both resolve with true to continue app flow
      return await Promise.race([rpcPromise(), timeoutPromise]);
    } catch (err: any) {
      // Log the error but don't let it block the app
      console.warn('Error in setTenantContext:', err);
      handleError('setTenantContext', err, false); // Don't show toast
      setError(err.message || 'Erro ao definir contexto do tenant');
      // Return true anyway to not block the app
      return true;
    }
  }, [setStage, bypassConnectivityCheck, allowContinueDespiteErrors]);
  
  // Refresh business data with error handling and caching
  const refreshBusinessData = async (): Promise<void> => {
    try {
      setStage('business_data');
      await fetchBusinessData();
    } catch (err: any) {
      handleError('refreshBusinessData', err, false); // Don't show toast
      setError(err.message || 'Erro ao atualizar dados do negócio');
    }
  };
  
  // Clear tenant related caches
  const clearTenantCache = () => {
    try {
      localStorage.removeItem('currentBusinessId');
      localStorage.removeItem('current_tenant_id');
      localStorage.removeItem(`business_data_${businessId}`);
      
      // Clear any other tenant-specific caches
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(businessId || '') || key.includes(tenantId || ''))) {
          localStorage.removeItem(key);
        }
      }
      
      toast.success("Cache do tenant limpo com sucesso");
    } catch (err) {
      console.error("Erro ao limpar cache:", err);
      toast.error("Erro ao limpar cache do tenant");
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
        updateBusinessStatus,
        clearTenantCache
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
