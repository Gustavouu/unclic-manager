
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "./types";
import { useTenant } from "@/contexts/TenantContext";

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
      
      // Use the bookings table with proper joins
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clients!inner(name, email, phone),
          employees!inner(name, email, phone)
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: false });
          
      if (error) {
        console.error('Error fetching from bookings:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No appointment data found');
        setAppointments([]);
        setIsLoading(false);
        return;
      }
      
      // Map database response to our Appointment interface
      const mappedAppointments: Appointment[] = data.map((booking: any) => ({
        id: booking.id,
        clientId: booking.client_id,
        clientName: booking.clients?.name || 'Cliente',
        serviceId: booking.service_id,
        serviceName: 'Serviço', // Default since we don't have services table yet
        serviceType: 'service',
        professionalId: booking.employee_id,
        professionalName: booking.employees?.name || 'Profissional',
        date: new Date(`${booking.booking_date}T${booking.start_time}`),
        duration: booking.duration,
        price: booking.price,
        status: mapStatusFromDb(booking.status),
        notes: booking.notes || '',
        paymentMethod: booking.payment_method,
        businessId: booking.business_id,
      }));
      
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

function mapStatusFromDb(status: string): AppointmentStatus {
  const statusMap: Record<string, AppointmentStatus> = {
    'scheduled': 'agendado',
    'confirmed': 'confirmado',
    'completed': 'concluido',
    'canceled': 'cancelado',
    'no_show': 'faltou',
    // Handle Portuguese statuses directly
    'agendado': 'agendado',
    'confirmado': 'confirmado',
    'concluido': 'concluido',
    'cancelado': 'cancelado',
    'faltou': 'faltou',
  };
  return statusMap[status] || 'agendado';
}
