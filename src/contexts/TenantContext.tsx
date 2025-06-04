
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TenantContextType {
  businessId: string | null;
  currentBusiness: any;
  isLoading: boolean;
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
  const { user } = useAuth();
  const [businessId] = useState<string | null>(user?.id || null);
  const [currentBusiness] = useState<any>({ name: 'Demo Business' });
  const [isLoading] = useState(false);

  const value = {
    businessId,
    currentBusiness,
    isLoading,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
