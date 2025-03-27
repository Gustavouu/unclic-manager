
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
  }, [saveTimeoutRef, saveProgress]);

  return {
    businessData,
    setBusinessData,
    updateBusinessData
  };
};
