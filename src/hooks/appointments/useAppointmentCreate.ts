
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { Appointment, AppointmentStatus, CreateAppointmentData } from "./types";
import { tableExists } from "@/utils/databaseUtils";

export const useAppointmentCreate = (
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { businessId } = useTenant();

  const createAppointment = async (data: CreateAppointmentData) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }

    setIsLoading(true);
    try {
      console.log('Creating appointment with data:', data);
      
      // First try with the modern bookings table
      const hasBookingsTable = await tableExists('bookings');
      let result = null;
      
      if (hasBookingsTable) {
        console.log('Using bookings table for appointment creation');
        const { data: newAppointment, error } = await supabase
          .from('bookings')
          .insert({
            business_id: businessId,
            client_id: data.clientId,
            service_id: data.serviceId,
            employee_id: data.professionalId,
            booking_date: data.date.toISOString().split('T')[0],
            start_time: data.time,
            end_time: data.endTime || '',
            duration: data.duration || 30,
            price: data.price || 0,
            status: data.status || 'scheduled',
            payment_method: data.paymentMethod,
            notes: data.notes,
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error creating appointment in bookings:', error);
          throw error;
        }
        
        result = newAppointment;
      } else {
        // Try legacy agendamentos table
        console.log('Using agendamentos table for appointment creation');
        const { data: legacyAppointment, error: legacyError } = await supabase
          .from('agendamentos')
          .insert({
            id_negocio: businessId,
            id_cliente: data.clientId,
            id_servico: data.serviceId,
            id_funcionario: data.professionalId,
            data: data.date.toISOString().split('T')[0],
            hora_inicio: data.time,
            hora_fim: data.endTime || '',
            duracao: data.duration || 30,
            valor: data.price || 0,
            status: data.status || 'agendado',
            forma_pagamento: data.paymentMethod,
            observacoes: data.notes,
          })
          .select()
          .single();
          
        if (legacyError) {
          console.error('Error creating appointment in agendamentos:', legacyError);
          throw legacyError;
        }
        
        result = legacyAppointment;
      }
      
      if (result) {
        // Fetch the newly created appointment with its related entities
        let completeAppointment: any;
        
        if (hasBookingsTable) {
          const { data: bookingWithRelations, error } = await supabase
            .from('bookings')
            .select(`
              *,
              clients (*),
              services_v2 (*),
              employees (*)
            `)
            .eq('id', result.id)
            .single();
            
          if (error) throw error;
          completeAppointment = bookingWithRelations;
        } else {
          const { data: appointmentWithRelations, error } = await supabase
            .from('agendamentos')
            .select(`
              *,
              clientes (*),
              servicos (*),
              funcionarios (*)
            `)
            .eq('id', result.id)
            .single();
            
          if (error) throw error;
          completeAppointment = appointmentWithRelations;
        }
        
        // Process the appointment data into our standard format
        const newAppointment: Appointment = {
          id: completeAppointment.id,
          clientId: completeAppointment.client_id || completeAppointment.id_cliente,
          clientName: completeAppointment.clients?.name || 
                    completeAppointment.clients?.nome || 
                    completeAppointment.clientes?.nome || 
                    "Cliente não identificado",
          serviceId: completeAppointment.service_id || completeAppointment.id_servico,
          serviceName: completeAppointment.services_v2?.name || 
                      completeAppointment.services_v2?.nome || 
                      completeAppointment.servicos?.nome || 
                      "Serviço não identificado",
          serviceType: "service",
          professionalId: completeAppointment.employee_id || completeAppointment.id_funcionario,
          professionalName: completeAppointment.employees?.name || 
                          completeAppointment.employees?.nome || 
                          completeAppointment.funcionarios?.nome || 
                          "Profissional não identificado",
          date: new Date(`${completeAppointment.booking_date || completeAppointment.data}T${completeAppointment.start_time || completeAppointment.hora_inicio}`),
          duration: completeAppointment.duration || completeAppointment.duracao || 30,
          price: completeAppointment.price || completeAppointment.valor || 0,
          status: (completeAppointment.status as AppointmentStatus) || "scheduled",
          notes: completeAppointment.notes || completeAppointment.observacoes || "",
          paymentMethod: completeAppointment.payment_method || completeAppointment.forma_pagamento
        };
        
        setAppointments(prev => [newAppointment, ...prev]);
        
        toast.success("Agendamento criado com sucesso!");
        return newAppointment;
      } else {
        throw new Error("Não foi possível criar o agendamento");
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      toast.error(`Erro ao criar agendamento: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateAppointment = async (id: string, data: Partial<CreateAppointmentData>) => {
    // Implementação similar à criação, mas usando .update() ao invés de .insert()
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }

    setIsLoading(true);
    try {
      console.log('Updating appointment with id:', id, 'data:', data);
      
      // First try with the modern bookings table
      const hasBookingsTable = await tableExists('bookings');
      let result = null;
      
      if (hasBookingsTable) {
        const updateData: any = {}
        
        // Map fields appropriately
        if (data.clientId) updateData.client_id = data.clientId;
        if (data.serviceId) updateData.service_id = data.serviceId;
        if (data.professionalId) updateData.employee_id = data.professionalId;
        if (data.date) updateData.booking_date = data.date.toISOString().split('T')[0];
        if (data.time) updateData.start_time = data.time;
        if (data.endTime) updateData.end_time = data.endTime;
        if (data.duration) updateData.duration = data.duration;
        if (data.price) updateData.price = data.price;
        if (data.status) updateData.status = data.status;
        if (data.paymentMethod) updateData.payment_method = data.paymentMethod;
        if (data.notes) updateData.notes = data.notes;
        
        const { data: updatedAppointment, error } = await supabase
          .from('bookings')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating appointment in bookings:', error);
          throw error;
        }
        
        result = updatedAppointment;
      } else {
        // Try legacy agendamentos table
        const updateData: any = {}
        
        // Map fields appropriately for legacy table
        if (data.clientId) updateData.id_cliente = data.clientId;
        if (data.serviceId) updateData.id_servico = data.serviceId;
        if (data.professionalId) updateData.id_funcionario = data.professionalId;
        if (data.date) updateData.data = data.date.toISOString().split('T')[0];
        if (data.time) updateData.hora_inicio = data.time;
        if (data.endTime) updateData.hora_fim = data.endTime;
        if (data.duration) updateData.duracao = data.duration;
        if (data.price) updateData.valor = data.price;
        if (data.status) updateData.status = data.status;
        if (data.paymentMethod) updateData.forma_pagamento = data.paymentMethod;
        if (data.notes) updateData.observacoes = data.notes;
        
        const { data: legacyAppointment, error: legacyError } = await supabase
          .from('agendamentos')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
          
        if (legacyError) {
          console.error('Error updating appointment in agendamentos:', legacyError);
          throw legacyError;
        }
        
        result = legacyAppointment;
      }
      
      if (result) {
        toast.success("Agendamento atualizado com sucesso!");
        
        // Atualiza a lista de agendamentos
        setAppointments(prev => {
          return prev.map(appointment => 
            appointment.id === id ? { ...appointment, ...data } : appointment
          );
        });
        
        return result;
      } else {
        throw new Error("Não foi possível atualizar o agendamento");
      }
    } catch (error: any) {
      console.error("Error updating appointment:", error);
      toast.error(`Erro ao atualizar agendamento: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelAppointment = async (id: string) => {
    return await updateAppointment(id, { status: 'canceled' });
  };

  return { createAppointment, updateAppointment, cancelAppointment, isLoading };
};
