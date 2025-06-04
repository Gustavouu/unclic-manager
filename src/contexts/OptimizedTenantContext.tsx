
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { OptimizedCache } from '@/services/cache/OptimizedCache';

interface OptimizedTenantContextType {
  businessId: string | null;
  businessName: string | null;
  currentBusiness: { id: string; name: string } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
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
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuthContext();
  const cache = OptimizedCache.getInstance();

  const fetchBusinessData = async () => {
    if (!user) {
      setBusinessId(null);
      setBusinessName(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `business:user:${user.id}`;
      const cached = cache.get<{ id: string; name: string }>(cacheKey);
      
      if (cached) {
        setBusinessId(cached.id);
        setBusinessName(cached.name);
        setIsLoading(false);
        return;
      }

      // Try business_users table first
      const { data: businessUserData, error: businessUserError } = await supabase
        .from('business_users')
        .select('business_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (businessUserError && businessUserError.code !== 'PGRST116') {
        throw businessUserError;
      }

      let foundBusinessId = businessUserData?.business_id;

      if (!foundBusinessId) {
        // Try businesses table by admin email
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('admin_email', user.email)
          .limit(1)
          .maybeSingle();

        if (businessError && businessError.code !== 'PGRST116') {
          throw businessError;
        }

        foundBusinessId = businessData?.id;
      }

      if (foundBusinessId) {
        setBusinessId(foundBusinessId);

        // Fetch business name
        const { data: businessDetails, error: businessDetailsError } = await supabase
          .from('businesses')
          .select('name')
          .eq('id', foundBusinessId)
          .single();

        if (businessDetailsError) {
          console.error('Error fetching business details:', businessDetailsError);
        } else {
          setBusinessName(businessDetails.name);
          
          // Cache the result
          cache.set(cacheKey, { id: foundBusinessId, name: businessDetails.name }, 10 * 60 * 1000);
        }
      } else {
        console.warn('No business found for user:', user.id);
        setBusinessId(null);
        setBusinessName(null);
      }
    } catch (err: any) {
      console.error('Error fetching business data:', err);
      setError(err.message || 'Failed to fetch business information');
      setBusinessId(null);
      setBusinessName(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    // Clear cache for this user
    if (user) {
      cache.invalidate(`business:user:${user.id}`);
    }
    fetchBusinessData();
  };

  useEffect(() => {
    if (!authLoading) {
      fetchBusinessData();
    }
  }, [user, authLoading]);

  // Create currentBusiness object for compatibility
  const currentBusiness = businessId && businessName 
    ? { id: businessId, name: businessName }
    : null;

  const value = {
    businessId,
    businessName,
    currentBusiness,
    isLoading: isLoading || authLoading,
    error,
    refetch,
  };

  return (
    <OptimizedTenantContext.Provider value={value}>
      {children}
    </OptimizedTenantContext.Provider>
  );
};
