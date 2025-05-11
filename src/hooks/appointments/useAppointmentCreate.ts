
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes } from "date-fns";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "./types";
import { useTenant } from "@/contexts/TenantContext";

export const useAppointmentCreate = (setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>) => {
  const [isCreating, setIsCreating] = useState(false);
  const { businessId } = useTenant();

  const createAppointment = async (appointmentData: Omit<Appointment, "id">): Promise<string> => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      throw new Error("Business ID not available");
    }
    
    setIsCreating(true);
    
    try {
      console.log('Creating appointment for business ID:', businessId, appointmentData);
      
      // Format the date for database
      const dateStr = format(appointmentData.date, 'yyyy-MM-dd');
      const timeStr = format(appointmentData.date, 'HH:mm:ss');
      
      // Calculate end time
      const endDate = addMinutes(appointmentData.date, appointmentData.duration);
      const endTimeStr = format(endDate, 'HH:mm:ss');
      
      // Create additional services JSON if provided
      const additionalServicesJson = appointmentData.additionalServices 
        ? JSON.stringify(appointmentData.additionalServices) 
        : null;
      
      // Create notifications JSON
      const notificationsJson = JSON.stringify({
        enviar_confirmacao: true,
        enviar_lembrete: true
      });
      
      // Insert to database
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          id_cliente: appointmentData.clientId,
          id_servico: appointmentData.serviceId,
          id_funcionario: appointmentData.professionalId,
          id_negocio: businessId,
          data: dateStr,
          hora_inicio: timeStr,
          hora_fim: endTimeStr,
          duracao: appointmentData.duration,
          valor: appointmentData.price,
          status: appointmentData.status,
          forma_pagamento: appointmentData.paymentMethod,
          observacoes: appointmentData.notes,
          servicos_adicionais: additionalServicesJson,
          notificacoes: notificationsJson,
        })
        .select('id')
        .single();
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      // Add to local state
      const createdAppointment: Appointment = {
        id: data.id,
        clientName: appointmentData.clientName,
        serviceName: appointmentData.serviceName,
        date: appointmentData.date,
        status: appointmentData.status as AppointmentStatus,
        price: appointmentData.price,
        serviceType: appointmentData.serviceType,
        duration: appointmentData.duration,
        notes: appointmentData.notes,
        paymentMethod: appointmentData.paymentMethod,
        serviceId: appointmentData.serviceId,
        clientId: appointmentData.clientId,
        professionalId: appointmentData.professionalId,
        professionalName: appointmentData.professionalName,
      };
      
      setAppointments(prevAppointments => [createdAppointment, ...prevAppointments]);
      toast.success("Agendamento criado com sucesso!");
      
      return data.id;
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error("Erro ao criar agendamento");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { createAppointment, isCreating };
};
