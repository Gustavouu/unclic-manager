
import { useState } from 'react';
import { BusinessHours } from '../types';

// Initialize default business hours
const initializeDefaultHours = (): BusinessHours => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Create an object with 7 days, where each workday (Mon-Sat) is open from 9 to 18
  return days.reduce((acc: BusinessHours, day, index) => {
    const isSunday = index === 0;
    
    acc[day] = {
      open: !isSunday,
      openTime: isSunday ? '' : '09:00',
      closeTime: isSunday ? '' : '18:00',
    };
    
    return acc;
  }, {} as BusinessHours);
};

export const useBusinessHoursState = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(initializeDefaultHours());

  // Function to update business hours for a specific day
  const updateBusinessHours = (day: string, data: Partial<BusinessHours[string]>) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...data
      }
    }));
  };

  return {
    businessHours,
    setBusinessHours,
    updateBusinessHours,
  };
};
