
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from '@/components/ui/loader';
import { ensureUserBusinessAccess } from '@/utils/businessAccess';

interface Business {
  id: string;
  name: string;
  slug: string;
  admin_email: string;
  status: string;
  role?: string;
  logo_url?: string;
}

interface MultiTenantContextType {
  currentBusiness: Business | null;
  businesses: Business[];
  availableBusinesses: Business[];
  isLoading: boolean;
  error: string | null;
  hasMultipleBusinesses: boolean;
  switchBusiness: (businessId: string) => void;
  refreshBusinessData: () => Promise<void>;
  refreshBusinesses: () => Promise<void>;
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
    if (!user) {
      setCurrentBusiness(null);
      setBusinesses([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Loading business data for user:', user.id);

      // Ensure user has business access
      await ensureUserBusinessAccess();

      // Get user's businesses through business_users relationship
      const { data: businessUsers, error: businessError } = await supabase
        .from('business_users')
        .select(`
          business_id,
          role,
          status,
          businesses!inner(
            id,
            name,
            slug,
            admin_email,
            status,
            logo_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (businessError) {
        console.error('Error fetching businesses:', businessError);
        throw businessError;
      }

      if (!businessUsers || businessUsers.length === 0) {
        console.log('No businesses found for user, creating default business');
        await ensureUserBusinessAccess();
        // Retry after ensuring business access
        return refreshBusinessData();
      }

      const userBusinesses: Business[] = businessUsers.map(bu => ({
        id: bu.businesses.id,
        name: bu.businesses.name,
        slug: bu.businesses.slug,
        admin_email: bu.businesses.admin_email,
        status: bu.businesses.status,
        role: bu.role,
        logo_url: bu.businesses.logo_url
      }));

      console.log('Businesses loaded successfully:', userBusinesses);
      setBusinesses(userBusinesses);
      
      // Set current business (first one for now)
      if (userBusinesses.length > 0) {
        setCurrentBusiness(userBusinesses[0]);
        console.log('Current business set to:', userBusinesses[0].name);
      }

    } catch (error: any) {
      console.error('Error loading business data:', error);
      setError(error.message || 'Erro ao carregar dados do negócio');
    } finally {
      setIsLoading(false);
    }
  };

  // Alias for refreshBusinessData to maintain compatibility
  const refreshBusinesses = refreshBusinessData;

  const switchBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      console.log('Switched to business:', business.name);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      console.log('Auth ready, loading business data for user:', user.id);
      refreshBusinessData();
    } else if (!authLoading && !user) {
      console.log('No user authenticated, clearing business data');
      setCurrentBusiness(null);
      setBusinesses([]);
      setIsLoading(false);
    }
  }, [user, authLoading]);

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
    availableBusinesses: businesses,
    isLoading,
    error,
    hasMultipleBusinesses,
    switchBusiness,
    refreshBusinessData,
    refreshBusinesses,
  };

  return (
    <MultiTenantContext.Provider value={value}>
      {children}
    </MultiTenantContext.Provider>
  );
};
