
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client'; // Updated import path
import { toast } from 'sonner';

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
        
        // Usar uma query mais simples para evitar problemas de recursão nas políticas
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('id_negocio')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) {
          throw userError;
        }

        if (!userData?.id_negocio) {
          // Usuário não tem negócio associado
          setLoading(false);
          return;
        }

        setBusinessId(userData.id_negocio);

        // Buscar os dados completos do negócio com uma query simples
        const { data: businessData, error: businessError } = await supabase
          .from('negocios')
          .select('*')
          .eq('id', userData.id_negocio)
          .maybeSingle();

        if (businessError) {
          throw businessError;
        }

        setBusinessData(businessData);
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

  return { 
    businessId, 
    businessData, 
    loading, 
    error 
  };
};
