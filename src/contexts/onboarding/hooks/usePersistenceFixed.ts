import { MutableRefObject } from 'react';
import { BusinessData, ServiceData, StaffData, BusinessHours, OnboardingMethod } from '../types';

// Key for storing onboarding data in localStorage
const STORAGE_KEY = 'unclic-manager-onboarding';

export const usePersistenceFixed = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  businessHours: BusinessHours,
  hasStaff: boolean,
  currentStep: number,
  onboardingMethod: OnboardingMethod,
  hasLoaded: MutableRefObject<boolean>,
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>,
  setServices: React.Dispatch<React.SetStateAction<ServiceData[]>>,
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffData[]>>,
  setBusinessHours: React.Dispatch<React.SetStateAction<BusinessHours>>,
  setHasStaff: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setOnboardingMethod: React.Dispatch<React.SetStateAction<OnboardingMethod>>
) => {
  // Function to save current progress to localStorage with error handling
  const saveProgress = () => {
    try {
      // Only save essential data to prevent quota issues
      const essentialData = {
        businessData: {
          name: businessData.name,
          email: businessData.email,
          phone: businessData.phone,
          cep: businessData.cep,
          zipCode: businessData.zipCode,
          address: businessData.address,
          number: businessData.number,
          addressNumber: businessData.addressNumber,
          neighborhood: businessData.neighborhood,
          city: businessData.city,
          state: businessData.state,
          description: businessData.description,
          // Only store URLs, not base64 data
          logoUrl: businessData.logoUrl,
          bannerUrl: businessData.bannerUrl
        },
        currentStep,
        onboardingMethod,
        hasStaff,
        lastUpdated: new Date().toISOString(),
      };
      
      // Clear previous data first to avoid quota issues
      localStorage.removeItem(STORAGE_KEY);
      
      // Stringify and check size before saving
      const dataString = JSON.stringify(essentialData);
      
      // Check if data is too large (localStorage limit is typically 5-10MB)
      if (dataString.length > 500 * 1024) { // 500KB limit for safety
        console.warn('Onboarding data still too large, saving only core data');
        // Keep only essential data
        const coreData = {
          businessData: {
            name: businessData.name,
            email: businessData.email,
            logoUrl: businessData.logoUrl,
            bannerUrl: businessData.bannerUrl
          },
          currentStep,
          onboardingMethod,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(coreData));
      } else {
        localStorage.setItem(STORAGE_KEY, dataString);
      }
      
      console.log('Onboarding progress saved successfully (no images in storage)');
      return true;
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      
      // If quota exceeded, clear localStorage and try with minimal data
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          const minimalData = {
            currentStep,
            onboardingMethod,
            businessName: businessData.name,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
          console.log('Saved minimal onboarding data after quota exceeded');
        } catch (secondError) {
          console.error('Failed to save even minimal data:', secondError);
        }
      }
      return false;
    }
  };

  // Function to load saved progress from localStorage
  const loadProgress = () => {
    try {
      // Avoid loading data multiple times
      if (hasLoaded.current) return;
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Update all state with fallbacks
        if (parsedData.businessData) {
          setBusinessData(prev => ({
            ...prev,
            ...parsedData.businessData
          }));
        }
        
        setServices(parsedData.services || []);
        setStaffMembers(parsedData.staffMembers || []);
        setBusinessHours(parsedData.businessHours || businessHours);
        setHasStaff(parsedData.hasStaff !== undefined ? parsedData.hasStaff : false);
        setCurrentStep(parsedData.currentStep || -1);
        setOnboardingMethod(parsedData.onboardingMethod || null);
        
        console.log('Onboarding progress loaded successfully');
        hasLoaded.current = true;
        return true;
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
    
    return false;
  };

  return {
    saveProgress,
    loadProgress,
  };
};
