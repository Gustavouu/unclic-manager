
import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface TenantContextType {
  businessData: any | null;
  businessId: string | null;
  loading: boolean;
  error: string | null;
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;
  updateBusinessSettings: (settings: any) => Promise<boolean>;
  refreshBusinessData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  businessData: null,
  businessId: null,
  loading: true,
  error: null,
  updateBusinessStatus: async () => false,
  updateBusinessSettings: async () => false,
  refreshBusinessData: async () => {}
});

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { 
    businessId, 
    businessData, 
    loading, 
    error,
    updateBusinessStatus,
    updateBusinessSettings,
    refreshBusinessData
  } = useCurrentBusiness();

  return (
    <TenantContext.Provider 
      value={{ 
        businessData, 
        businessId, 
        loading, 
        error,
        updateBusinessStatus,
        updateBusinessSettings,
        refreshBusinessData
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
