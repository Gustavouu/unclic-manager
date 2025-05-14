
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export const useNeedsOnboarding = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingViewed, setOnboardingViewed] = useState<boolean>(
    localStorage.getItem('onboarding-viewed') === 'true'
  );
  const { businessId, currentBusiness } = useTenant();

  const markOnboardingAsViewed = useCallback(() => {
    localStorage.setItem('onboarding-viewed', 'true');
    setOnboardingViewed(true);
  }, []);

  const refreshOnboardingStatus = useCallback(async (skipCache = false) => {
    if (!businessId) {
      console.log('No business ID available, skipping onboarding check');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first unless skipCache is true
      const cacheKey = `business-${businessId}-onboarding`;
      const cacheTimestampKey = `${cacheKey}-timestamp`;
      
      if (!skipCache) {
        const cachedStatus = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        
        // Use cache if less than 5 minutes old
        if (cachedStatus && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;
          
          if (now - timestamp < fiveMinutes) {
            setNeedsOnboarding(cachedStatus === 'true');
            setLoading(false);
            return;
          }
        }
      }
      
      // If currentBusiness is already loaded, use it
      if (currentBusiness) {
        const needsSetup = currentBusiness.status === 'pendente' || currentBusiness.status === 'pending';
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
        
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      console.log('Fetching business status for onboarding check:', businessId);
      
      // Try new table structure first (businesses)
      const { data, error } = await supabase
        .from('businesses')
        .select('id, status')
        .eq('id', businessId)
        .maybeSingle();
      
      if (error && error.code !== '42P01') { // Ignore "relation does not exist" errors
        console.error('Error checking business status in businesses table:', error);
      }
      
      if (data) {
        // Use data from businesses table
        const needsSetup = data.status === 'pendente' || data.status === 'pending';
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
        
        setLoading(false);
        return;
      }
      
      // Try legacy table as fallback (negocios)
      try {
        const { data: legacyData, error: legacyError } = await supabase
          .from('negocios')
          .select('id, status')
          .eq('id', businessId)
          .maybeSingle();
        
        if (legacyError && legacyError.code !== '42P01') { // Ignore "relation does not exist" errors
          console.error('Error checking business status in negocios table:', legacyError);
          throw legacyError;
        }
        
        if (legacyData) {
          // Use data from negocios table
          const needsSetup = legacyData.status === 'pendente' || legacyData.status === 'pending';
          setNeedsOnboarding(needsSetup);
          
          // Update cache
          localStorage.setItem(cacheKey, String(needsSetup));
          localStorage.setItem(cacheTimestampKey, String(Date.now()));
          
          setLoading(false);
          return;
        }
      } catch (fallbackError) {
        console.error('Failed to check legacy business status:', fallbackError);
      }
      
      // If we get here, set a default (needs onboarding)
      console.warn('Could not determine onboarding status, defaulting to needs onboarding');
      setNeedsOnboarding(true);
      localStorage.setItem(cacheKey, 'true');
      localStorage.setItem(cacheTimestampKey, String(Date.now()));
    } catch (err: any) {
      console.error("Error checking onboarding status:", err);
      // Default to needing onboarding if there's an error
      setNeedsOnboarding(true);
      setError(err.message || 'Error checking onboarding status');
    } finally {
      setLoading(false);
    }
  }, [businessId, currentBusiness]);

  useEffect(() => {
    refreshOnboardingStatus();
  }, [refreshOnboardingStatus]);

  return { 
    needsOnboarding, 
    loading, 
    error, 
    onboardingViewed, 
    markOnboardingAsViewed,
    refreshOnboardingStatus 
  };
};
