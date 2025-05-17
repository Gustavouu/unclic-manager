
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "./types";
import { useTenant } from "@/contexts/TenantContext";
import { safeDataExtract, normalizeAppointmentData } from "@/utils/databaseUtils";

export function useAppointmentsFetch() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchAppointments = useCallback(async () => {
    if (!businessId) {
      console.log('No business ID available, skipping appointments fetch');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching appointments for business ID:', businessId);
      let appointmentData;
      let fetchError;
      
      // Try fetching from bookings table first
      try {
        console.log('Trying bookings table');
        let { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            clients (*),
            services_v2 (*),
            employees (*)
          `)
          .eq('business_id', businessId)
          .order('booking_date', { ascending: false })
          .order('start_time', { ascending: false });
          
        if (error) {
          console.error('Error fetching from bookings:', error);
          fetchError = error;
        } else if (data && data.length > 0) {
          console.log('Successfully fetched data from bookings table:', data.length, 'records');
          appointmentData = data;
        } else {
          console.log('No data in bookings table');
        }
      } catch (err) {
        console.error('Exception when fetching from bookings:', err);
      }
      
      // If bookings didn't work, try original agendamentos table
      if (!appointmentData) {
        try {
          console.log('Trying legacy agendamentos table');
          const { data: legacyData, error: legacyError } = await supabase
            .from('agendamentos')
            .select(`
              *,
              clientes (*),
              servicos (*),
              funcionarios (*)
            `)
            .eq('id_negocio', businessId)
            .order('data', { ascending: false })
            .order('hora_inicio', { ascending: false });
            
          if (legacyError) {
            console.error('Error fetching from agendamentos:', legacyError);
            if (!fetchError) fetchError = legacyError;
          } else if (legacyData && legacyData.length > 0) {
            console.log('Successfully fetched data from agendamentos table:', legacyData.length, 'records');
            appointmentData = legacyData;
          } else {
            console.log('No data in agendamentos table');
          }
        } catch (err) {
          console.error('Exception when fetching from agendamentos:', err);
        }
      }
      
      // Try the capitalized table name as a last resort
      if (!appointmentData) {
        try {
          console.log('Trying Appointments table with capital A');
          const { data: capitalData, error: capitalError } = await supabase
            .from('Appointments')
            .select(`
              *,
              clientes (*),
              servicos (*),
              funcionarios (*)
            `)
            .eq('id_negocio', businessId)
            .order('data', { ascending: false })
            .order('hora_inicio', { ascending: false });
            
          if (capitalError) {
            console.error('Error fetching from Appointments:', capitalError);
            if (!fetchError) fetchError = capitalError;
          } else if (capitalData && capitalData.length > 0) {
            console.log('Successfully fetched data from Appointments table:', capitalData.length, 'records');
            appointmentData = capitalData;
          } else {
            console.log('No data in Appointments table');
          }
        } catch (err) {
          console.error('Exception when fetching from Appointments:', err);
        }
      }
      
      // If we still have no data and have errors, throw the first error
      if (!appointmentData && fetchError) {
        throw fetchError;
      }
      
      if (!appointmentData || appointmentData.length === 0) {
        console.log('No appointment data found in any table');
        setAppointments([]);
        setIsLoading(false);
        return;
      }
      
      // Map database response to our Appointment interface using the normalizer
      const mappedAppointments = appointmentData.map(normalizeAppointmentData);
      
      setAppointments(mappedAppointments);
      console.log('Successfully mapped', mappedAppointments.length, 'appointments');
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments,
  };
}
