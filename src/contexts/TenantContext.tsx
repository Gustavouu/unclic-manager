
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface TenantContextType {
  businessId: string | null;
  businessName?: string;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType>({
  businessId: null,
  businessName: undefined,
  isLoading: true,
});

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { businessId, isLoading } = useCurrentBusiness();
  const [businessName, setBusinessName] = useState<string | undefined>();

  useEffect(() => {
    // TODO: Fetch business name when businessId is available
    if (businessId) {
      setBusinessName('Business Name'); // Placeholder
    }
  }, [businessId]);

  return (
    <TenantContext.Provider value={{ businessId, businessName, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
};
