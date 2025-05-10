
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's business
  const fetchUserBusiness = async () => {
    if (!user) {
      setCurrentBusiness(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the user's associated business
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id_negocio')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw userError;
      }

      if (!userData?.id_negocio) {
        setCurrentBusiness(null);
        return;
      }

      // Fetch the business details
      const { data: businessData, error: businessError } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', userData.id_negocio)
        .single();

      if (businessError) {
        throw businessError;
      }

      setCurrentBusiness(businessData as Business);
    } catch (err: any) {
      console.error('Erro ao buscar dados do negócio:', err);
      setError(err.message);
      toast.error('Erro ao carregar dados do negócio.');
    } finally {
      setLoading(false);
    }
  };

  // Set current business by ID (for users with multiple businesses)
  const setCurrentBusinessById = async (businessId: string) => {
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

      // Fetch updated business data
      await fetchUserBusiness();
    } catch (err: any) {
      console.error('Erro ao definir negócio atual:', err);
      setError(err.message);
      toast.error(err.message || 'Erro ao alternar negócio.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh business data
  const refreshBusinessData = async () => {
    await fetchUserBusiness();
  };

  // Initial fetch and setup listener for auth changes
  useEffect(() => {
    fetchUserBusiness();
  }, [user]);

  const value = {
    currentBusiness,
    loading,
    error,
    setCurrentBusinessById,
    refreshBusinessData
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
