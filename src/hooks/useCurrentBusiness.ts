
import { useState, useEffect } from 'react';
import { getUserBusinessIdSafe } from '@/utils/businessAccess';

export const useCurrentBusiness = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentBusiness = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        console.log('useCurrentBusiness: Fetching business ID');
        
        const fetchedBusinessId = await getUserBusinessIdSafe();
        
        if (fetchedBusinessId) {
          console.log('useCurrentBusiness: Found business ID:', fetchedBusinessId);
          setBusinessId(fetchedBusinessId);
        } else {
          console.warn('useCurrentBusiness: No business found for user');
          setError('Nenhum negócio encontrado para este usuário');
          setBusinessId(null);
        }
      } catch (error) {
        console.error('useCurrentBusiness: Error getting current business:', error);
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
