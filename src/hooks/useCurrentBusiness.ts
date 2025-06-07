
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentBusiness = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentBusiness = async () => {
      try {
        // Verificar se há um usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setBusinessId(null);
          setIsLoading(false);
          return;
        }

        // Buscar o negócio do usuário
        const { data: businessUser, error } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.warn('No business found for user:', error.message);
          setBusinessId(null);
        } else {
          setBusinessId(businessUser.business_id);
        }
      } catch (error) {
        console.error('Error getting current business:', error);
        setBusinessId(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentBusiness();
  }, []);

  return { businessId, isLoading };
};
