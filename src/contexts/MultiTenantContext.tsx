
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/ui/loader';

interface Business {
  id: string;
  name: string;
  slug: string;
  admin_email: string;
  status: string;
  role?: string; // User's role in this business
  logo_url?: string; // Business logo
}

interface MultiTenantContextType {
  currentBusiness: Business | null;
  businesses: Business[];
  availableBusinesses: Business[]; // Alias for businesses for backward compatibility
  isLoading: boolean;
  error: string | null;
  hasMultipleBusinesses: boolean;
  switchBusiness: (businessId: string) => void;
  refreshBusinessData: () => Promise<void>;
  refreshBusinesses: () => Promise<void>; // Alias for refreshBusinessData
}

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(undefined);

export const useMultiTenant = () => {
  const context = useContext(MultiTenantContext);
  if (!context) {
    throw new Error('useMultiTenant must be used within a MultiTenantProvider');
  }
  return context;
};

interface MultiTenantProviderProps {
  children: ReactNode;
}

export const MultiTenantProvider: React.FC<MultiTenantProviderProps> = ({ children }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBusinessData = async () => {
    if (!user || !profile?.business_id) {
      setIsLoading(false);
      setError('Usuário não autenticado ou sem negócio associado');
      return;
    }

    try {
      setError(null);
      // For now, create a mock business based on profile data
      const mockBusiness: Business = {
        id: profile.business_id,
        name: 'Meu Negócio',
        slug: `business-${profile.business_id.slice(0, 8)}`,
        admin_email: user.email || '',
        status: 'active',
        role: 'owner', // Default role for the business owner
        logo_url: undefined // No logo by default
      };

      setCurrentBusiness(mockBusiness);
      setBusinesses([mockBusiness]);
      
      console.log('Business data loaded:', mockBusiness);
    } catch (error) {
      console.error('Error loading business data:', error);
      setError('Erro ao carregar dados do negócio');
    } finally {
      setIsLoading(false);
    }
  };

  const switchBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
    }
  };

  useEffect(() => {
    if (!authLoading && user && profile) {
      refreshBusinessData();
    } else if (!authLoading && !user) {
      setIsLoading(false);
      setError('Usuário não autenticado');
    }
  }, [user, profile, authLoading]);

  // Show loading only when auth is ready but we're still loading business data
  if (!authLoading && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Carregando dados do negócio..." />
      </div>
    );
  }

  const hasMultipleBusinesses = businesses.length > 1;

  const value: MultiTenantContextType = {
    currentBusiness,
    businesses,
    availableBusinesses: businesses, // Alias for backward compatibility
    isLoading,
    error,
    hasMultipleBusinesses,
    switchBusiness,
    refreshBusinessData,
    refreshBusinesses: refreshBusinessData, // Alias for backward compatibility
  };

  return (
    <MultiTenantContext.Provider value={value}>
      {children}
    </MultiTenantContext.Provider>
  );
};
