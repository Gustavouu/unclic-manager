
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment } from "@/components/appointments/types";
import { CreateAppointmentData } from "./types";
import { isValidUUID } from "./utils";

// Modify the function to avoid using a DEFAULT_UUID for the business ID
export const useAppointmentCreate = (
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    try {
      console.log("Creating appointment with data:", appointmentData);
      
      // Check for valid UUIDs
      const serviceId = isValidUUID(appointmentData.serviceId) ? appointmentData.serviceId : null;
      const clientId = isValidUUID(appointmentData.clientId) ? appointmentData.clientId : null;
      const professionalId = isValidUUID(appointmentData.professionalId) ? appointmentData.professionalId : null;
      
      // Format dates properly for PostgreSQL
      const appointmentDate = format(appointmentData.date, 'yyyy-MM-dd');
      const startTime = format(appointmentData.date, 'HH:mm:ss');
      const endDate = new Date(appointmentData.date.getTime() + appointmentData.duration * 60000);
      const endTime = format(endDate, 'HH:mm:ss');

      console.log("Formatted date and times:", { 
        appointmentDate, 
        startTime, 
        endTime 
      });

      // Get first available business ID from the database or use null
      const { data: business } = await supabase
        .from('negocios')
        .select('id')
        .limit(1)
        .single();
        
      const businessId = business?.id || null;
      
      console.log("Using business ID:", businessId);

      // Convert to database format - only include businessId if it exists
      const appointment = {
        data: appointmentDate,
        hora_inicio: startTime,
        hora_fim: endTime,
        duracao: appointmentData.duration,
        valor: appointmentData.price,
        status: appointmentData.status,
        forma_pagamento: appointmentData.paymentMethod || 'local',
        observacoes: appointmentData.notes,
        id_servico: serviceId,
        id_cliente: clientId,
        id_funcionario: professionalId
      };
      
      // Only add business ID if it exists
      if (businessId) {
        Object.assign(appointment, { id_negocio: businessId });
      }
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert(appointment)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Appointment created successfully:", data);
      
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
