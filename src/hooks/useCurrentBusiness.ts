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
        
        try {
          // Try the business_users table first (preferred schema)
          try {
            console.log('Checking business_users table...');
            const { data: businessUserData, error: businessUserError } = await supabase
              .from('business_users')
              .select('business_id')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (businessUserError && businessUserError.code !== '42P01') { 
              // Ignore "relation does not exist" errors as that's expected if table doesn't exist
              console.error('Error fetching from business_users:', businessUserError);
            }
            
            // If found, use it
            if (businessUserData?.business_id) {
              currentBusinessId = businessUserData.business_id;
              console.log('Found business ID in business_users table:', currentBusinessId);
            }
          } catch (bizUserError) {
            console.error('Error checking business_users table:', bizUserError);
          }
          
          // If still not found, try legacy tables
          if (!currentBusinessId) {
            // Try application_users as fallback
            try {
              console.log('Checking application_users table...');
              const { data: appUserData, error: appUserError } = await supabase
                .from('application_users')
                .select('business_id')
                .eq('id', user.id)
                .maybeSingle();
                
              if (appUserError && appUserError.code !== '42P01') { 
                console.error('Error fetching from application_users:', appUserError);
              }
              
              if (appUserData?.business_id) {
                currentBusinessId = appUserData.business_id;
                console.log('Found business ID in application_users table:', currentBusinessId);
              }
            } catch (appUserError) {
              console.error('Error checking application_users table:', appUserError);
            }
            
            // As last resort, try the old usuarios table
            if (!currentBusinessId) {
              try {
                console.log('Trying legacy usuarios table as last resort');
                const { data: legacyUserData, error: legacyUserError } = await supabase
                  .from('usuarios')
                  .select('id_negocio')
                  .eq('id', user.id)
                  .maybeSingle();
                  
                if (legacyUserError && legacyUserError.code !== '42P01') { 
                  console.error('Error fetching from usuarios:', legacyUserError);
                }
                
                if (legacyUserData?.id_negocio) {
                  currentBusinessId = legacyUserData.id_negocio;
                  console.log('Found business ID in usuarios table:', currentBusinessId);
                }
              } catch (legacyError) {
                console.log('Legacy usuarios check failed or table does not exist');
              }
            }
          }
        } catch (fallbackError) {
          console.error('All business ID checks failed:', fallbackError);
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
        // No business ID found, likely needs onboarding
        setLoading(false);
        return;
      }

      // Fetch business data
      try {
        // Try businesses table first (preferred schema)
        try {
          console.log('Fetching from businesses table...');
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', currentBusinessId)
            .maybeSingle();
            
          if (businessError && businessError.code !== '42P01') {
            console.error('Error fetching from businesses:', businessError);
          }
          
          // If we found the business data, use it
          if (businessData) {
            console.log('Found business data in businesses table');
            setBusinessData(businessData);
            setLoading(false);
            return;
          }
        } catch (bizError) {
          console.error('Error checking businesses table:', bizError);
        }
        
        // Try the legacy negocios table as fallback
        try {
          console.log('Trying legacy negocios table as fallback');
          const { data: legacyBusinessData, error: legacyBusinessError } = await supabase
            .from('negocios')
            .select('*')
            .eq('id', currentBusinessId)
            .maybeSingle();
            
          if (legacyBusinessError && legacyBusinessError.code !== '42P01') {
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
            setLoading(false);
            return;
          }
        } catch (legacyError) {
          console.error('Error checking negocios table:', legacyError);
        }
        
        // If we get here, we didn't find business data in any table
        console.log('No business data found in any table');
      } catch (dataError) {
        console.error('Error fetching business data:', dataError);
        setError('Failed to retrieve business data');
      }
      
      // Make sure we keep the businessId in localStorage even if business data wasn't found
      if (currentBusinessId) {
        localStorage.setItem('currentBusinessId', currentBusinessId);
      }
    } catch (err: any) {
      console.error('Error in fetchBusinessData:', err);
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
      
      // First try with Edge Function
      try {
        const response = await supabase.functions.invoke('check-business-status', {
          body: { businessId: id }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        if (!response.data || !response.data.exists) {
          console.error('Business not found in check-business-status');
          return false;
        }
        
        // Now we know which table to update
        const tableName = response.data.tableName;
        
        // Perform the update
        if (tableName === 'businesses') {
          const { error } = await supabase
            .from('businesses')
            .update({ 
              status: status, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', id);
            
          if (error) throw error;
        } else if (tableName === 'negocios') {
          const { error } = await supabase
            .from('negocios')
            .update({ 
              status: status, 
              atualizado_em: new Date().toISOString() 
            })
            .eq('id', id);
            
          if (error) throw error;
        } else {
          throw new Error('Unknown table');
        }
        
        // Update local business data if successful
        if (businessData && id === businessData.id) {
          setBusinessData({
            ...businessData,
            status: status
          });
        }
        
        return true;
      } catch (edgeFunctionError) {
        console.error('Edge function error:', edgeFunctionError);
        
        // Fallback to direct table updates if edge function fails
        let success = false;
        
        // Try businesses table
        try {
          const { error: businessError } = await supabase
            .from('businesses')
            .update({ 
              status: status, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', id);
            
          if (!businessError) {
            success = true;
            console.log('Status updated successfully via businesses table');
          }
        } catch (updateError) {
          console.error('Failed to update businesses table:', updateError);
        }
        
        // Try negocios table if businesses update failed
        if (!success) {
          try {
            const { error: negociosError } = await supabase
              .from('negocios')
              .update({ 
                status: status, 
                atualizado_em: new Date().toISOString() 
              })
              .eq('id', id);
              
            if (!negociosError) {
              success = true;
              console.log('Status updated successfully via negocios table');
            }
          } catch (updateError) {
            console.error('Failed to update negocios table:', updateError);
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
      }
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
