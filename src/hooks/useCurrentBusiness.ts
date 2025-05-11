import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCurrentBusiness = () => {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(
    localStorage.getItem('currentBusinessId')
  );
  const [businessData, setBusinessData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if we already have a businessId in localStorage
        let currentBusinessId = localStorage.getItem('currentBusinessId');
        
        if (!currentBusinessId) {
          // If not, fetch it from the database
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('id_negocio')
            .eq('id', user.id)
            .maybeSingle();

          if (userError) {
            throw userError;
          }

          if (!userData?.id_negocio) {
            // User doesn't have a business associated
            setLoading(false);
            return;
          }
          
          currentBusinessId = userData.id_negocio;
          
          // Store it in localStorage for future use
          localStorage.setItem('currentBusinessId', currentBusinessId);
        }

        // Set the business ID in state
        setBusinessId(currentBusinessId);

        // Fetch complete business data
        const { data: businessData, error: businessError } = await supabase
          .from('negocios')
          .select('*')
          .eq('id', currentBusinessId)
          .maybeSingle();

        if (businessError) {
          throw businessError;
        }

        setBusinessData(businessData);
        
        // Make sure we keep the businessId in localStorage
        if (businessData && businessData.id) {
          localStorage.setItem('currentBusinessId', businessData.id);
        }
      } catch (err: any) {
        console.error('Erro ao buscar dados do negócio:', err);
        setError(err.message || 'Erro ao buscar dados do negócio');
        toast.error('Não foi possível carregar os dados do seu negócio.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

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
      
      return true;
    } catch (err) {
      console.error('Error updating business status:', err);
      return false;
    }
  };

  return { 
    businessId, 
    businessData, 
    loading, 
    error,
    updateBusinessStatus
  };
};
