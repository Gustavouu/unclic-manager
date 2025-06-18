
import { useState } from 'react';
import { BusinessData } from '../types';

export const useBusinessDataState = (initialData: BusinessData) => {
  const [businessData, setBusinessData] = useState<BusinessData>({
    ...initialData,
    socialMedia: initialData.socialMedia || {
      facebook: '',
      instagram: '',
      website: ''
    }
  });

  const updateBusinessData = (data: Partial<BusinessData>) => {
    setBusinessData(prev => ({
      ...prev,
      ...data,
      socialMedia: {
        ...prev.socialMedia,
        ...data.socialMedia
      }
    }));
  };

  return {
    businessData,
    updateBusinessData,
  };
};
