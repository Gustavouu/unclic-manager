
import { useState, useEffect, useCallback } from 'react';
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

  const fetchBusinessData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check if we already have a businessId in localStorage
      let currentBusinessId = localStorage.getItem('currentBusinessId');
      
      if (!currentBusinessId) {
        // If not, first try to fetch it from the new application_users table
        let { data: userData, error: userError } = await supabase
          .from('application_users')
          .select('business_id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (userError || !userData?.business_id) {
          // If not found, try the legacy usuarios table
          const { data: legacyUserData, error: legacyUserError } = await supabase
            .from('usuarios')
            .select('id_negocio')
            .eq('id', user.id)
            .maybeSingle();

          if (legacyUserError) {
            throw legacyUserError;
          }

          if (!legacyUserData?.id_negocio) {
            // User doesn't have a business associated
            setLoading(false);
            return;
          }
          
          currentBusinessId = legacyUserData.id_negocio;
        } else {
          currentBusinessId = userData.business_id;
        }
        
        // Store it in localStorage for future use
        localStorage.setItem('currentBusinessId', currentBusinessId);
      }

      // Set the business ID in state
      setBusinessId(currentBusinessId);

      // First try to fetch from businesses table
      let { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', currentBusinessId)
        .maybeSingle();
      
      if (businessError || !businessData) {
        // If not found, try the legacy negocios table
        const { data: legacyBusinessData, error: legacyBusinessError } = await supabase
          .from('negocios')
          .select('*')
          .eq('id', currentBusinessId)
          .maybeSingle();

        if (legacyBusinessError) {
          throw legacyBusinessError;
        }
        
        // If using legacy data, map to new structure
        if (legacyBusinessData) {
          businessData = {
            id: legacyBusinessData.id,
            name: legacyBusinessData.nome,
            slug: legacyBusinessData.slug,
            admin_email: legacyBusinessData.email_admin,
            phone: legacyBusinessData.telefone,
            address: legacyBusinessData.endereco,
            address_number: legacyBusinessData.numero,
            address_complement: legacyBusinessData.complemento,
            neighborhood: legacyBusinessData.bairro,
            city: legacyBusinessData.cidade,
            state: legacyBusinessData.estado,
            zip_code: legacyBusinessData.cep,
            ein: legacyBusinessData.cnpj,
            legal_name: legacyBusinessData.razao_social,
            trade_name: legacyBusinessData.nome_fantasia,
            logo_url: legacyBusinessData.url_logo,
            description: legacyBusinessData.descricao,
            status: legacyBusinessData.status,
            subscription_status: legacyBusinessData.status_assinatura,
            created_at: legacyBusinessData.criado_em,
            updated_at: legacyBusinessData.atualizado_em
          };
        }
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
  }, [user]);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

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
    updateBusinessStatus,
    fetchBusinessData
  };
};
