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
      // Se não temos ID de negócio, provavelmente precisa de onboarding
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
        const needsSetup = statusValue === 'pendente' || statusValue === 'pending';
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
        
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      console.log('Fetching business status for onboarding check:', businessId);
      
      // Strategy 1: Try businesses table first
      let businessStatus = null;
      
      try {
        console.log('Checking businesses table...');
        const { data, error } = await supabase
          .from('businesses')
          .select('id, status')
          .eq('id', businessId)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking business status in businesses table:', error);
        } else if (data) {
          console.log('Found in businesses table:', data);
          businessStatus = {
            exists: true,
            status: data.status
          };
        }
      } catch (err) {
        console.error('Failed to check businesses table:', err);
      }
      
      // Strategy 2: Try negocios table if not found
      if (!businessStatus) {
        try {
          console.log('Checking negocios table...');
          const { data, error } = await supabase
            .from('negocios')
            .select('id, status')
            .eq('id', businessId)
            .maybeSingle();
          
          if (error) {
            console.error('Error checking business status in negocios table:', error);
          } else if (data) {
            console.log('Found in negocios table:', data);
            businessStatus = {
              exists: true,
              status: data.status
            };
          }
        } catch (err) {
          console.error('Failed to check negocios table:', err);
        }
      }
      
      // Strategy 3: RPC with set_business_status to verify
      if (!businessStatus) {
        try {
          console.log('Trying RPC function check...');
          const { data, error } = await supabase.rpc('get_business_status', {
            business_id: businessId
          });
          
          if (error) {
            console.error('Error using RPC to check status:', error);
          } else if (data) {
            console.log('Found via RPC:', data);
            businessStatus = {
              exists: true,
              status: data
            };
          }
        } catch (err) {
          console.error('Failed to use RPC check:', err);
        }
      }
      
      // Make a final decision based on all strategies
      if (businessStatus && businessStatus.exists) {
        console.log('Final business status determination:', businessStatus);
        const status = businessStatus.status;
        
        // Check if business needs onboarding
        const needsSetup = status === 'pendente' || status === 'pending';
        setNeedsOnboarding(needsSetup);
        
        // Update cache
        localStorage.setItem(cacheKey, String(needsSetup));
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
      } else {
        console.warn('Could not determine business status, assuming needs onboarding');
        setNeedsOnboarding(true);
        localStorage.setItem(cacheKey, 'true');
        localStorage.setItem(cacheTimestampKey, String(Date.now()));
      }
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
