
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { fetchWithCache } from '@/integrations/supabase/client';

export function useNeedsOnboarding() {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingViewed, setOnboardingViewed] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has viewed the onboarding
    const hasViewedOnboarding = localStorage.getItem('onboarding_viewed') === 'true';
    setOnboardingViewed(hasViewedOnboarding);
  }, []);

  const checkOnboardingStatus = useCallback(async (skipCache = false) => {
    if (!user) {
      setNeedsOnboarding(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the fetchWithCache utility to reduce API calls, with skipCache option
      const fetchFn = async () => {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id_negocio')
          .eq('id', user.id)
          .single();
            
        if (error && error.code !== 'PGRST116') { // Not found error
          throw error;
        }
          
        return data;
      };
      
      const userData = skipCache 
        ? await fetchFn()
        : await fetchWithCache(
            `user-business-${user.id}`,
            fetchFn,
            1 // 1 minute cache
          );
      
      // Clear cache to ensure fresh data
      if (skipCache) {
        try {
          localStorage.removeItem(`user-business-${user.id}`);
        } catch (e) {
          console.warn("Failed to clear user business cache", e);
        }
      }
      
      // If no business is associated or the user doesn't exist yet, they need onboarding
      if (!userData || !userData.id_negocio) {
        console.log("User needs onboarding - no business associated");
        setNeedsOnboarding(true);
        setLoading(false);
        return;
      }
      
      // Check if the business has completed setup
      const businessFetchFn = async () => {
        const { data, error } = await supabase
          .from('negocios')
          .select('id, status')
          .eq('id', userData.id_negocio)
          .single();
            
        if (error) {
          throw error;
        }
          
        return data;
      };
      
      const businessData = skipCache
        ? await businessFetchFn()
        : await fetchWithCache(
            `business-${userData.id_negocio}`,
            businessFetchFn,
            1 // 1 minute cache
          );
      
      // Clear business cache if skipping cache
      if (skipCache) {
        try {
          localStorage.removeItem(`business-${userData.id_negocio}`);
        } catch (e) {
          console.warn("Failed to clear business cache", e);
        }
      }
      
      // If business exists but status is 'pendente', they still need onboarding
      const needsOnboarding = !businessData || businessData.status === 'pendente';
      console.log(`User ${needsOnboarding ? 'needs' : 'does not need'} onboarding - business status: ${businessData?.status}`);
      setNeedsOnboarding(needsOnboarding);
      
    } catch (err: any) {
      console.error('Error checking onboarding status:', err);
      setError(err.message);
      // Important change: Don't default to needing onboarding on error
      // Instead, allow access to the app even if we can't determine onboarding status
      setNeedsOnboarding(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  // Function to mark onboarding as viewed
  const markOnboardingAsViewed = () => {
    localStorage.setItem('onboarding_viewed', 'true');
    setOnboardingViewed(true);
  };

  // Function to refresh onboarding status (skipping cache)
  const refreshOnboardingStatus = async () => {
    return checkOnboardingStatus(true); // Skip cache
  };

  return { 
    needsOnboarding, 
    loading, 
    error,
    onboardingViewed,
    markOnboardingAsViewed,
    refreshOnboardingStatus
  };
}
