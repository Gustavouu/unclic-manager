
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserBusinessIdSafe, ensureUserBusinessAccess } from '@/utils/businessAccess';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  role: string;
  status: string;
  logo_url?: string;
}

interface MultiTenantContextType {
  currentBusiness: Business | null;
  availableBusinesses: Business[];
  isLoading: boolean;
  error: string | null;
  switchBusiness: (businessId: string) => Promise<void>;
  refreshBusinesses: () => Promise<void>;
  hasMultipleBusinesses: boolean;
}

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(undefined);

export function MultiTenantProvider({ children }: { children: React.ReactNode }) {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [availableBusinesses, setAvailableBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        setCurrentBusiness(null);
        setAvailableBusinesses([]);
        return;
      }

      // Ensure user has business access
      await ensureUserBusinessAccess();

      // Get all businesses for the user
      const { data: businessUsers, error: businessError } = await supabase
        .from('business_users')
        .select(`
          business_id,
          role,
          status,
          businesses!inner(
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user.user.id)
        .eq('status', 'active');

      if (businessError) {
        console.error('Error fetching businesses:', businessError);
        setError('Failed to load businesses');
        return;
      }

      const businesses: Business[] = (businessUsers || []).map(bu => ({
        id: bu.business_id,
        name: bu.businesses.name,
        role: bu.role,
        status: bu.status,
        logo_url: bu.businesses.logo_url
      }));

      setAvailableBusinesses(businesses);

      // Set current business if not set or if current business is not in the list
      if (!currentBusiness || !businesses.find(b => b.id === currentBusiness.id)) {
        if (businesses.length > 0) {
          setCurrentBusiness(businesses[0]);
        }
      }

    } catch (err) {
      console.error('Error in fetchBusinesses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [currentBusiness]);

  const switchBusiness = useCallback(async (businessId: string) => {
    const business = availableBusinesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      toast.success(`Switched to ${business.name}`);
    }
  }, [availableBusinesses]);

  const refreshBusinesses = useCallback(async () => {
    await fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const value: MultiTenantContextType = {
    currentBusiness,
    availableBusinesses,
    isLoading,
    error,
    switchBusiness,
    refreshBusinesses,
    hasMultipleBusinesses: availableBusinesses.length > 1,
  };

  return (
    <MultiTenantContext.Provider value={value}>
      {children}
    </MultiTenantContext.Provider>
  );
}

export function useMultiTenant() {
  const context = useContext(MultiTenantContext);
  if (context === undefined) {
    throw new Error('useMultiTenant must be used within a MultiTenantProvider');
  }
  return context;
}
