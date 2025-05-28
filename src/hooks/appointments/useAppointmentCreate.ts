
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateAppointmentData, Appointment } from "./types";
import { toast } from "sonner";

export const useAppointmentCreate = (
  setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
      console.log("Creating appointment with data:", appointmentData);
      
      // Convert the appointment data to match database schema
      const dbData = {
        id: crypto.randomUUID(),
        business_id: appointmentData.businessId || crypto.randomUUID(),
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

      // Use the bookings table which exists in the database
      const { data, error } = await supabase
        .from('bookings')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error(`Failed to create appointment: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from appointment creation");
      }

      // Transform the database result back to our Appointment type
      const appointment: Appointment = {
        id: data.id,
        clientId: data.client_id,
        clientName: appointmentData.clientName || 'Cliente',
        serviceId: data.service_id,
        serviceName: appointmentData.serviceName || 'Serviço',
        serviceType: appointmentData.serviceType || 'service',
        professionalId: data.employee_id,
        professionalName: appointmentData.professionalName || 'Profissional',
        date: new Date(`${data.booking_date}T${data.start_time}`),
        duration: data.duration,
        price: data.price,
        status: mapStatusFromDb(data.status),
        notes: data.notes || '',
        paymentMethod: data.payment_method,
        businessId: data.business_id,
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
