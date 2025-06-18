
import { useState } from 'react';
import { BusinessHours } from '../types';

const defaultHours: BusinessHours = {
  monday: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  tuesday: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  wednesday: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  thursday: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  friday: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  saturday: { start: '09:00', end: '13:00', isOpen: true, open: true, openTime: '09:00', closeTime: '13:00' },
  sunday: { start: '09:00', end: '13:00', isOpen: false, open: false, openTime: '09:00', closeTime: '13:00' },
};

export const useBusinessHoursState = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(defaultHours);

  const updateBusinessHours = (hours: BusinessHours) => {
    setBusinessHours(hours);
  };

  const updateHours = (day: string, updates: Partial<BusinessHours[string]>) => {
    if (!businessHours) return;
    
    setBusinessHours(prev => ({
      ...prev!,
      [day]: {
        ...prev![day],
        ...updates
      }
    }));
  };

  return {
    businessHours,
    updateBusinessHours,
    updateHours,
  };
};
