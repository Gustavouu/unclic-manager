
import { MutableRefObject } from 'react';
import { BusinessData } from '../types';

export const useBusinessDataState = (
  saveTimeoutRef: MutableRefObject<number | null>,
  saveProgress: () => void,
  businessData: BusinessData,
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>
) => {
  // Function to update business data with auto-save functionality
  const updateBusinessData = (newData: Partial<BusinessData>) => {
    setBusinessData(prev => {
      // For nested objects like socialMedia, merge them properly
      const updatedData = {
        ...prev,
        ...newData,
        socialMedia: {
          ...prev.socialMedia,
          ...newData.socialMedia
        }
      };
      
      // Clear existing timeout if any
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set a new timeout for auto-save
      saveTimeoutRef.current = window.setTimeout(() => {
        saveProgress();
      }, 1000) as unknown as number;
      
      return updatedData;
    });
  };

  return { updateBusinessData };
};
