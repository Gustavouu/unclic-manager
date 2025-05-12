
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
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { businessId, loading: businessLoading, error: businessError } = useCurrentBusiness();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync tenant_id with businessId
  useEffect(() => {
    if (businessId && !tenantId) {
      setTenantId(businessId);
      setTenantContext(businessId).catch(err => {
        console.error("Failed to set tenant context:", err);
      });
    }
  }, [businessId]);

  // Set tenant context in Supabase RLS
  const setTenantContext = async (id: string): Promise<boolean> => {
    try {
      await supabase.rpc('set_tenant_context', { tenant_id: id });
      return true;
    } catch (err) {
      handleError('setTenantContext', err);
      setError(err.message || 'Erro ao definir contexto do tenant');
      return false;
    }
  };

  return (
    <TenantContext.Provider
      value={{
        businessId,
        tenantId,
        loading: businessLoading,
        error: error || businessError,
        setTenantContext
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
