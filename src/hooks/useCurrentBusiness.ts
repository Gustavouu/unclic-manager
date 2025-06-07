
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentBusiness = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentBusiness = async () => {
      try {
        setError(null);
        
        // Verificar se há um usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setBusinessId(null);
          setIsLoading(false);
          return;
        }

        // Buscar o negócio do usuário
        const { data: businessUser, error: businessError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .single();

        if (businessError) {
          console.warn('No business found for user:', businessError.message);
          setError('Nenhum negócio encontrado para este usuário');
          setBusinessId(null);
        } else {
          setBusinessId(businessUser.business_id);
        }
      } catch (error) {
        console.error('Error getting current business:', error);
        setError('Erro ao carregar informações do negócio');
        setBusinessId(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentBusiness();
  }, []);

  return { businessId, isLoading, error };
};
