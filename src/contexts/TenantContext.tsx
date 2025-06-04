
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TenantContextType {
  businessId: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
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
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuthContext();

  const fetchBusinessId = async () => {
    if (!user) {
      setBusinessId(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First try business_users table
      const { data: businessUserData, error: businessUserError } = await supabase
        .from('business_users')
        .select('business_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (businessUserError && businessUserError.code !== 'PGRST116') {
        throw businessUserError;
      }

      if (businessUserData?.business_id) {
        setBusinessId(businessUserData.business_id);
        return;
      }

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

      if (businessData?.id) {
        setBusinessId(businessData.id);
      } else {
        console.warn('No business found for user:', user.id);
        setBusinessId(null);
      }
    } catch (err: any) {
      console.error('Error fetching business ID:', err);
      setError(err.message || 'Failed to fetch business information');
      setBusinessId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchBusinessId();
  };

  useEffect(() => {
    if (!authLoading) {
      fetchBusinessId();
    }
  }, [user, authLoading]);

  const value = {
    businessId,
    isLoading: isLoading || authLoading,
    error,
    refetch,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
