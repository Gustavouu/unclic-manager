
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { safeSingleExtract } from '@/utils/databaseUtils';

export const useCurrentBusiness = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBusinessData = async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      
      // Try to get business data with settings
      console.log(`Fetching business data for ID: ${businessId}`);
      
      // First try businesses table
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*, business_settings(*)')
        .eq('id', businessId)
        .maybeSingle();
      
      if (!businessError && business) {
        console.log('Business data retrieved from businesses table:', business);
        
        // Transform data to include settings
        const transformedData = {
          ...business,
          settings: business.business_settings || {}
        };
        
        setBusinessData(transformedData);
        setError(null);
        return;
      }
      
      // If businesses table query failed, try negocios table
      console.log('Trying negocios table as fallback');
      const { data: negocio, error: negocioError } = await supabase
        .from('negocios')
        .select('*, configuracoes_negocio(*)')
        .eq('id', businessId)
        .maybeSingle();
      
      if (negocioError) {
        console.error('Error fetching business data:', negocioError);
        throw negocioError;
      }
      
      if (!negocio) {
        console.warn(`No business found with ID: ${businessId}`);
        setBusinessData(null);
        setError('Business not found');
        return;
      }
      
      console.log('Business data retrieved from negocios table:', negocio);
      
      // Transform data to use consistent naming with businesses table
      const transformedData = {
        ...negocio,
        name: negocio.nome,
        address: negocio.endereco,
        zip_code: negocio.cep,
        address_number: negocio.numero,
        admin_email: negocio.email_admin,
        status: negocio.status,
        settings: negocio.configuracoes_negocio || {}
      };
      
      setBusinessData(transformedData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching business data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessSettings = async (settings: any) => {
    if (!businessId) return;
    
    try {
      console.log(`Updating settings for business ${businessId}:`, settings);
      
      // First try business_settings table
      let result;
      try {
        // Verify if settings record exists first
        const { data: existingSettings } = await supabase
          .from('business_settings')
          .select('id')
          .eq('business_id', businessId)
          .maybeSingle();
        
        if (existingSettings) {
          // Update existing record
          result = await supabase
            .from('business_settings')
            .update(settings)
            .eq('business_id', businessId);
        } else {
          // Create new record
          result = await supabase
            .from('business_settings')
            .insert({ ...settings, business_id: businessId });
        }
        
        if (!result.error) {
          // Update successful on business_settings
          // Update local state
          setBusinessData(prev => ({
            ...prev,
            settings: {
              ...prev?.settings,
              ...settings
            }
          }));
          
          console.log('Business settings updated successfully in business_settings table');
          return true;
        }
      } catch (err) {
        console.warn('Error updating business_settings, will try configuracoes_negocio:', err);
      }
      
      // If business_settings failed, try configuracoes_negocio
      try {
        // Verify if settings record exists first
        const { data: existingSettings } = await supabase
          .from('configuracoes_negocio')
          .select('id')
          .eq('id_negocio', businessId)
          .maybeSingle();
        
        if (existingSettings) {
          // Update existing record
          result = await supabase
            .from('configuracoes_negocio')
            .update({
              // Map fields between different table schemas
              logo_url: settings.logo_url,
              banner_url: settings.banner_url,
              cores_primarias: settings.primary_color,
              cores_secundarias: settings.secondary_color,
              permite_agendamentos_simultaneos: settings.allow_online_booking,
              pagamento_antecipado_obrigatorio: settings.require_advance_payment,
              aviso_minimo_agendamento: settings.minimum_notice_time,
              dias_maximos_antecedencia: settings.maximum_days_in_advance
            })
            .eq('id_negocio', businessId);
        } else {
          // Create new record
          result = await supabase
            .from('configuracoes_negocio')
            .insert({
              id_negocio: businessId,
              logo_url: settings.logo_url,
              banner_url: settings.banner_url,
              cores_primarias: settings.primary_color,
              cores_secundarias: settings.secondary_color,
              permite_agendamentos_simultaneos: settings.allow_online_booking,
              pagamento_antecipado_obrigatorio: settings.require_advance_payment,
              aviso_minimo_agendamento: settings.minimum_notice_time,
              dias_maximos_antecedencia: settings.maximum_days_in_advance
            });
        }
      } catch (err) {
        console.error('Error updating configuracoes_negocio:', err);
        throw err;
      }
      
      if (result?.error) throw result.error;
      
      // Update local state
      setBusinessData(prev => ({
        ...prev,
        settings: {
          ...prev?.settings,
          ...settings
        }
      }));
      
      console.log('Business settings updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating business settings:', error);
      setError(error.message);
      return false;
    }
  };

  const updateBusinessStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      console.log(`Updating business ${id} status to ${status}`);
      
      // First attempt: Try using the RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('set_business_status', {
        business_id: id,
        new_status: status
      });
      
      if (!rpcError) {
        console.log('Business status updated successfully via RPC');
        
        // Update local state
        setBusinessData(prev => ({
          ...prev,
          status
        }));
        
        // Refresh business data
        fetchBusinessData();
        return true;
      }
      
      console.warn('Error using RPC, trying direct update:', rpcError);
      
      // Try businesses table
      let updateResult = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', id);
        
      if (!updateResult.error) {
        console.log('Business status updated successfully via businesses table');
        
        // Update local state
        setBusinessData(prev => ({
          ...prev,
          status
        }));
        
        // Refresh business data
        fetchBusinessData();
        return true;
      }
      
      // Try negocios table
      updateResult = await supabase
        .from('negocios')
        .update({ status })
        .eq('id', id);
        
      if (updateResult.error) throw updateResult.error;
      
      console.log('Business status updated successfully via negocios table');
      
      // Update local state
      setBusinessData(prev => ({
        ...prev,
        status
      }));
      
      // Refresh business data
      fetchBusinessData();
      return true;
    } catch (error: any) {
      console.error('Error updating business status:', error);
      toast.error("Erro ao atualizar status do negócio");
      return false;
    }
  };

  const clearBusinessCache = () => {
    // Clear any cached business data
    localStorage.removeItem(`business-${businessId}`);
    localStorage.removeItem(`business-${businessId}-timestamp`);
    console.log('Business cache cleared');
  };

  useEffect(() => {
    const getCurrentBusiness = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        console.log(`Getting business for user ${user.id}`);
        
        // First try business_users table with limit 1 to avoid multiple results error
        const { data: businessUsers, error: businessUsersError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (!businessUsersError && businessUsers && businessUsers.length > 0) {
          console.log(`Found business ID in business_users: ${businessUsers[0].business_id}`);
          setBusinessId(businessUsers[0].business_id);
          return;
        }
        
        // If business_users table doesn't work, try usuarios table
        if (!businessUsersError || businessUsersError.code === 'PGRST116') {
          console.log('Trying usuarios table as fallback');
          const { data: usuarios, error: usuariosError } = await supabase
            .from('usuarios')
            .select('id_negocio')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!usuariosError && usuarios && usuarios.id_negocio) {
            console.log(`Found business ID in usuarios: ${usuarios.id_negocio}`);
            setBusinessId(usuarios.id_negocio);
            return;
          }
          
          if (usuariosError && usuariosError.code !== 'PGRST116') {
            console.error('Error querying usuarios:', usuariosError);
          }
        }
        
        // Check if there are any businesses with this user as admin
        const { data: adminBusinesses, error: adminError } = await supabase
          .from('businesses')
          .select('id')
          .eq('admin_email', user.email)
          .limit(1);
          
        if (!adminError && adminBusinesses && adminBusinesses.length > 0) {
          console.log(`Found business with admin email: ${adminBusinesses[0].id}`);
          
          // Also create the association in business_users
          try {
            const { error: associationError } = await supabase
              .from('business_users')
              .insert({
                business_id: adminBusinesses[0].id,
                user_id: user.id,
                role: 'owner'
              });
              
            if (!associationError) {
              console.log('Created business_users association');
            }
          } catch (err) {
            console.warn('Error creating business_users association (may already exist):', err);
          }
          
          setBusinessId(adminBusinesses[0].id);
          return;
        }
        
        // Try negocios table as fallback
        const { data: adminNegocios, error: adminNegociosError } = await supabase
          .from('negocios')
          .select('id')
          .eq('email_admin', user.email)
          .limit(1);
          
        if (!adminNegociosError && adminNegocios && adminNegocios.length > 0) {
          console.log(`Found negocio with admin email: ${adminNegocios[0].id}`);
          setBusinessId(adminNegocios[0].id);
          return;
        }
        
        console.log('No business found for this user');
        setBusinessId(null);
      } catch (error: any) {
        console.error('Error getting current business:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    getCurrentBusiness();
  }, [user]);
  
  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);
  
  return { 
    businessId, 
    businessData, 
    loading, 
    error,
    updateBusinessStatus,
    updateBusinessSettings,
    fetchBusinessData,
    clearBusinessCache
  };
};
