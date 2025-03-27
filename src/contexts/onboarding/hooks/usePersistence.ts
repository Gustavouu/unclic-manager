
import { useCallback, useRef } from "react";
import { BusinessData, ServiceData, StaffData, BusinessHours } from "../types";
import { prepareDataForStorage } from "../utils/storageUtils";
import { base64ToFile } from "../utils/fileUtils";
import { initialBusinessHours } from "../initialValues";

export const usePersistence = (
  businessData: BusinessData,
  services: ServiceData[], 
  staffMembers: StaffData[],
  businessHours: BusinessHours,
  hasStaff: boolean,
  currentStep: number,
  hasLoaded: React.MutableRefObject<boolean>,
  setBusinessData: (data: BusinessData) => void,
  setServices: (services: ServiceData[]) => void,
  setStaffMembers: (staffMembers: StaffData[]) => void,
  setBusinessHours: (businessHours: BusinessHours) => void,
  setHasStaff: (hasStaff: boolean) => void,
  setCurrentStep: (step: number) => void
) => {
  const saveTimeoutRef = useRef<number | null>(null);

  // Save progress to localStorage
  const saveProgress = useCallback(async () => {
    // Skip saving if initial load hasn't completed yet
    if (!hasLoaded.current) return;
    
    try {
      console.log("Saving progress, business data:", businessData);
      const preparedBusinessData = await prepareDataForStorage(businessData);
      
      const data = {
        businessData: preparedBusinessData,
        services,
        staffMembers,
        businessHours,
        hasStaff,
        currentStep
      };
      
      localStorage.setItem('onboardingData', JSON.stringify(data));
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  }, [businessData, services, staffMembers, businessHours, hasStaff, currentStep, hasLoaded]);

  // Load progress from localStorage
  const loadProgress = useCallback(() => {
    // Skip loading if already loaded
    if (hasLoaded.current) {
      console.log("Already loaded, skipping");
      return;
    }
    
    try {
      console.log("Loading onboarding data");
      const savedData = localStorage.getItem('onboardingData');
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log("Found saved data:", parsed);
        
        // Load business data
        const loadedBusinessData = { ...parsed.businessData };
        
        // Handle restore of logo and banner from base64 data
        if (loadedBusinessData.logoData && loadedBusinessData.logoName) {
          // Restore File object from base64 string
          const logoFile = base64ToFile(loadedBusinessData.logoData, loadedBusinessData.logoName);
          if (logoFile) {
            loadedBusinessData.logo = logoFile;
            if (!loadedBusinessData.logoUrl) {
              loadedBusinessData.logoUrl = URL.createObjectURL(logoFile);
            }
          }
        }
        
        if (loadedBusinessData.bannerData && loadedBusinessData.bannerName) {
          // Restore File object from base64 string
          const bannerFile = base64ToFile(loadedBusinessData.bannerData, loadedBusinessData.bannerName);
          if (bannerFile) {
            loadedBusinessData.banner = bannerFile;
            if (!loadedBusinessData.bannerUrl) {
              loadedBusinessData.bannerUrl = URL.createObjectURL(bannerFile);
            }
          }
        }
        
        setBusinessData({ ...loadedBusinessData });
        setServices(parsed.services || []);
        setStaffMembers(parsed.staffMembers || []);
        setBusinessHours(parsed.businessHours || initialBusinessHours);
        setHasStaff(parsed.hasStaff || false);
        setCurrentStep(parsed.currentStep || 0);
      } else {
        console.log("No saved data found");
      }
      
      // Mark as loaded to prevent re-loading
      hasLoaded.current = true;
    } catch (error) {
      console.error("Error loading onboarding data:", error);
      hasLoaded.current = true; // Mark as loaded even if error occurs
    }
  }, [setBusinessData, setServices, setStaffMembers, setBusinessHours, setHasStaff, setCurrentStep, hasLoaded]);

  return {
    saveProgress,
    loadProgress,
    saveTimeoutRef
  };
};
