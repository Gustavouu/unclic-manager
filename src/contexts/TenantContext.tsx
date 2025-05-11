
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Business = {
  id: string;
  nome: string;
  slug: string;
  email_admin: string;
  telefone?: string;
  endereco?: string;
  url_logo?: string;
  status: string;
};

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
  const [refreshCount, setRefreshCount] = useState(0);
  const isInitialMount = useRef(true);
  const lastRefreshTime = useRef(0);
  
  // Rate limit refreshes to prevent loops
  const refreshBusinessData = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) { // Don't refresh more than once every 5 seconds
      console.log("Refresh rate limited, skipping");
      return;
    }
    
    lastRefreshTime.current = now;
    setRefreshCount(prev => prev + 1);
  }, []);

  // Fetch user's business with debounce
  const fetchUserBusiness = useCallback(async () => {
    if (!user) {
      setCurrentBusiness(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get from cache first
      const cachedBusiness = localStorage.getItem(`tenant-business-${user.id}`);
      const cachedTimestamp = localStorage.getItem(`tenant-business-timestamp-${user.id}`);
      
      if (cachedBusiness && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (now - timestamp < fiveMinutes) {
          setCurrentBusiness(JSON.parse(cachedBusiness));
          setLoading(false);
          console.log("Using cached business data");
          return;
        }
      }

      // Get the user's associated business
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id_negocio')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) {
        throw userError;
      }

      if (!userData?.id_negocio) {
        setCurrentBusiness(null);
        setLoading(false);
        return;
      }

      // Fetch the business details
      const { data: businessData, error: businessError } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', userData.id_negocio)
        .maybeSingle();

      if (businessError) {
        throw businessError;
      }

      // Store in cache
      localStorage.setItem(`tenant-business-${user.id}`, JSON.stringify(businessData));
      localStorage.setItem(`tenant-business-timestamp-${user.id}`, Date.now().toString());
      
      setCurrentBusiness(businessData as Business);
    } catch (err: any) {
      console.error('Erro ao buscar dados do negócio:', err);
      setError(err.message);
      toast.error('Erro ao carregar dados do negócio.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update business status with improved reliability
  const updateBusinessStatus = useCallback(async (businessId: string, newStatus: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null);

      // Update the business status
      const { error: updateError } = await supabase
        .from('negocios')
        .update({ status: newStatus })
        .eq('id', businessId);

      if (updateError) {
        throw updateError;
      }

      // Clear all caches to ensure fresh data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('tenant-business-') || 
            key.startsWith('onboarding-status-') || 
            key.startsWith('user-business-') || 
            key.startsWith('business-')) {
          localStorage.removeItem(key);
        }
      });

      // Refresh business data immediately
      await fetchUserBusiness();
      
      return true;
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
      localStorage.removeItem(`tenant-business-${user.id}`);
      localStorage.removeItem(`tenant-business-timestamp-${user.id}`);
      
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

  // Handle refresh requests
  useEffect(() => {
    // Skip the initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (refreshCount > 0) {
      fetchUserBusiness();
    }
  }, [refreshCount, fetchUserBusiness]);

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
