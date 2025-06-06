
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "./types";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

export function useAppointmentsFetch() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

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
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clients!inner(name, email, phone),
          services!inner(name, description, price, duration),
          professionals!inner(name, email, phone)
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: false });
      
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      const formattedAppointments: Appointment[] = (data || []).map((apt: any) => ({
        id: apt.id,
        clientId: apt.client_id,
        clientName: apt.clients?.name || 'Cliente não informado',
        serviceId: apt.service_id,
        serviceName: apt.services?.name || 'Serviço não informado',
        professionalId: apt.employee_id,
        professionalName: apt.professionals?.name || 'Profissional não informado',
        date: new Date(apt.booking_date),
        time: apt.start_time,
        endTime: apt.end_time,
        duration: apt.duration || 60,
        status: apt.status as AppointmentStatus,
        serviceType: 'general',
        price: Number(apt.price) || 0,
        paymentMethod: apt.payment_method || '',
        notes: apt.notes || '',
        rating: apt.rating,
        feedbackComment: apt.feedback_comment,
        reminderSent: apt.reminder_sent || false,
        createdAt: apt.created_at,
        updatedAt: apt.updated_at,
      }));
      
      setAppointments(formattedAppointments);
      console.log(`Successfully loaded ${formattedAppointments.length} appointments`);
    } catch (err) {
      console.error("Error in fetchAppointments:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar agendamentos';
      setError(errorMessage);
      toast.error(errorMessage);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments
  };
}
