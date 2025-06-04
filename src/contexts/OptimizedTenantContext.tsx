
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface OptimizedTenantContextType {
  businessId: string | null;
  currentBusiness: any;
  isLoading: boolean;
}

const OptimizedTenantContext = createContext<OptimizedTenantContextType | undefined>(undefined);

export const useOptimizedTenant = () => {
  const context = useContext(OptimizedTenantContext);
  if (context === undefined) {
    throw new Error('useOptimizedTenant must be used within an OptimizedTenantProvider');
  }
  return context;
};

interface OptimizedTenantProviderProps {
  children: React.ReactNode;
}

export const OptimizedTenantProvider: React.FC<OptimizedTenantProviderProps> = ({ children }) => {
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
    <OptimizedTenantContext.Provider value={value}>
      {children}
    </OptimizedTenantContext.Provider>
  );
};
