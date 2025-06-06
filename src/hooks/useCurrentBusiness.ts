
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCurrentBusiness = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    const fetchBusinessId = async () => {
      if (!user) {
        setBusinessId(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First try to get from profile (fastest)
        if (profile?.business_id) {
          setBusinessId(profile.business_id);
          setIsLoading(false);
          return;
        }

        // Then try the safe function
        const { data: businessIdData, error: businessIdError } = await supabase
          .rpc('get_user_business_id_safe');

        if (businessIdError) {
          throw businessIdError;
        }

        if (businessIdData) {
          setBusinessId(businessIdData);
        } else {
          // Try to get business ID from business_users table as fallback
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

          if (businessUserData?.business_id) {
            setBusinessId(businessUserData.business_id);
          } else {
            console.warn('No business found for user:', user.id);
            setBusinessId(null);
          }
        }
      } catch (err: any) {
        console.error('Error fetching business ID:', err);
        setError('Falha ao buscar informações do negócio');
        setBusinessId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessId();
  }, [user, profile]);

  return {
    businessId,
    isLoading,
    error,
  };
};
