
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
      console.log('No business ID available, assuming onboarding is needed');
      setNeedsOnboarding(true);
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
        console.log('Using business data from context:', currentBusiness);
        const statusValue = currentBusiness.status;
        const needsSetup = statusValue === 'pending' || statusValue === 'pendente';
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
        
        setLoading(false);
        return;
      }
      
      // Use the migrated businesses table directly
      console.log('Checking business status for:', businessId);
      
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, status')
        .eq('id', businessId)
        .maybeSingle();
      
      if (businessError) {
        console.error('Error checking business status:', businessError);
        setNeedsOnboarding(true);
        setError(businessError.message);
      } else if (businessData) {
        const needsSetup = businessData.status === 'pending';
        console.log(`Business found with status: ${businessData.status}, needs onboarding: ${needsSetup}`);
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
      } else {
        console.log('Business not found, needs onboarding');
        setNeedsOnboarding(true);
        localStorage.setItem(cacheKey, 'true');
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
      }
    } catch (err: any) {
      console.error("Error checking onboarding status:", err);
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
