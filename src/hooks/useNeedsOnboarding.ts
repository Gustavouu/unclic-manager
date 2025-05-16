
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from './useCurrentBusiness';

export function useNeedsOnboarding() {
  const { businessId, businessData, loading: businessLoading } = useCurrentBusiness();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!businessId) {
        setNeedsOnboarding(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First check the business status
        if (businessData && businessData.status === 'active') {
          setNeedsOnboarding(false);
          setLoading(false);
          return;
        }
        
        // Then check if all required onboarding steps are completed
        const { data, error: supabaseError } = await supabase
          .from('onboarding_progress')
          .select('step, completed')
          .eq('business_id', businessId);
          
        if (supabaseError) throw supabaseError;
        
        // If we don't have any onboarding records or not all steps are completed,
        // the user needs onboarding
        if (!data || data.length === 0) {
          setNeedsOnboarding(true);
        } else {
          // Check if all required steps are completed
          const requiredSteps = ['business_info', 'services', 'staff'];
          const completedSteps = data
            .filter(step => step.completed)
            .map(step => step.step);
            
          const allRequiredStepsCompleted = requiredSteps.every(
            step => completedSteps.includes(step)
          );
          
          setNeedsOnboarding(!allRequiredStepsCompleted);
        }
      } catch (err: any) {
        console.error("Error checking onboarding status:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!businessLoading) {
      checkOnboardingStatus();
    }
  }, [businessId, businessData, businessLoading]);

  return {
    needsOnboarding,
    loading,
    error,
    businessId
  };
}
