
import { useState, useCallback } from "react";
import { BusinessHours } from "../types";
import { initialBusinessHours } from "../initialValues";

export const useBusinessHoursState = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(initialBusinessHours);

  // Update business hours
  const updateBusinessHours = useCallback((day: string, data: Partial<BusinessHours[string]>) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], ...data }
    }));
  }, []);

  return {
    businessHours,
    setBusinessHours,
    updateBusinessHours
  };
};
