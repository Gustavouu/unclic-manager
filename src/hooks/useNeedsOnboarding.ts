
import { useState, useEffect, useCallback } from 'react';
import { checkOnboardingStatus, OnboardingStatus } from '@/services/businessService';
import { useAuth } from './useAuth';

const ONBOARDING_VIEWED_KEY = 'onboarding-viewed';

export const useNeedsOnboarding = () => {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingViewed, setOnboardingViewed] = useState<boolean>(
    localStorage.getItem(ONBOARDING_VIEWED_KEY) === 'true'
  );

  const refreshOnboardingStatus = useCallback(async (skipCache = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const status: OnboardingStatus = await checkOnboardingStatus(user.id, skipCache);
      setNeedsOnboarding(status.needsOnboarding);
      setBusinessId(status.businessId);
    } catch (err: any) {
      console.error('Error checking onboarding status:', err);
      setError(err.message || 'Failed to check onboarding status');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markOnboardingAsViewed = useCallback(() => {
    localStorage.setItem(ONBOARDING_VIEWED_KEY, 'true');
    setOnboardingViewed(true);
  }, []);

  const resetOnboardingViewed = useCallback(() => {
    localStorage.removeItem(ONBOARDING_VIEWED_KEY);
    setOnboardingViewed(false);
  }, []);

  useEffect(() => {
    refreshOnboardingStatus();
  }, [refreshOnboardingStatus]);

  return {
    needsOnboarding,
    businessId,
    loading,
    error,
    onboardingViewed,
    markOnboardingAsViewed,
    resetOnboardingViewed,
    refreshOnboardingStatus
  };
};
