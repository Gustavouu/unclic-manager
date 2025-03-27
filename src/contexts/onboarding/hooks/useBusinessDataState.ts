
import { useState, useCallback, useEffect } from "react";
import { BusinessData } from "../types";
import { initialBusinessData } from "../initialValues";
import { revokeFilePreview } from "../utils/fileUtils";

export const useBusinessDataState = (saveTimeoutRef: React.MutableRefObject<number | null>, saveProgress: () => void) => {
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);

  // Clean up blob URLs when component unmounts or when URLs change
  useEffect(() => {
    const currentLogoUrl = businessData.logoUrl;
    const currentBannerUrl = businessData.bannerUrl;

    return () => {
      // Only clean up URLs created by this component, not ones loaded from storage
      if (currentLogoUrl?.startsWith('blob:')) {
        revokeFilePreview(currentLogoUrl);
      }
      if (currentBannerUrl?.startsWith('blob:')) {
        revokeFilePreview(currentBannerUrl);
      }
    };
  }, [businessData.logoUrl, businessData.bannerUrl]);

  // Update business data with proper deep comparison to prevent unnecessary updates
  const updateBusinessData = useCallback((data: Partial<BusinessData>) => {
    setBusinessData(prev => {
      // Check if any of the data is different before updating
      const hasChanges = Object.keys(data).some(key => {
        const k = key as keyof BusinessData;
        return prev[k] !== data[k];
      });
      
      // Only update if something has changed
      if (!hasChanges) {
        return prev;
      }
      
      // Create new data object with updates
      const newData = { ...prev, ...data };
      
      // Schedule a save with debounce
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        saveProgress();
        saveTimeoutRef.current = null;
      }, 500);
      
      return newData;
    });
  }, [saveTimeoutRef, saveProgress]);

  return {
    businessData,
    setBusinessData,
    updateBusinessData
  };
};
