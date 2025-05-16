
import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchWithCache } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Business {
  id: string;
  name: string;
  status: string;
  logo_url?: string;
  admin_email?: string;
  settings?: any;
}

export interface UseCurrentBusinessResult {
  businessId: string | null;
  businessData: Business | null;
  loading: boolean;
  error: string | null;
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;
  updateBusinessSettings: (settings: any) => Promise<void>;
  fetchBusinessData: () => Promise<void>;
  setCurrentBusiness: (id: string) => Promise<boolean>;
}

export function useCurrentBusiness(): UseCurrentBusinessResult {
  const [businessId, setBusinessId] = useState<string | null>(
    localStorage.getItem('currentBusinessId')
  );
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const setCurrentBusiness = async (id: string): Promise<boolean> => {
    try {
      // Call the Supabase function to set the current business in the session
      const { data, error } = await supabase.rpc('set_current_business', {
        business_id: id
      });

      if (error) throw error;

      // Update local state and storage
      setBusinessId(id);
      localStorage.setItem('currentBusinessId', id);
      
      return true;
    } catch (error: any) {
      console.error('Error setting current business:', error);
      return false;
    }
  };

  const fetchBusinessData = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      
      // Try to get from cache first
      const cacheKey = `business_data_${businessId}`;
      const business = await fetchWithCache(
        cacheKey,
        async () => {
          // Fetch business data
          const { data, error } = await supabase
            .from('businesses')
            .select('*, business_settings(*)')
            .eq('id', businessId)
            .single();
          
          if (error) throw error;
          
          return data;
        },
        5 * 60 * 1000 // cache for 5 minutes
      );
      
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
  }, [businessId]);

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
      setBusinessData(prev => prev ? {
        ...prev,
        settings: {
          ...prev.settings,
          ...settings
        }
      } : null);
      
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
      setBusinessData(prev => prev ? {
        ...prev,
        status
      } : null);
      
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
        
        if (!businessId) {
          // Get the user's current business from business_users table
          const { data: businessUser, error: businessUserError } = await supabase
            .from('business_users')
            .select('business_id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (businessUserError && businessUserError.code !== 'PGRST116') {
            throw businessUserError;
          }
          
          if (businessUser?.business_id) {
            setBusinessId(businessUser.business_id);
            localStorage.setItem('currentBusinessId', businessUser.business_id);
            // Set current business in the session
            await setCurrentBusiness(businessUser.business_id);
          }
        } else {
          // Set current business in the session if businessId exists
          await setCurrentBusiness(businessId);
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('Error getting current business:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    getCurrentBusiness();
  }, [user, businessId]);
  
  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId, fetchBusinessData]);
  
  return { 
    businessId, 
    businessData, 
    loading, 
    error,
    updateBusinessStatus,
    updateBusinessSettings,
    fetchBusinessData,
    setCurrentBusiness
  };
}
