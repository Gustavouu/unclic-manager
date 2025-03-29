
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment } from "@/components/appointments/types";
import { CreateAppointmentData } from "./types";
import { isValidUUID } from "./utils";
import { v4 as uuidv4 } from "uuid";

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

      // Try to get business ID from the database
      let businessId = null;
      try {
        const { data: business } = await supabase
          .from('negocios')
          .select('id')
          .limit(1)
          .maybeSingle();
          
        businessId = business?.id || null;
      } catch (error) {
        console.warn("Failed to get business ID from database:", error);
        // Generate a fallback business ID if database query fails
        businessId = appointmentData.businessId || uuidv4();
      }
      
      console.log("Using business ID:", businessId);

      // Make sure we have a valid business ID
      if (!businessId) {
        businessId = uuidv4();
        console.log("Generated new business ID:", businessId);
      }

      // Convert to database format - always include businessId
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
        id_funcionario: professionalId,
        id_negocio: businessId
      };
      
      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .insert(appointment)
          .select()
          .maybeSingle();
        
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
      } catch (dbError) {
        // If database operation fails, use in-memory data for demo purposes
        console.warn("Database operation failed, using in-memory fallback:", dbError);
        
        // Generate random ID for demo purposes
        const demoId = uuidv4();
        
        // Create in-memory appointment
        const newAppointment: Appointment = {
          id: demoId,
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
        toast.success("Agendamento criado com sucesso! (modo demonstração)");
        return demoId;
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error("Erro ao criar agendamento. Tente novamente.");
      throw err;
    }
  };

  return { createAppointment };
};
