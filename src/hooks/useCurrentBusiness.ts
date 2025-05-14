
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
      
      // Fetch business data
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*, business_settings(*)')
        .eq('id', businessId)
        .single();
      
      if (businessError) throw businessError;
      
      // Transform data to include settings
      const transformedData = {
        ...business,
        settings: business.business_settings ? business.business_settings[0] || {} : {}
      };
      
      setBusinessData(transformedData);
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
      // Update settings in the database
      const { error: updateError } = await supabase
        .from('business_settings')
        .update(settings)
        .eq('business_id', businessId);
      
      if (updateError) throw updateError;
      
      // Update local state
      setBusinessData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...settings
        }
      }));
      
    } catch (error: any) {
      console.error('Error updating business settings:', error);
      setError(error.message);
    }
  };

  const updateBusinessStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBusinessData(prev => ({
        ...prev,
        status
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating business status:', error);
      return false;
    }
  };

  useEffect(() => {
    const getCurrentBusiness = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get the user's current business from business_users table
        const { data: businessUser, error: businessUserError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .single();
        
        if (businessUserError && businessUserError.code !== 'PGRST116') {
          throw businessUserError;
        }
        
        if (businessUser?.business_id) {
          setBusinessId(businessUser.business_id);
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error getting current business:', error);
        setError(error.message);
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
    fetchBusinessData
  };
};
