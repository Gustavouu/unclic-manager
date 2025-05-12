
import { useState, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/integrations/supabase/client';

export function useNeedsOnboarding() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [onboardingViewed, setOnboardingViewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId, currentBusiness } = useTenant();

  // Check if business needs onboarding
  const checkOnboardingStatus = () => {
    try {
      if (currentBusiness) {
        // Check if the business has completed onboarding
        const completed = currentBusiness.status === 'active';
        setNeedsOnboarding(!completed);
        
        // Check if the onboarding banner has been viewed/dismissed
        const viewedFlag = localStorage.getItem(`onboarding_viewed_${businessId}`);
        setOnboardingViewed(!!viewedFlag);
      }
      
      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.error("Error checking onboarding status:", err);
      setError(err.message || "Failed to check onboarding status");
      setLoading(false);
    }
  };

  // Mark onboarding banner as viewed
  const markOnboardingAsViewed = () => {
    if (businessId) {
      localStorage.setItem(`onboarding_viewed_${businessId}`, 'true');
      setOnboardingViewed(true);
    }
  };

  // Refresh onboarding status
  const refreshOnboardingStatus = async (markAsViewed = false) => {
    setLoading(true);
    
    if (markAsViewed) {
      markOnboardingAsViewed();
    }
    
    // In a real app, you might want to fetch fresh data from the server
    setTimeout(() => {
      checkOnboardingStatus();
    }, 500);
  };

  useEffect(() => {
    if (businessId) {
      checkOnboardingStatus();
    }
  }, [businessId, currentBusiness]);

  return {
    needsOnboarding,
    onboardingViewed,
    loading,
    error,
    markOnboardingAsViewed,
    refreshOnboardingStatus,
  };
}
