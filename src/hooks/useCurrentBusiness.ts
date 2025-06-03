
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentBusiness = () => {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessId = async () => {
      if (!user) {
        setBusinessId(null);
        setIsLoading(false);
        return;
      }

      try {
        // Try to get business from business_users table
        const { data: businessUser, error: businessUserError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .single();

        if (!businessUserError && businessUser) {
          setBusinessId(businessUser.business_id);
          setIsLoading(false);
          return;
        }

        // If not found, try to get from businesses table directly
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('admin_email', user.email)
          .single();

        if (!businessError && business) {
          setBusinessId(business.id);
        } else {
          setBusinessId(null);
        }
      } catch (error) {
        console.error('Error fetching business:', error);
        setBusinessId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessId();
  }, [user]);

  return { businessId, isLoading };
};
