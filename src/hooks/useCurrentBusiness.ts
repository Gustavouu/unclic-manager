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
        
        // Get business ID from business_users table (new schema)
        const { data: businessUserData, error: businessUserError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (businessUserError) {
          console.error('Error fetching from business_users:', businessUserError);
          // Don't throw here, try the application_users fallback
        }
        
        // If found, use it
        if (businessUserData?.business_id) {
          currentBusinessId = businessUserData.business_id;
          console.log('Found business ID in business_users table:', currentBusinessId);
        } else {
          // Try the legacy tables as fallback
          try {
            // Try application_users first
            const { data: appUserData, error: appUserError } = await supabase
              .from('application_users')
              .select('business_id')
              .eq('id', user.id)
              .maybeSingle();
              
            if (appUserError && appUserError.code !== '42P01') { // Ignore "relation does not exist" errors
              console.error('Error fetching from application_users:', appUserError);
            }
            
            if (appUserData?.business_id) {
              currentBusinessId = appUserData.business_id;
              console.log('Found business ID in application_users table:', currentBusinessId);
            } else {
              // As last resort, try the old usuarios table
              try {
                console.log('Trying legacy usuarios table as last resort');
                const { data: legacyUserData, error: legacyUserError } = await supabase
                  .from('usuarios')
                  .select('id_negocio')
                  .eq('id', user.id)
                  .maybeSingle();
                  
                if (legacyUserError && legacyUserError.code !== '42P01') { // Ignore "relation does not exist" errors
                  console.error('Error fetching from usuarios:', legacyUserError);
                }
                
                if (legacyUserData?.id_negocio) {
                  currentBusinessId = legacyUserData.id_negocio;
                  console.log('Found business ID in usuarios table:', currentBusinessId);
                }
              } catch (legacyError) {
                console.log('Legacy usuarios check failed, skipping');
              }
            }
          } catch (fallbackError) {
            console.error('Error in fallback business ID checks:', fallbackError);
          }
        }
        
        // If we found a business ID, store it for future use
        if (currentBusinessId) {
          localStorage.setItem('currentBusinessId', currentBusinessId);
        } else {
          console.log('No business ID found in any table');
        }
      } else {
        console.log('Using business ID from localStorage:', currentBusinessId);
      }

      // Set the business ID in state
      setBusinessId(currentBusinessId);

      if (!currentBusinessId) {
        setError('Business ID not available');
        setLoading(false);
        return;
      }

      // Fetch business data from businesses table (new schema)
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', currentBusinessId)
        .maybeSingle();
        
      if (businessError) {
        console.error('Error fetching from businesses:', businessError);
        // Don't throw here, try the negocios fallback
      }
      
      // If we found the business data, use it
      if (businessData) {
        console.log('Found business data in businesses table');
        setBusinessData(businessData);
      } else {
        // Try the legacy negocios table as fallback
        try {
          console.log('Trying legacy negocios table as fallback');
          const { data: legacyBusinessData, error: legacyBusinessError } = await supabase
            .from('negocios')
            .select('*')
            .eq('id', currentBusinessId)
            .maybeSingle();
            
          if (legacyBusinessError && legacyBusinessError.code !== '42P01') { // Ignore "relation does not exist" errors
            console.error('Error fetching from negocios:', legacyBusinessError);
          }
          
          // Map legacy data structure to new structure if found
          if (legacyBusinessData) {
            console.log('Found business data in negocios table');
            const mappedData = {
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
            setBusinessData(mappedData);
          } else {
            console.log('No business data found in either table');
            setError('Business data not found');
          }
        } catch (legacyError) {
          console.error('Error in legacy business data check:', legacyError);
          setError('Failed to retrieve business data');
        }
      }
      
      // Make sure we keep the businessId in localStorage
      if (currentBusinessId) {
        localStorage.setItem('currentBusinessId', currentBusinessId);
      }
    } catch (err: any) {
      console.error('Error fetching business data:', err);
      setError(err.message || 'Error fetching business data');
      toast.error('Failed to load your business data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  const updateBusinessStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      console.log(`Attempting to update business ${id} status to ${status}`);
      
      // First try with set_business_status RPC
      let success = false;
      
      try {
        const { data, error } = await supabase
          .rpc('set_business_status', { business_id: id, new_status: status });
          
        if (error) {
          console.error('Error in set_business_status RPC:', error);
        } else {
          console.log('Status updated successfully via RPC');
          success = true;
        }
      } catch (rpcError) {
        console.error('Failed to call set_business_status RPC:', rpcError);
      }
      
      // If RPC fails, try direct update to businesses table
      if (!success) {
        try {
          const { error: businessError } = await supabase
            .from('businesses')
            .update({ 
              status: status, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', id);
            
          if (businessError) {
            console.error('Error updating businesses:', businessError);
            
            // Try negocios table as fallback
            try {
              const { error: negociosError } = await supabase
                .from('negocios')
                .update({ 
                  status: status, 
                  atualizado_em: new Date().toISOString() 
                })
                .eq('id', id);
                
              if (negociosError && negociosError.code !== '42P01') { // Ignore "relation does not exist" errors
                console.error('Error updating negocios:', negociosError);
                throw negociosError;
              } else if (!negociosError) {
                console.log('Status updated successfully via negocios table');
                success = true;
              }
            } catch (negociosUpdateError) {
              console.error('Failed to update negocios status:', negociosUpdateError);
            }
          } else {
            console.log('Status updated successfully via businesses table');
            success = true;
          }
        } catch (updateError) {
          console.error('Failed to update business status:', updateError);
        }
      }
      
      // Update local business data if successful
      if (success && businessData && id === businessData.id) {
        setBusinessData({
          ...businessData,
          status: status
        });
      }
      
      return success;
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
