
import React, { createContext, useContext } from 'react';
import { useMultiTenant } from './MultiTenantContext';

interface TenantContextType {
  businessId: string | null;
  businessName: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { 
    currentBusiness, 
    isLoading, 
    error, 
    refreshBusinesses 
  } = useMultiTenant();

  const value: TenantContextType = {
    businessId: currentBusiness?.id || null,
    businessName: currentBusiness?.name || null,
    isLoading,
    error,
    refetch: refreshBusinesses,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
