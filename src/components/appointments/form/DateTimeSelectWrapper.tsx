
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { DateTimeSelect } from "./DateTimeSelect";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { safeJsonParse } from "@/utils/databaseUtils";

interface DateTimeSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
  professionalId?: string;
}

const DateTimeSelectWrapper = ({ 
  form, 
  serviceId, 
  professionalId 
}: DateTimeSelectWrapperProps) => {
  const [businessHours, setBusinessHours] = useState<Record<string, { enabled: boolean; start: string; end: string; }>>(
    {
      domingo: { enabled: false, start: "09:00", end: "17:00" },
      segunda: { enabled: true, start: "09:00", end: "17:00" },
      terca: { enabled: true, start: "09:00", end: "17:00" },
      quarta: { enabled: true, start: "09:00", end: "17:00" },
      quinta: { enabled: true, start: "09:00", end: "17:00" },
      sexta: { enabled: true, start: "09:00", end: "17:00" },
      sabado: { enabled: true, start: "09:00", end: "15:00" },
    }
  );
  const [settings, setSettings] = useState<{
    minimum_notice_time: number;
    maximum_days_in_advance: number;
  }>({
    minimum_notice_time: 30,
    maximum_days_in_advance: 30
  });

  useEffect(() => {
    const fetchBusinessSettings = async () => {
      try {
        // Try to get business settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('business_settings')
          .select('*')
          .single();
        
        if (!settingsError && settingsData) {
          // Set business hours from settings if available
          if (settingsData.notes) {
            const notesObj = typeof settingsData.notes === 'string' 
              ? safeJsonParse(settingsData.notes, {}) 
              : settingsData.notes;
            
            if (notesObj && typeof notesObj === 'object' && notesObj.business_hours) {
              setBusinessHours(notesObj.business_hours);
            }
          }
          
          // Set timing settings
          setSettings({
            minimum_notice_time: settingsData.minimum_notice_time || 30,
            maximum_days_in_advance: settingsData.maximum_days_in_advance || 30
          });
        }
      } catch (error) {
        console.error("Error fetching business settings:", error);
      }
    };

    fetchBusinessSettings();
  }, []);

  // Handle time change
  const handleTimeChange = () => {
    // Additional logic when time changes can be added here
  };

  return (
    <DateTimeSelect 
      form={form}
      onTimeChange={handleTimeChange}
      minAdvanceTime={settings.minimum_notice_time}
      maxFutureDays={settings.maximum_days_in_advance}
      businessHours={businessHours}
    />
  );
};

export default DateTimeSelectWrapper;
