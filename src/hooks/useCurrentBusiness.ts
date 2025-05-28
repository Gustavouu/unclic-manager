
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { normalizeBusinessData } from '@/utils/databaseUtils';

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
      
      console.log(`Fetching business data for ID: ${businessId}`);
      
      // Use the migrated businesses table with settings
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*, business_settings(*)')
        .eq('id', businessId)
        .maybeSingle();
      
      if (businessError) {
        console.error('Error fetching business data:', businessError);
        throw businessError;
      }
      
      if (!business) {
        console.warn(`No business found with ID: ${businessId}`);
        setBusinessData(null);
        setError('Business not found');
        return;
      }
      
      console.log('Business data retrieved:', business);
      
      // Normalize and transform data
      const normalizedBusiness = normalizeBusinessData(business);
      const transformedData = {
        ...normalizedBusiness,
        settings: business.business_settings || {}
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
      
      // Check if settings record exists
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('business_id', businessId)
        .maybeSingle();
      
      let result;
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
      
      if (result.error) throw result.error;
      
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
      
      // Use the improved RPC function from migration
      const { data: rpcData, error: rpcError } = await supabase.rpc('verificar_completar_onboarding_v2', {
        business_id_param: id
      });
      
      if (rpcError) {
        console.warn('Error using RPC, trying direct update:', rpcError);
        
        // Fallback to direct update
        const updateResult = await supabase
          .from('businesses')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
          
        if (updateResult.error) throw updateResult.error;
      }
      
      console.log('Business status updated successfully');
      
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
        
        // Use the migrated business_users table
        const { data: businessUsers, error: businessUsersError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (!businessUsersError && businessUsers && businessUsers.length > 0) {
          console.log(`Found business ID: ${businessUsers[0].business_id}`);
          setBusinessId(businessUsers[0].business_id);
          return;
        }
        
        console.warn('No business association found for user');
        setError('No business found for user');
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
    updateBusinessSettings,
    updateBusinessStatus,
    clearBusinessCache,
    refreshBusinessData: fetchBusinessData
  };
};
