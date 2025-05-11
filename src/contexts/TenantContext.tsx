
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Business, getBusinessData, updateBusinessStatus as updateStatus, clearBusinessCache } from "@/services/businessService";

type TenantContextType = {
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
  setCurrentBusinessById: (id: string) => Promise<void>;
  refreshBusinessData: () => Promise<void>;
  updateBusinessStatus: (businessId: string, newStatus: string) => Promise<boolean>;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const lastRefreshTime = useRef(0);
  
  // Rate limited refresh function
  const refreshBusinessData = useCallback(async () => {
    if (!user) {
      setCurrentBusiness(null);
      setLoading(false);
      return;
    }
    
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) { // Don't refresh more than once every 5 seconds
      console.log("Refresh rate limited, skipping");
      return;
    }
    
    lastRefreshTime.current = now;
    
    try {
      setLoading(true);
      setError(null);
      
      const businessData = await getBusinessData(user.id, true); // Skip cache
      setCurrentBusiness(businessData);
      
    } catch (err: any) {
      console.error('Error refreshing business data:', err);
      setError(err.message);
      toast.error('Erro ao atualizar dados do negócio.');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Fetch user's business initially
  const fetchUserBusiness = useCallback(async () => {
    if (!user) {
      setCurrentBusiness(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const businessData = await getBusinessData(user.id);
      setCurrentBusiness(businessData);
      
    } catch (err: any) {
      console.error('Error fetching business data:', err);
      setError(err.message);
      toast.error('Erro ao carregar dados do negócio.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update business status using the centralized service
  const updateBusinessStatus = useCallback(async (businessId: string, newStatus: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null);

      const success = await updateStatus(businessId, newStatus);
      
      if (success) {
        // Refresh business data immediately after successful status update
        await fetchUserBusiness();
        toast.success('Status do negócio atualizado com sucesso!');
      }
      
      return success;
    } catch (err: any) {
      console.error('Erro ao atualizar status do negócio:', err);
      setError(err.message);
      toast.error('Erro ao atualizar status do negócio.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserBusiness]);

  // Set current business by ID (for users with multiple businesses)
  const setCurrentBusinessById = useCallback(async (businessId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Check if user has access to this business
      const { data: accessCheck, error: accessError } = await supabase
        .from('perfis_acesso')
        .select('*')
        .eq('id_usuario', user.id)
        .eq('id_negocio', businessId)
        .maybeSingle();

      if (accessError || !accessCheck) {
        throw new Error('Você não tem acesso a este negócio');
      }

      // Update the user's current business
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ id_negocio: businessId })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Clear cache and fetch updated business data
      clearBusinessCache();
      await fetchUserBusiness();
      
    } catch (err: any) {
      console.error('Erro ao definir negócio atual:', err);
      setError(err.message);
      toast.error(err.message || 'Erro ao alternar negócio.');
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserBusiness]);

  // Initial fetch when user changes
  useEffect(() => {
    if (user) {
      fetchUserBusiness();
    } else {
      setCurrentBusiness(null);
      setLoading(false);
    }
  }, [user, fetchUserBusiness]);

  const value = {
    currentBusiness,
    loading,
    error,
    setCurrentBusinessById,
    refreshBusinessData,
    updateBusinessStatus
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  
  if (context === undefined) {
    throw new Error("useTenant deve ser usado dentro de um TenantProvider");
  }
  
  return context;
};
