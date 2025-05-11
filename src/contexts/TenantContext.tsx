
import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface TenantContextType {
  currentBusiness: any | null;
  businessId: string | null;
  loading: boolean;
  error: string | null;
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;
  refreshBusinessData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  currentBusiness: null,
  businessId: null,
  loading: true,
  error: null,
  updateBusinessStatus: async () => false,
  refreshBusinessData: async () => {}
});

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { 
    businessId, 
    businessData: currentBusiness, 
    loading, 
    error,
    updateBusinessStatus,
    fetchBusinessData
  } = useCurrentBusiness();

  return (
    <TenantContext.Provider 
      value={{ 
        currentBusiness, 
        businessId, 
        loading, 
        error,
        updateBusinessStatus,
        refreshBusinessData: fetchBusinessData
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
