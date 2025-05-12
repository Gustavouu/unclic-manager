
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface TenantContextProps {
  businessId: string | null;
  setBusinessId: React.Dispatch<React.SetStateAction<string | null>>;
  currentBusiness: any | null;
  setCurrentBusiness: React.Dispatch<React.SetStateAction<any | null>>;
  loading: boolean;
  error: string | null;
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;
  refreshBusinessData: () => Promise<void>;
}

interface TenantProviderProps {
  children: React.ReactNode;
}

const TenantContext = createContext<TenantContextProps>({
  businessId: null,
  setBusinessId: () => {},
  currentBusiness: null,
  setCurrentBusiness: () => {},
  loading: false,
  error: null,
  updateBusinessStatus: async () => false,
  refreshBusinessData: async () => {}
});

export const useTenant = () => useContext(TenantContext);

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load the business ID from localStorage
    const storedBusinessId = localStorage.getItem('businessId');
    if (storedBusinessId) {
      setBusinessId(storedBusinessId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // When businessId changes, fetch business details
    if (businessId) {
      fetchBusinessDetails();
    }
  }, [businessId]);

  // Save businessId to localStorage when it changes
  useEffect(() => {
    if (businessId) {
      localStorage.setItem('businessId', businessId);
    }
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', businessId)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (data) {
        setCurrentBusiness(data);
      } else {
        setError('Não foi possível encontrar os dados do negócio');
      }
    } catch (e: any) {
      console.error('Error fetching business details:', e);
      setError(e.message || 'Erro ao buscar detalhes do negócio');
    } finally {
      setLoading(false);
    }
  };
  
  const refreshBusinessData = async (): Promise<void> => {
    if (businessId) {
      await fetchBusinessDetails();
    }
  };

  const updateBusinessStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { data, error: updateError } = await supabase
        .rpc('set_business_status', { business_id: id, new_status: status });

      if (updateError) throw updateError;
      
      // Update local business data
      if (currentBusiness && id === currentBusiness.id) {
        setCurrentBusiness({
          ...currentBusiness,
          status: status
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error updating business status:', err);
      return false;
    }
  };

  return (
    <TenantContext.Provider value={{ 
      businessId, 
      setBusinessId, 
      currentBusiness, 
      setCurrentBusiness,
      loading,
      error,
      updateBusinessStatus,
      refreshBusinessData
    }}>
      {children}
    </TenantContext.Provider>
  );
};
