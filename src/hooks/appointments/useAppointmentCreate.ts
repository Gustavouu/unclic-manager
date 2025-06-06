
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateAppointmentData, Appointment } from "./types";
import { toast } from "sonner";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

export const useAppointmentCreate = (
  setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const queryClient = useQueryClient();
  const { businessId } = useCurrentBusiness();

  const createAppointment = useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
      console.log("Creating appointment with data:", appointmentData);
      
      if (!businessId) {
        throw new Error("Business ID is required");
      }
      
      // Convert the appointment data to match database schema
      const dbData = {
        id: crypto.randomUUID(),
        business_id: businessId,
        client_id: appointmentData.clientId,
        service_id: appointmentData.serviceId,
        employee_id: appointmentData.professionalId,
        booking_date: appointmentData.date.toISOString().split('T')[0],
        start_time: appointmentData.time,
        end_time: appointmentData.endTime || calculateEndTime(appointmentData.time, appointmentData.duration || 60),
        duration: appointmentData.duration || 60,
        price: appointmentData.price || 0,
        status: mapStatusToDb(appointmentData.status || 'agendado'),
        payment_method: appointmentData.paymentMethod || 'cash',
        notes: appointmentData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // First create the booking
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error(`Failed to create appointment: ${error.message}`);
      }

      if (!bookingData) {
        throw new Error("No data returned from appointment creation");
      }

      // Now fetch related data separately
      let clientName = appointmentData.clientName || 'Cliente';
      let serviceName = appointmentData.serviceName || 'Serviço';
      let professionalName = appointmentData.professionalName || 'Profissional';

      // Fetch client name
      if (bookingData.client_id) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('name')
          .eq('id', bookingData.client_id)
          .single();
        if (clientData) clientName = clientData.name;
      }

      // Fetch service name
      if (bookingData.service_id) {
        const { data: serviceData } = await supabase
          .from('services')
          .select('name')
          .eq('id', bookingData.service_id)
          .single();
        if (serviceData) serviceName = serviceData.name;
      }

      // Fetch professional name
      if (bookingData.employee_id) {
        const { data: professionalData } = await supabase
          .from('professionals')
          .select('name')
          .eq('id', bookingData.employee_id)
          .single();
        if (professionalData) professionalName = professionalData.name;
      }

      // Transform the database result back to our Appointment type
      const appointment: Appointment = {
        id: bookingData.id,
        clientId: bookingData.client_id,
        clientName,
        serviceId: bookingData.service_id,
        serviceName,
        serviceType: appointmentData.serviceType || 'service',
        professionalId: bookingData.employee_id,
        professionalName,
        date: new Date(`${bookingData.booking_date}T${bookingData.start_time}`),
        duration: bookingData.duration,
        price: bookingData.price,
        status: mapStatusFromDb(bookingData.status),
        notes: bookingData.notes || '',
        paymentMethod: bookingData.payment_method,
        businessId: bookingData.business_id,
      };

      // Update local state if provided
      if (setAppointments) {
        setAppointments(prev => [appointment, ...prev]);
      }

      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error) => {
      console.error("Appointment creation error:", error);
      toast.error("Erro ao criar agendamento");
    },
  });

  return {
    createAppointment: createAppointment.mutateAsync,
    updateAppointment: createAppointment.mutateAsync, // For compatibility
    cancelAppointment: createAppointment.mutateAsync, // For compatibility
    isCreating: createAppointment.isPending,
    isLoading: createAppointment.isPending, // For compatibility
    error: createAppointment.error,
  };
};

// Helper functions
function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + duration * 60000);
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
}

function mapStatusToDb(status: string): string {
  const statusMap: Record<string, string> = {
    'agendado': 'scheduled',
    'confirmado': 'confirmed',
    'concluido': 'completed',
    'cancelado': 'canceled',
    'scheduled': 'scheduled',
    'confirmed': 'confirmed',
    'completed': 'completed',
    'canceled': 'canceled',
  };
  return statusMap[status] || 'scheduled';
}

function mapStatusFromDb(status: string): any {
  const statusMap: Record<string, string> = {
    'scheduled': 'agendado',
    'confirmed': 'confirmado',
    'completed': 'concluido',
    'canceled': 'cancelado',
    'no_show': 'faltou',
  };
  return statusMap[status] || 'agendado';
}
