
import { useState } from 'react';
import { BusinessHours } from '../types';
import { initialBusinessHours } from '../initialValues';

export const useBusinessHoursState = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(initialBusinessHours);

  const updateBusinessHours = (hours: BusinessHours) => {
    setBusinessHours(hours);
  };

  return {
    businessHours,
    updateBusinessHours,
    setBusinessHours,
  };
};
