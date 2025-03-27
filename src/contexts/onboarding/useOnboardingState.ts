
import { useState, useCallback, useRef, useEffect } from "react";
import { 
  BusinessData, 
  ServiceData, 
  StaffData, 
  BusinessHours 
} from "./types";
import { initialBusinessData, initialBusinessHours } from "./initialValues";
import { 
  checkOnboardingComplete, 
  prepareDataForStorage, 
  revokeFilePreview, 
  base64ToFile 
} from "./utils";

export const useOnboardingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(initialBusinessHours);
  const [hasStaff, setHasStaff] = useState<boolean>(false);
  const hasLoaded = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (businessData.logoUrl && businessData.logoUrl.startsWith('blob:')) {
        revokeFilePreview(businessData.logoUrl);
      }
      if (businessData.bannerUrl && businessData.bannerUrl.startsWith('blob:')) {
        revokeFilePreview(businessData.bannerUrl);
      }
    };
  }, []);

  // Update business data
  const updateBusinessData = useCallback((data: Partial<BusinessData>) => {
    console.log("Updating business data:", data);
    setBusinessData(prev => {
      const newData = { ...prev, ...data };
      
      // Schedule a save with debounce to avoid excessive saves
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        saveProgress();
        saveTimeoutRef.current = null;
      }, 500);
      
      return newData;
    });
  }, []);

  // Service management functions
  const addService = useCallback((service: ServiceData) => {
    setServices(prev => [...prev, service]);
  }, []);

  const removeService = useCallback((id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  }, []);

  const updateService = useCallback((id: string, data: Partial<ServiceData>) => {
    setServices(prev => 
      prev.map(service => service.id === id ? { ...service, ...data } : service)
    );
  }, []);

  // Staff management functions
  const addStaffMember = useCallback((staff: StaffData) => {
    setStaffMembers(prev => [...prev, staff]);
  }, []);

  const removeStaffMember = useCallback((id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  }, []);

  const updateStaffMember = useCallback((id: string, data: Partial<StaffData>) => {
    setStaffMembers(prev => 
      prev.map(staff => staff.id === id ? { ...staff, ...data } : staff)
    );
  }, []);

  // Update business hours
  const updateBusinessHours = useCallback((day: string, data: Partial<BusinessHours[string]>) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], ...data }
    }));
  }, []);

  // Check if all required information is complete
  const isComplete = useCallback(() => {
    return checkOnboardingComplete(businessData, services, staffMembers, hasStaff);
  }, [businessData, services, staffMembers, hasStaff]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    // Skip saving if initial load hasn't completed yet
    if (!hasLoaded.current) return;
    
    try {
      console.log("Saving progress, business data:", businessData);
      const preparedBusinessData = prepareDataForStorage(businessData);
      
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
  }, [businessData, services, staffMembers, businessHours, hasStaff, currentStep]);

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
        
        setBusinessData(prev => ({ ...prev, ...loadedBusinessData }));
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
  }, []);

  return {
    currentStep,
    setCurrentStep,
    businessData,
    updateBusinessData,
    services,
    addService,
    removeService,
    updateService,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    updateStaffMember,
    businessHours,
    updateBusinessHours,
    hasStaff,
    setHasStaff,
    isComplete,
    saveProgress,
    loadProgress
  };
};
