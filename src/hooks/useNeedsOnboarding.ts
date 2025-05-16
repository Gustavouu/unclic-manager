
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNeedsOnboarding = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingViewed, setOnboardingViewed] = useState<boolean>(
    localStorage.getItem('onboarding-viewed') === 'true'
  );
  const [businessId, setBusinessId] = useState<string | null>(
    localStorage.getItem('currentBusinessId')
  );

  const markOnboardingAsViewed = useCallback(() => {
    localStorage.setItem('onboarding-viewed', 'true');
    setOnboardingViewed(true);
  }, []);

  const refreshOnboardingStatus = useCallback(async (skipCache = false) => {
    // Get the current business ID from localStorage
    const currentBusinessId = localStorage.getItem('currentBusinessId');
    setBusinessId(currentBusinessId);
    
    if (!currentBusinessId) {
      console.log('No business ID available, assuming onboarding is needed');
      // If we don't have a business ID, we probably need onboarding
      setNeedsOnboarding(true);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first unless skipCache is true
      const cacheKey = `business-${currentBusinessId}-onboarding`;
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
      
      try {
        // Fetch business status
        const { data, error } = await supabase
          .from('businesses')
          .select('status')
          .eq('id', currentBusinessId)
          .maybeSingle();
        
        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Business exists, check its status
          const status = data.status;
          const needsSetup = status === 'pending';
          
          setNeedsOnboarding(needsSetup);
          
          // Check if any onboarding steps are completed
          if (needsSetup) {
            const { data: steps } = await supabase
              .from('onboarding_progress')
              .select('step, completed')
              .eq('business_id', currentBusinessId);
              
            // If all onboarding steps are completed, we don't need onboarding
            if (steps && steps.length > 0) {
              const allCompleted = steps.every(step => step.completed);
              if (allCompleted) {
                // Update business status to active
                await supabase
                  .from('businesses')
                  .update({ status: 'active' })
                  .eq('id', currentBusinessId);
                  
                setNeedsOnboarding(false);
              }
            }
          }
          
          // Update cache
          localStorage.setItem(cacheKey, String(needsSetup));
          localStorage.setItem(cacheTimestampKey, String(Date.now()));
        } else {
          // Business doesn't exist, needs onboarding
          console.log('Business not found, needs onboarding');
          setNeedsOnboarding(true);
          localStorage.setItem(cacheKey, 'true');
          localStorage.setItem(cacheTimestampKey, String(Date.now()));
        }
      } catch (err: any) {
        console.error("Error checking business status:", err);
        // Default to needing onboarding on errors
        setNeedsOnboarding(true);
        setError(err.message || 'Error checking onboarding status');
      }
    } catch (err: any) {
      console.error("Error checking onboarding status:", err);
      // Default to needing onboarding if there's an error
      setNeedsOnboarding(true);
      setError(err.message || 'Error checking onboarding status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated before proceeding
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        refreshOnboardingStatus();
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [refreshOnboardingStatus]);

  return { 
    needsOnboarding, 
    loading, 
    error, 
    onboardingViewed, 
    markOnboardingAsViewed,
    refreshOnboardingStatus,
    businessId
  };
};
