import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export const useNeedsOnboarding = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { businessId, currentBusiness } = useTenant();

  const refreshOnboardingStatus = useCallback(async (skipCache = false) => {
    if (!businessId) {
      console.log('No business ID available, skipping onboarding check');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
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
        const needsSetup = currentBusiness.status === 'pendente';
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
        
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      console.log('Fetching business status for onboarding check:', businessId);
      const { data, error } = await supabase
        .from('negocios')
        .select('status')
        .eq('id', businessId)
        .maybeSingle();
      
      if (error) throw error;
      
      const needsSetup = data?.status === 'pendente';
      setNeedsOnboarding(needsSetup);
      
      // Update cache
      localStorage.setItem(cacheKey, String(needsSetup));
      localStorage.setItem(cacheTimestampKey, String(Date.now()));
      
    } catch (err) {
      console.error("Error checking onboarding status:", err);
      // Default to needing onboarding if there's an error
      setNeedsOnboarding(true);
    } finally {
      setLoading(false);
    }
  }, [businessId, currentBusiness]);

  useEffect(() => {
    refreshOnboardingStatus();
  }, [refreshOnboardingStatus]);

  return { needsOnboarding, loading, refreshOnboardingStatus };
};
