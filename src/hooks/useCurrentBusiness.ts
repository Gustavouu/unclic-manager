import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentBusiness = () => {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(null);
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
        
        // Buscar o perfil do usuário para obter o id_negocio
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('id_negocio')
          .eq('id', user.id)
          .single();

        if (userError) {
          throw userError;
        }

        if (!userData?.id_negocio) {
          // Usuário não tem negócio associado
          setLoading(false);
          return;
        }

        setBusinessId(userData.id_negocio);

        // Buscar os dados completos do negócio
        const { data: businessData, error: businessError } = await supabase
          .from('negocios')
          .select('*')
          .eq('id', userData.id_negocio)
          .single();

        if (businessError) {
          throw businessError;
        }

        setBusinessData(businessData);
      } catch (err: any) {
        console.error('Erro ao buscar dados do negócio:', err);
        setError(err.message || 'Erro ao buscar dados do negócio');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  return { 
    businessId, 
    businessData, 
    loading, 
    error 
  };
}; 