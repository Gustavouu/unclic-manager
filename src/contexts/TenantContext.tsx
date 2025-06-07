
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TenantContextType {
  businessId: string | null;
  businessName: string | null;
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
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuthContext();

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

      // Use the new safe function
      const { data: businessIdData, error: businessIdError } = await supabase
        .rpc('get_user_business_id_safe');

      if (businessIdError) {
        console.error('Error calling get_user_business_id_safe:', businessIdError);
        throw businessIdError;
      }

      let foundBusinessId = businessIdData;

      if (!foundBusinessId) {
        // Fallback to business_users table
        const { data: businessUserData, error: businessUserError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle();

        if (businessUserError && businessUserError.code !== 'PGRST116') {
          throw businessUserError;
        }

        foundBusinessId = businessUserData?.business_id;
      }

      if (foundBusinessId) {
        setBusinessId(foundBusinessId);

        // Get business name
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('name')
          .eq('id', foundBusinessId)
          .single();

        if (businessError && businessError.code !== 'PGRST116') {
          console.error('Error fetching business name:', businessError);
        } else if (businessData) {
          setBusinessName(businessData.name);
        }
      } else {
        console.warn('No business found for user:', user.id);
        setBusinessId(null);
        setBusinessName(null);
      }
    } catch (err: any) {
      console.error('Error fetching business data:', err);
      setError('Falha ao buscar informações do negócio');
      setBusinessId(null);
      setBusinessName(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchBusinessData();
  };

  useEffect(() => {
    if (!authLoading) {
      fetchBusinessData();
    }
  }, [user, authLoading]);

  return (
    <TenantContext.Provider
      value={{
        businessId,
        businessName,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};
