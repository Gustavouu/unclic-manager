
import { MutableRefObject } from 'react';
import { BusinessData, ServiceData, StaffData, BusinessHours } from '../types';

// Key for storing onboarding data in localStorage
const STORAGE_KEY = 'unclic-manager-onboarding';

export const usePersistence = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  businessHours: BusinessHours,
  hasStaff: boolean,
  currentStep: number,
  hasLoaded: MutableRefObject<boolean>,
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>,
  setServices: React.Dispatch<React.SetStateAction<ServiceData[]>>,
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffData[]>>,
  setBusinessHours: React.Dispatch<React.SetStateAction<BusinessHours>>,
  setHasStaff: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
) => {
  // Function to save current progress to localStorage
  const saveProgress = () => {
    const data = {
      businessData,
      services,
      staffMembers,
      businessHours,
      hasStaff,
      currentStep,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Onboarding progress saved:', data);
    return true;
  };

  // Function to load saved progress from localStorage
  const loadProgress = () => {
    try {
      // Avoid loading data multiple times
      if (hasLoaded.current) return;
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Update all state
        setBusinessData(parsedData.businessData || businessData);
        setServices(parsedData.services || []);
        setStaffMembers(parsedData.staffMembers || []);
        setBusinessHours(parsedData.businessHours || businessHours);
        setHasStaff(parsedData.hasStaff !== undefined ? parsedData.hasStaff : false);
        setCurrentStep(parsedData.currentStep || 0);
        
        console.log('Onboarding progress loaded:', parsedData);
        hasLoaded.current = true;
        return true;
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
    
    return false;
  };

  return {
    saveProgress,
    loadProgress,
  };
};
