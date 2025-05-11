
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { checkOnboardingStatus } from '@/services/businessService';

export function useNeedsOnboarding() {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingViewed, setOnboardingViewed] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

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
      
      console.log(`Verificando status de onboarding para usuário ${user.id}${skipCache ? ' (ignorando cache)' : ''}`);
      const status = await checkOnboardingStatus(user.id, skipCache);
      
      console.log('Status de onboarding recebido:', status);
      setNeedsOnboarding(status.needsOnboarding);
      setLastRefreshTime(Date.now());
      
    } catch (err: any) {
      console.error('Erro ao verificar status de onboarding:', err);
      setError(err.message);
      
      // Try to get from cache if the API call fails
      const cachedStatus = localStorage.getItem(`onboarding-status-${user.id}`);
      
      if (cachedStatus) {
        console.log('Usando status de onboarding em cache');
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

  // Function to refresh onboarding status with rate limiting
  const refreshOnboardingStatus = useCallback(async () => {
    // Prevent refreshing more than once every 2 seconds
    const now = Date.now();
    if (now - lastRefreshTime < 2000) {
      console.log('Ignorando múltiplas chamadas de refresh em sequência rápida');
      return;
    }
    
    console.log('Atualizando status de onboarding');
    return checkStatus(true); // Skip cache
  }, [checkStatus, lastRefreshTime]);

  return { 
    needsOnboarding, 
    loading, 
    error,
    onboardingViewed,
    markOnboardingAsViewed,
    refreshOnboardingStatus,
    lastRefreshTime
  };
}
