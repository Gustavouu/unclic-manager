
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Business, getBusinessData, updateBusinessStatus as updateStatus, clearBusinessCache, verifyAndRepairBusinessStatus } from "@/services/businessService";

type TenantContextType = {
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
  setCurrentBusinessById: (id: string) => Promise<void>;
  refreshBusinessData: () => Promise<void>;
  updateBusinessStatus: (businessId: string, newStatus: string) => Promise<boolean>;
  verifyAndRepairStatus: () => Promise<boolean>;
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
      
      console.log("Refreshing business data...");
      const businessData = await getBusinessData(user.id, true); // Skip cache
      setCurrentBusiness(businessData);
      
      if (businessData) {
        console.log(`Business data refreshed: ${businessData.nome}, status: ${businessData.status}`);
      } else {
        console.log("No business data found on refresh");
      }
      
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
      
      console.log("Fetching initial business data...");
      const businessData = await getBusinessData(user.id);
      setCurrentBusiness(businessData);
      
      if (businessData) {
        console.log(`Initial business data loaded: ${businessData.nome}, status: ${businessData.status}`);
        
        // Check if business has pending status and attempt to auto-repair on initial load
        if (businessData.status === 'pendente') {
          console.log("Business has pending status, will attempt auto-repair");
          setTimeout(() => {
            verifyAndRepairStatus();
          }, 1000);
        }
      } else {
        console.log("No business data found on initial fetch");
      }
      
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

      console.log(`Updating business status: ${businessId} to ${newStatus}`);
      const success = await updateStatus(businessId, newStatus);
      
      if (success) {
        // Refresh business data immediately after successful status update
        await fetchUserBusiness();
        toast.success('Status do negócio atualizado com sucesso!');
        console.log("Business status updated successfully");
      } else {
        console.log("Failed to update business status");
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

  // Verify and repair business status
  const verifyAndRepairStatus = useCallback(async () => {
    if (!user) return false;
    
    try {
      console.log("Attempting to verify and repair business status");
      const success = await verifyAndRepairBusinessStatus(user.id);
      
      if (success) {
        await refreshBusinessData();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error while repairing business status:', err);
      return false;
    }
  }, [user, refreshBusinessData]);

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

  // Set up periodic status check for pending businesses
  useEffect(() => {
    if (!user || !currentBusiness || currentBusiness.status !== 'pendente') {
      return;
    }
    
    console.log("Setting up periodic status check for pending business");
    
    // Try to repair status every 30 seconds if business is in pending state
    const intervalId = setInterval(() => {
      verifyAndRepairStatus();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [user, currentBusiness, verifyAndRepairStatus]);

  const value = {
    currentBusiness,
    loading,
    error,
    setCurrentBusinessById,
    refreshBusinessData,
    updateBusinessStatus,
    verifyAndRepairStatus
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
