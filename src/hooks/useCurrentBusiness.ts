
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
      
      // Try to get business data with settings
      console.log(`Fetching business data for ID: ${businessId}`);
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
      
      // Transform data to include settings
      const transformedData = {
        ...business,
        settings: business.business_settings?.length 
          ? business.business_settings[0] 
          : business.business_settings || {}
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
      
      // Verify if settings record exists first
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
      
      // Second attempt: Update the business status directly
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      console.log('Business status updated successfully via direct update');
      
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
        
        // First try business_users table
        const { data: businessUser, error: businessUserError } = await supabase
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (businessUserError) {
          console.error('Error querying business_users:', businessUserError);
        }
        
        // If found in business_users, use that
        if (businessUser?.business_id) {
          console.log(`Found business ID in business_users: ${businessUser.business_id}`);
          setBusinessId(businessUser.business_id);
          return;
        }
        
        // If not found, try usuarios table (legacy table)
        const { data: userLegacy, error: userLegacyError } = await supabase
          .from('usuarios')
          .select('id_negocio')
          .eq('id', user.id)
          .maybeSingle();
          
        if (userLegacyError && userLegacyError.code !== 'PGRST116') {
          console.error('Error querying usuarios table:', userLegacyError);
        }
        
        // If found in usuarios, use that
        if (userLegacy?.id_negocio) {
          console.log(`Found business ID in usuarios: ${userLegacy.id_negocio}`);
          setBusinessId(userLegacy.id_negocio);
          return;
        }
        
        // Check if there are any businesses with this user as admin
        const { data: adminBusiness, error: adminError } = await supabase
          .from('businesses')
          .select('id')
          .eq('admin_email', user.email)
          .maybeSingle();
          
        if (adminError) {
          console.error('Error querying businesses by admin email:', adminError);
        }
        
        // If found as admin, use that
        if (adminBusiness?.id) {
          console.log(`Found business with admin email: ${adminBusiness.id}`);
          
          // Also create the association in business_users
          const { error: associationError } = await supabase
            .from('business_users')
            .insert({
              business_id: adminBusiness.id,
              user_id: user.id,
              role: 'owner'
            });
            
          if (associationError) {
            console.error('Error creating business_users association:', associationError);
          } else {
            console.log('Created business_users association');
          }
          
          setBusinessId(adminBusiness.id);
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
