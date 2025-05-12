
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface TenantContextProps {
  businessId: string | null;
  setBusinessId: React.Dispatch<React.SetStateAction<string | null>>;
  currentBusiness: any | null;
  setCurrentBusiness: React.Dispatch<React.SetStateAction<any | null>>;
}

interface TenantProviderProps {
  children: React.ReactNode; // Explicitly define children prop
}

const TenantContext = createContext<TenantContextProps>({
  businessId: null,
  setBusinessId: () => {},
  currentBusiness: null,
  setCurrentBusiness: () => {}
});

export const useTenant = () => useContext(TenantContext);

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<any | null>(null);

  useEffect(() => {
    // Attempt to load the business ID from localStorage
    const storedBusinessId = localStorage.getItem('businessId');
    if (storedBusinessId) {
      setBusinessId(storedBusinessId);
    }
  }, []);

  useEffect(() => {
    // When businessId changes, fetch business details
    if (businessId) {
      const fetchBusinessDetails = async () => {
        const { data, error } = await supabase
          .from('negocios')
          .select('*')
          .eq('id', businessId)
          .single();
          
        if (!error && data) {
          setCurrentBusiness(data);
        } else {
          console.error('Error fetching business details:', error);
        }
      };
      
      fetchBusinessDetails();
    }
  }, [businessId]);

  // Save businessId to localStorage when it changes
  useEffect(() => {
    if (businessId) {
      localStorage.setItem('businessId', businessId);
    }
  }, [businessId]);

  return (
    <TenantContext.Provider value={{ 
      businessId, 
      setBusinessId, 
      currentBusiness, 
      setCurrentBusiness 
    }}>
      {children}
    </TenantContext.Provider>
  );
};
