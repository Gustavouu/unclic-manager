
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
      setError(null);
      
      // Check if we already have a businessId in localStorage
      let currentBusinessId = localStorage.getItem('currentBusinessId');
      
      if (!currentBusinessId) {
        console.log('No business ID in localStorage, fetching from database');
        
        // First try to fetch from the new application_users table
        let { data: userData, error: userError } = await supabase
          .from('application_users')
          .select('business_id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (userError) {
          console.error('Error fetching from application_users:', userError);
        }
        
        if (!userData?.business_id) {
          console.log('No business_id in application_users, trying usuarios table');
          // If not found, try the legacy usuarios table
          const { data: legacyUserData, error: legacyUserError } = await supabase
            .from('usuarios')
            .select('id_negocio')
            .eq('id', user.id)
            .maybeSingle();

          if (legacyUserError) {
            console.error('Error fetching from usuarios:', legacyUserError);
            throw new Error('Não foi possível identificar seu negócio. Por favor, tente novamente mais tarde.');
          }

          if (!legacyUserData?.id_negocio) {
            // User doesn't have a business associated
            console.log('User has no business associated');
            setLoading(false);
            setError('Nenhum negócio associado ao usuário.');
            return;
          }
          
          currentBusinessId = legacyUserData.id_negocio;
          console.log('Found business ID in usuarios table:', currentBusinessId);
        } else {
          currentBusinessId = userData.business_id;
          console.log('Found business ID in application_users table:', currentBusinessId);
        }
        
        // Store it in localStorage for future use
        if (currentBusinessId) {
          localStorage.setItem('currentBusinessId', currentBusinessId);
        }
      } else {
        console.log('Using business ID from localStorage:', currentBusinessId);
      }

      // Set the business ID in state
      setBusinessId(currentBusinessId);

      if (!currentBusinessId) {
        setError('ID do negócio não disponível');
        setLoading(false);
        return;
      }

      // First try to fetch from businesses table
      console.log('Fetching business data from businesses table');
      let { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', currentBusinessId)
        .maybeSingle();
      
      if (businessError) {
        console.error('Error fetching from businesses:', businessError);
      }
      
      if (!businessData) {
        console.log('No data in businesses table, trying negocios table');
        // If not found, try the legacy negocios table
        const { data: legacyBusinessData, error: legacyBusinessError } = await supabase
          .from('negocios')
          .select('*')
          .eq('id', currentBusinessId)
          .maybeSingle();

        if (legacyBusinessError) {
          console.error('Error fetching from negocios:', legacyBusinessError);
          throw new Error('Não foi possível carregar dados do seu negócio. Por favor, tente novamente mais tarde.');
        }
        
        // If using legacy data, map to new structure
        if (legacyBusinessData) {
          console.log('Found business data in negocios table');
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
        } else {
          console.log('No business data found in either table');
        }
      } else {
        console.log('Found business data in businesses table');
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
      // First try with set_business_status RPC
      let success = false;
      try {
        const { data, error } = await supabase
          .rpc('set_business_status', { business_id: id, new_status: status });

        if (error) {
          console.error('Error in set_business_status RPC:', error);
        } else {
          success = true;
        }
      } catch (rpcError) {
        console.error('Failed to call set_business_status RPC:', rpcError);
      }
      
      // If RPC fails, try direct update to businesses
      if (!success) {
        try {
          const { error: businessError } = await supabase
            .from('businesses')
            .update({ status: status, updated_at: new Date() })
            .eq('id', id);
            
          if (businessError) {
            console.error('Error updating businesses:', businessError);
            
            // Finally try negocios table
            const { error: negociosError } = await supabase
              .from('negocios')
              .update({ status: status, atualizado_em: new Date() })
              .eq('id', id);
              
            if (negociosError) {
              console.error('Error updating negocios:', negociosError);
              throw negociosError;
            }
          }
        } catch (updateError) {
          console.error('Failed to update business status:', updateError);
          throw updateError;
        }
      }
      
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
