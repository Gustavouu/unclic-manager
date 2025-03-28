
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment } from "@/components/appointments/types";
import { CreateAppointmentData } from "./types";
import { isValidUUID, DEFAULT_UUID } from "./utils";

export const useAppointmentCreate = (
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    try {
      // Check for valid UUIDs or use sensible defaults
      const serviceId = isValidUUID(appointmentData.serviceId) ? appointmentData.serviceId : DEFAULT_UUID;
      const clientId = isValidUUID(appointmentData.clientId) ? appointmentData.clientId : DEFAULT_UUID;
      const professionalId = isValidUUID(appointmentData.professionalId) ? appointmentData.professionalId : DEFAULT_UUID;
      const businessId = isValidUUID(appointmentData.businessId) ? appointmentData.businessId : DEFAULT_UUID;

      // Convert to database format
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          data: format(appointmentData.date, 'yyyy-MM-dd'),
          hora_inicio: format(appointmentData.date, 'HH:mm:ss'),
          hora_fim: format(new Date(appointmentData.date.getTime() + appointmentData.duration * 60000), 'HH:mm:ss'),
          duracao: appointmentData.duration,
          valor: appointmentData.price,
          status: appointmentData.status,
          forma_pagamento: appointmentData.paymentMethod || 'local',
          observacoes: appointmentData.notes,
          id_servico: serviceId,
          id_cliente: clientId,
          id_negocio: businessId,
          id_funcionario: professionalId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new appointment to state
      const newAppointment: Appointment = {
        id: data.id,
        clientName: appointmentData.clientName,
        serviceName: appointmentData.serviceName,
        date: appointmentData.date,
        status: appointmentData.status,
        price: appointmentData.price,
        serviceType: appointmentData.serviceType,
        duration: appointmentData.duration,
        notes: appointmentData.notes,
        paymentMethod: appointmentData.paymentMethod,
        serviceId: serviceId,
        clientId: clientId,
        professionalId: professionalId,
        businessId: businessId
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      toast.success("Agendamento criado com sucesso!");
      return data.id;
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error("Erro ao criar agendamento. Tente novamente.");
      throw err;
    }
  };

  return { createAppointment };
};
