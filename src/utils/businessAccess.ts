
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures user has proper business access configured
 */
export const ensureUserBusinessAccess = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      console.log('No authenticated user found');
      return false;
    }

    console.log('Ensuring business access for user:', user.user.id);
    
    // Try to call the RPC function to ensure business access
    const { data, error } = await supabase.rpc('ensure_user_business_access');
    
    if (error) {
      console.error('Error ensuring user business access:', error);
      return false;
    }

    console.log('User business access ensured successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception ensuring user business access:', error);
    return false;
  }
};

/**
 * Gets the user's business ID safely without RLS recursion
 */
export const getUserBusinessIdSafe = async (): Promise<string | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      console.log('No authenticated user found');
      return null;
    }

    // Direct query to avoid RLS recursion issues
    const { data, error } = await supabase
      .from('business_users')
      .select('business_id')
      .eq('user_id', user.user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error getting user business ID:', error);
      return null;
    }

    return data?.business_id || null;
  } catch (error) {
    console.error('Exception getting user business ID:', error);
    return null;
  }
};

/**
 * Gets the user's business ID using RPC function (safer approach)
 */
export const getUserBusinessId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_user_business_id_safe');
    
    if (error) {
      console.error('Error getting user business ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception getting user business ID:', error);
    return null;
  }
};
