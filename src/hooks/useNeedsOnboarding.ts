
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

  // Check if the user has viewed onboarding from localStorage only once when component mounts
  useEffect(() => {
    const hasViewedOnboarding = localStorage.getItem('onboarding_viewed') === 'true';
    setOnboardingViewed(hasViewedOnboarding);
  }, []);

  // Function to check onboarding status
  const checkOnboardingStatus = useCallback(async (skipCache = false) => {
    if (!user) {
      setNeedsOnboarding(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use local cache first to reduce API calls
      const cachedStatus = localStorage.getItem(`onboarding-status-${user.id}`);
      const cachedTimestamp = localStorage.getItem(`onboarding-status-timestamp-${user.id}`);
      
      // Use cache if it exists and is less than 5 minutes old, unless skipCache is true
      if (!skipCache && cachedStatus && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (now - timestamp < fiveMinutes) {
          setNeedsOnboarding(cachedStatus === 'true');
          setLoading(false);
          console.log("Using cached onboarding status:", cachedStatus);
          return;
        }
      }
      
      // Fetch user data with a simple query
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id_negocio')
        .eq('id', user.id)
        .maybeSingle();
            
      if (userError) {
        // Don't throw on not found - just means no business
        if (userError.code !== 'PGRST116') {
          throw userError;
        }
      }
      
      // If no business is associated, they need onboarding
      if (!userData || !userData.id_negocio) {
        console.log("User needs onboarding - no business associated");
        setNeedsOnboarding(true);
        
        // Cache the result
        localStorage.setItem(`onboarding-status-${user.id}`, 'true');
        localStorage.setItem(`onboarding-status-timestamp-${user.id}`, Date.now().toString());
        
        setLoading(false);
        return;
      }
      
      // Check business status directly without using fetchWithCache
      const { data: businessData, error: businessError } = await supabase
        .from('negocios')
        .select('id, status')
        .eq('id', userData.id_negocio)
        .maybeSingle();
      
      if (businessError) {
        throw businessError;
      }
      
      // If business exists but status is 'pendente', they still need onboarding
      const needsOnboarding = !businessData || businessData.status === 'pendente';
      console.log(`User ${needsOnboarding ? 'needs' : 'does not need'} onboarding - business status: ${businessData?.status}`);
      
      setNeedsOnboarding(needsOnboarding);
      
      // Cache the result
      localStorage.setItem(`onboarding-status-${user.id}`, needsOnboarding.toString());
      localStorage.setItem(`onboarding-status-timestamp-${user.id}`, Date.now().toString());
      
    } catch (err: any) {
      console.error('Error checking onboarding status:', err);
      setError(err.message);
      // Don't default to needing onboarding on error - continue with cached value or null
      if (cachedStatus) {
        setNeedsOnboarding(cachedStatus === 'true');
      } else {
        setNeedsOnboarding(false); // Default to not needing onboarding on error
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Only check onboarding status once when user changes
  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user, checkOnboardingStatus]);

  // Function to mark onboarding as viewed
  const markOnboardingAsViewed = useCallback(() => {
    localStorage.setItem('onboarding_viewed', 'true');
    setOnboardingViewed(true);
  }, []);

  // Function to refresh onboarding status
  const refreshOnboardingStatus = useCallback(async () => {
    return checkOnboardingStatus(true); // Skip cache
  }, [checkOnboardingStatus]);

  return { 
    needsOnboarding, 
    loading, 
    error,
    onboardingViewed,
    markOnboardingAsViewed,
    refreshOnboardingStatus
  };
}
