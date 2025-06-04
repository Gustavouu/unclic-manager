
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export const useCurrentBusiness = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

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

        // First, try to get business ID from business_users table
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
          setIsLoading(false);
          return;
        }

        // If not found, check if user has a business through application_users
        const { data: appUserData, error: appUserError } = await supabase
          .from('application_users')
          .select('business_id')
          .eq('id', user.id)
          .limit(1)
          .maybeSingle();

        if (appUserError && appUserError.code !== 'PGRST116') {
          throw appUserError;
        }

        if (appUserData?.business_id) {
          setBusinessId(appUserData.business_id);
        } else {
          // Try to find any business where the user is the admin
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
        }
      } catch (err: any) {
        console.error('Error fetching business ID:', err);
        setError(err.message || 'Failed to fetch business information');
        setBusinessId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessId();
  }, [user]);

  return {
    businessId,
    isLoading,
    error,
  };
};
