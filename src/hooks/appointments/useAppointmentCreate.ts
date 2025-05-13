
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
      
      let appointmentId: string;
      let insertError: any;
      
      // Try to insert into bookings table first
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            business_id: businessId,
            client_id: appointmentData.clientId,
            service_id: appointmentData.serviceId,
            employee_id: appointmentData.professionalId,
            booking_date: dateStr,
            start_time: timeStr,
            end_time: endTimeStr,
            duration: appointmentData.duration,
            price: appointmentData.price,
            status: mapStatus(appointmentData.status),
            payment_method: appointmentData.paymentMethod,
            notes: appointmentData.notes,
            reminder_sent: false
          })
          .select('id')
          .single();
        
        if (bookingError) {
          console.error("Error inserting into bookings:", bookingError);
          insertError = bookingError;
        } else {
          appointmentId = bookingData.id;
          console.log('Successfully created appointment in bookings table:', appointmentId);
        }
      } catch (err) {
        console.error("Exception when inserting into bookings:", err);
      }
      
      // If bookings insert failed, try agendamentos
      if (!appointmentId) {
        try {
          console.log('Trying to insert into agendamentos table');
          const { data: agendamentoData, error: agendamentoError } = await supabase
            .from('agendamentos')
            .insert({
              id_negocio: businessId,
              id_cliente: appointmentData.clientId,
              id_servico: appointmentData.serviceId,
              id_funcionario: appointmentData.professionalId,
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
          
          if (agendamentoError) {
            console.error("Error inserting into agendamentos:", agendamentoError);
            if (!insertError) insertError = agendamentoError;
          } else {
            appointmentId = agendamentoData.id;
            console.log('Successfully created appointment in agendamentos table:', appointmentId);
          }
        } catch (err) {
          console.error("Exception when inserting into agendamentos:", err);
        }
      }
      
      // As a last resort, try Appointments with capital A
      if (!appointmentId) {
        try {
          console.log('Trying to insert into Appointments table');
          const { data: AppointmentData, error: AppointmentError } = await supabase
            .from('Appointments')
            .insert({
              id_negocio: businessId,
              id_cliente: appointmentData.clientId,
              id_servico: appointmentData.serviceId,
              id_funcionario: appointmentData.professionalId,
              data: dateStr,
              hora_inicio: timeStr,
              hora_fim: endTimeStr,
              duracao: appointmentData.duration,
              valor: appointmentData.price,
              status: appointmentData.status,
              forma_pagamento: appointmentData.paymentMethod,
              observacoes: appointmentData.notes,
            })
            .select('id')
            .single();
          
          if (AppointmentError) {
            console.error("Error inserting into Appointments:", AppointmentError);
            if (!insertError) insertError = AppointmentError;
          } else {
            appointmentId = AppointmentData.id;
            console.log('Successfully created appointment in Appointments table:', appointmentId);
          }
        } catch (err) {
          console.error("Exception when inserting into Appointments:", err);
        }
      }
      
      // If no successful inserts, throw the first encountered error
      if (!appointmentId) {
        if (insertError) throw insertError;
        throw new Error("Failed to create appointment in any table");
      }
      
      // Add to local state
      const createdAppointment: Appointment = {
        id: appointmentId,
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
      
      return appointmentId;
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error("Erro ao criar agendamento");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };
  
  // Helper function to map status between different schemas
  const mapStatus = (status: AppointmentStatus): string => {
    const statusMap: Record<AppointmentStatus, string> = {
      'agendado': 'scheduled',
      'confirmado': 'confirmed',
      'cancelado': 'canceled',
      'concluido': 'completed',
      'scheduled': 'scheduled',
      'confirmed': 'confirmed',
      'canceled': 'canceled',
      'completed': 'completed',
      'no_show': 'no_show'
    };
    
    return statusMap[status] || 'scheduled';
  };

  return { createAppointment, isCreating };
};
