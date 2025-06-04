
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TenantContextType {
  businessId: string | null;
  businessName: string | null;
  currentBusiness: any;
  isLoading: boolean;
  error: string | null;
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
  const [error] = useState<string | null>(null);

  const businessName = currentBusiness?.name || null;

  const value = {
    businessId,
    businessName,
    currentBusiness,
    isLoading,
    error,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
