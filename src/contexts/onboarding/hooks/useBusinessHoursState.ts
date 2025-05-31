
import { useState } from 'react';
import { BusinessHours } from '../types';

const defaultHours: BusinessHours = {
  segunda: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  terca: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  quarta: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  quinta: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  sexta: { start: '09:00', end: '18:00', isOpen: true, open: true, openTime: '09:00', closeTime: '18:00' },
  sabado: { start: '09:00', end: '13:00', isOpen: true, open: true, openTime: '09:00', closeTime: '13:00' },
  domingo: { start: '09:00', end: '13:00', isOpen: false, open: false, openTime: '09:00', closeTime: '13:00' },
};

export const useBusinessHoursState = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(defaultHours);

  const updateBusinessHours = (hours: BusinessHours) => {
    setBusinessHours(hours);
  };

  // Legacy support - same function with different name
  const updateHours = (hours: BusinessHours) => {
    setBusinessHours(hours);
  };

  return {
    businessHours,
    updateBusinessHours,
    updateHours, // Legacy support
  };
};
