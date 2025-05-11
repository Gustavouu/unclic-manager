
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { checkOnboardingStatus } from '@/services/businessService';

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

  // Function to check onboarding status using the centralized service
  const checkStatus = useCallback(async (skipCache = false) => {
    if (!user) {
      setNeedsOnboarding(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const status = await checkOnboardingStatus(user.id, skipCache);
      setNeedsOnboarding(status.needsOnboarding);
      
    } catch (err: any) {
      console.error('Error checking onboarding status:', err);
      setError(err.message);
      
      // Try to get from cache if the API call fails
      const cachedStatus = localStorage.getItem(`onboarding-status-${user.id}`);
      
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
      checkStatus();
    } else {
      setNeedsOnboarding(null);
      setLoading(false);
    }
  }, [user, checkStatus]);

  // Function to mark onboarding as viewed
  const markOnboardingAsViewed = useCallback(() => {
    localStorage.setItem('onboarding_viewed', 'true');
    setOnboardingViewed(true);
  }, []);

  // Function to refresh onboarding status
  const refreshOnboardingStatus = useCallback(async () => {
    return checkStatus(true); // Skip cache
  }, [checkStatus]);

  return { 
    needsOnboarding, 
    loading, 
    error,
    onboardingViewed,
    markOnboardingAsViewed,
    refreshOnboardingStatus
  };
}
