
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  status: string;
  role: string;
  logo_url?: string;
}

interface MultiTenantContextType {
  currentBusiness: Business | null;
  availableBusinesses: Business[];
  isLoading: boolean;
  error: string | null;
  switchBusiness: (businessId: string) => Promise<boolean>;
  refreshBusinesses: () => Promise<void>;
  hasMultipleBusinesses: boolean;
}

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(undefined);

export const useMultiTenant = () => {
  const context = useContext(MultiTenantContext);
  if (context === undefined) {
    throw new Error('useMultiTenant must be used within a MultiTenantProvider');
  }
  return context;
};

interface MultiTenantProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'unclic_current_business_id';

export const MultiTenantProvider: React.FC<MultiTenantProviderProps> = ({ children }) => {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [availableBusinesses, setAvailableBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuthContext();

  const fetchUserBusinesses = useCallback(async () => {
    if (!user) {
      setAvailableBusinesses([]);
      setCurrentBusiness(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching businesses for user:', user.id);

      // Get all businesses the user has access to
      const { data: businessUsers, error: businessUsersError } = await supabase
        .from('business_users')
        .select(`
          business_id,
          role,
          status,
          businesses!inner (
            id,
            name,
            status,
            logo_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (businessUsersError) {
        console.error('Error fetching business users:', businessUsersError);
        throw businessUsersError;
      }

      if (!businessUsers || businessUsers.length === 0) {
        console.warn('No businesses found for user:', user.id);
        setError('Nenhum negócio encontrado para este usuário');
        setAvailableBusinesses([]);
        setCurrentBusiness(null);
        setIsLoading(false);
        return;
      }

      // Transform the data
      const businesses: Business[] = businessUsers.map((bu: any) => ({
        id: bu.business_id,
        name: bu.businesses.name,
        status: bu.businesses.status,
        role: bu.role,
        logo_url: bu.businesses.logo_url,
      }));

      console.log('Found businesses:', businesses.length);
      setAvailableBusinesses(businesses);

      // Try to load previously selected business
      const savedBusinessId = localStorage.getItem(STORAGE_KEY);
      let selectedBusiness: Business | null = null;

      if (savedBusinessId) {
        selectedBusiness = businesses.find(b => b.id === savedBusinessId) || null;
        if (selectedBusiness) {
          console.log('Restored business from storage:', selectedBusiness.name);
        }
      }

      // If no saved business or saved business not found, select the first one
      if (!selectedBusiness && businesses.length > 0) {
        selectedBusiness = businesses[0];
        console.log('Auto-selecting first business:', selectedBusiness.name);
        localStorage.setItem(STORAGE_KEY, selectedBusiness.id);
      }

      setCurrentBusiness(selectedBusiness);

    } catch (err: any) {
      console.error('Error fetching businesses:', err);
      setError('Erro ao carregar negócios do usuário');
      setAvailableBusinesses([]);
      setCurrentBusiness(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const switchBusiness = useCallback(async (businessId: string): Promise<boolean> => {
    const targetBusiness = availableBusinesses.find(b => b.id === businessId);
    
    if (!targetBusiness) {
      toast.error('Negócio não encontrado');
      return false;
    }

    try {
      setCurrentBusiness(targetBusiness);
      localStorage.setItem(STORAGE_KEY, businessId);
      
      console.log('Switched to business:', targetBusiness.name);
      toast.success(`Negócio alterado para: ${targetBusiness.name}`);
      
      return true;
    } catch (error) {
      console.error('Error switching business:', error);
      toast.error('Erro ao trocar de negócio');
      return false;
    }
  }, [availableBusinesses]);

  const refreshBusinesses = useCallback(async () => {
    await fetchUserBusinesses();
  }, [fetchUserBusinesses]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserBusinesses();
    }
  }, [user, authLoading, fetchUserBusinesses]);

  const hasMultipleBusinesses = availableBusinesses.length > 1;

  return (
    <MultiTenantContext.Provider
      value={{
        currentBusiness,
        availableBusinesses,
        isLoading,
        error,
        switchBusiness,
        refreshBusinesses,
        hasMultipleBusinesses,
      }}
    >
      {children}
    </MultiTenantContext.Provider>
  );
};
