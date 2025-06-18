
import { useCallback } from 'react';
import { BusinessData, ServiceData, StaffData, BusinessHours, OnboardingMethod } from '../types';

export const usePersistence = (
  currentStep: number,
  businessData: BusinessData,
  services: ServiceData[],
  staff: StaffData[],
  businessHours: BusinessHours | null,
  onboardingMethod: OnboardingMethod
) => {
  const saveProgress = useCallback(() => {
    try {
      const progress = {
        currentStep,
        businessData,
        services,
        staff,
        businessHours,
        onboardingMethod,
        timestamp: Date.now(),
      };

      localStorage.setItem('onboarding-progress', JSON.stringify(progress));
      console.log('Progress saved successfully');
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [currentStep, businessData, services, staff, businessHours, onboardingMethod]);

  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem('onboarding-progress');
      if (saved) {
        const progress = JSON.parse(saved);
        console.log('Progress loaded:', progress);
        return progress;
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return null;
  }, []);

  return {
    saveProgress,
    loadProgress,
  };
};
