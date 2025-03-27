
import { useState, useCallback, useRef, useEffect } from "react";
import { BusinessData } from "../types";
import { initialBusinessData } from "../initialValues";
import { revokeFilePreview } from "../utils";

export const useBusinessDataState = (saveTimeoutRef: React.MutableRefObject<number | null>, saveProgress: () => void) => {
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);

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
