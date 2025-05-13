import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCurrentBusiness = () => {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(() => {
    return localStorage.getItem('currentBusinessId');
  });
  const [businessData, setBusinessData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);

  // Add a cache timeout of 5 minutes (300000 ms)
  const CACHE_TIMEOUT = 5 * 60 * 1000;
  const MAX_RETRIES = 3;

  const fetchBusinessData = useCallback(async (skipCache = false) => {
    if (!user) {
      console.log('No authenticated user, skipping business fetch');
      setLoading(false);
      setBusinessId(null);
      setBusinessData(null);
      localStorage.removeItem('currentBusinessId');
      return;
    }

    const now = Date.now();
    // If we've fetched recently and don't want to skip cache, don't fetch again
    if (!skipCache && now - lastFetchTimestamp < CACHE_TIMEOUT && businessData) {
      console.log('Using cached business data');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching business data for user:', user.id);
      
      // Check if we already have a businessId in localStorage
      let currentBusinessId = localStorage.getItem('currentBusinessId');
      console.log('Current business ID from localStorage:', currentBusinessId);
      
      if (!currentBusinessId) {
        // If not, fetch it from the database
        console.log('No business ID in localStorage, fetching from database');
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('id_negocio')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user business ID:', userError);
          throw userError;
        }

        if (!userData?.id_negocio) {
          // User doesn't have a business associated
          console.log('User has no associated business');
          setLoading(false);
          setBusinessId(null);
          setBusinessData(null);
          localStorage.removeItem('currentBusinessId');
          return;
        }
        
        currentBusinessId = userData.id_negocio;
        console.log('Retrieved business ID from database:', currentBusinessId);
        
        // Store it in localStorage for future use
        localStorage.setItem('currentBusinessId', currentBusinessId);
      }

      // Set the business ID in state
      setBusinessId(currentBusinessId);

      // Fetch complete business data
      console.log('Fetching complete business data for ID:', currentBusinessId);
      const { data: businessData, error: businessError } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', currentBusinessId)
        .maybeSingle();

      if (businessError) {
        console.error('Error fetching business data:', businessError);
        throw businessError;
      }

      if (!businessData) {
        console.error('Business data not found for ID:', currentBusinessId);
        // Invalid business ID in localStorage, remove it
        localStorage.removeItem('currentBusinessId');
        setBusinessId(null);
        setBusinessData(null);
        setError('Negócio não encontrado. O ID pode estar inválido.');
        setLoading(false);
        return;
      }

      console.log('Business data retrieved successfully:', businessData);
      setBusinessData(businessData);
      setLastFetchTimestamp(Date.now());
      setRetryCount(0); // Reset retry count on success
      
      // Make sure we keep the businessId in localStorage
      if (businessData && businessData.id) {
        localStorage.setItem('currentBusinessId', businessData.id);
      }
    } catch (err: any) {
      console.error('Erro ao buscar dados do negócio:', err);
      setError(err.message || 'Erro ao buscar dados do negócio');
      
      // Implement retry mechanism
      if (retryCount < MAX_RETRIES) {
        const nextRetry = retryCount + 1;
        console.log(`Retrying business data fetch (${nextRetry}/${MAX_RETRIES})...`);
        setRetryCount(nextRetry);
        
        // Exponential backoff for retries
        setTimeout(() => {
          fetchBusinessData(true); // Skip cache on retry
        }, Math.pow(2, retryCount) * 1000); // 1s, 2s, 4s
      } else if (retryCount === MAX_RETRIES) {
        toast.error('Não foi possível carregar os dados do seu negócio após várias tentativas.');
        setRetryCount(0); // Reset for next time
      }
    } finally {
      setLoading(false);
    }
  }, [user, businessData, lastFetchTimestamp, retryCount]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchBusinessData();
    } else {
      // Clear business data if user is not logged in
      setBusinessId(null);
      setBusinessData(null);
      setError(null);
      localStorage.removeItem('currentBusinessId');
      setLoading(false);
    }
  }, [fetchBusinessData, user]);

  const updateBusinessStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('set_business_status', { business_id: id, new_status: status });

      if (error) throw error;
      
      // Update local business data
      if (businessData && id === businessData.id) {
        setBusinessData({
          ...businessData,
          status: status
        });
      }
      
      toast.success(`Status do negócio atualizado para: ${status}`);
      return true;
    } catch (err: any) {
      console.error('Error updating business status:', err);
      toast.error(`Erro ao atualizar status: ${err.message}`);
      return false;
    }
  };

  return { 
    businessId, 
    businessData, 
    loading, 
    error,
    updateBusinessStatus,
    fetchBusinessData
  };
};
