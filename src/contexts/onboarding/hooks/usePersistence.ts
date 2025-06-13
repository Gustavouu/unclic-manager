
import { useCallback } from 'react';
import { BusinessData, ServiceData, StaffData, BusinessHours, OnboardingMethod } from '../types';

export const usePersistence = (
  currentStep: number,
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  businessHours: BusinessHours | null,
  onboardingMethod: OnboardingMethod
) => {
  const saveProgress = useCallback(() => {
    try {
      const progressData = {
        currentStep,
        businessData,
        services,
        staffMembers,
        businessHours,
        onboardingMethod,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('unclic-manager-onboarding', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  }, [currentStep, businessData, services, staffMembers, businessHours, onboardingMethod]);

  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem('unclic-manager-onboarding');
      if (saved) {
        const progressData = JSON.parse(saved);
        return progressData;
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
    return null;
  }, []);

  return {
    saveProgress,
    loadProgress,
  };
};
