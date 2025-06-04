
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface OptimizedTenantContextType {
  businessId: string | null;
  businessName: string | null;
  currentBusiness: any;
  isLoading: boolean;
  error: string | null;
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
    <OptimizedTenantContext.Provider value={value}>
      {children}
    </OptimizedTenantContext.Provider>
  );
};
