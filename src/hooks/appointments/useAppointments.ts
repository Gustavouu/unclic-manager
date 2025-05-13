
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

export type AppointmentStatus = "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou";

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  professionalId: string;
  clientId: string;
  serviceId: string;
  date: Date;
  status: AppointmentStatus;
  duration: number;
  price: number;
  notes?: string;
  paymentMethod?: string;
  serviceType?: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useTenant();

  const fetchAppointments = async () => {
    if (!businessId) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes:id_cliente (nome),
          servicos:id_servico (nome, duracao, preco),
          funcionarios:id_funcionario (nome)
        `)
        .eq('id_negocio', businessId);
        
      if (error) throw error;
      
      // Map database records to our application model
      const mappedAppointments: Appointment[] = (data || []).map(item => ({
        id: item.id,
        clientName: item.clientes?.nome || "Cliente desconhecido",
        serviceName: item.servicos?.nome || "Serviço desconhecido",
        professionalId: item.id_funcionario,
        clientId: item.id_cliente,
        serviceId: item.id_servico,
        date: new Date(`${item.data}T${item.hora_inicio}`),
        status: item.status as AppointmentStatus,
        duration: item.duracao || item.servicos?.duracao || 30,
        price: item.valor || item.servicos?.preco || 0,
        notes: item.observacoes,
        paymentMethod: item.forma_pagamento,
        serviceType: "haircut" // Default type
      }));
      
      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setIsLoading(false);
    }
  };
  
  const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }

    try {
      // Extract time and format fields for the database
      const appointmentDate = appointment.date;
      const date = appointmentDate.toISOString().split('T')[0];
      const timeHours = appointmentDate.getHours().toString().padStart(2, '0');
      const timeMinutes = appointmentDate.getMinutes().toString().padStart(2, '0');
      const hora_inicio = `${timeHours}:${timeMinutes}:00`;
      
      // Calculate end time
      const endDate = new Date(appointmentDate.getTime() + appointment.duration * 60000);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      const hora_fim = `${endHours}:${endMinutes}:00`;

      const { data, error } = await supabase
        .from('agendamentos')
        .insert([{
          id_negocio: businessId,
          id_cliente: appointment.clientId,
          id_servico: appointment.serviceId,
          id_funcionario: appointment.professionalId,
          data: date,
          hora_inicio: hora_inicio,
          hora_fim: hora_fim,
          duracao: appointment.duration,
          valor: appointment.price,
          status: appointment.status,
          forma_pagamento: appointment.paymentMethod,
          observacoes: appointment.notes,
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Create a client-side representation of the new appointment
      const newAppointment: Appointment = {
        id: data.id,
        clientName: appointment.clientName,
        serviceName: appointment.serviceName,
        professionalId: appointment.professionalId,
        clientId: appointment.clientId,
        serviceId: appointment.serviceId,
        date: appointment.date,
        status: appointment.status,
        duration: appointment.duration,
        price: appointment.price,
        notes: appointment.notes,
        paymentMethod: appointment.paymentMethod,
        serviceType: appointment.serviceType,
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      
      toast.success("Agendamento criado com sucesso!");
      return newAppointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao criar agendamento");
      return null;
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      setAppointments(prev => 
        prev.map(appt => 
          appt.id === id ? { ...appt, status } : appt
        )
      );
      
      toast.success("Status do agendamento atualizado");
      return true;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Erro ao atualizar status do agendamento");
      return false;
    }
  };
  
  useEffect(() => {
    fetchAppointments();
    
    // Subscribe to appointment changes
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agendamentos' },
        () => {
          fetchAppointments(); // Refresh when appointments change
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [businessId]);
  
  return {
    appointments,
    isLoading,
    createAppointment,
    updateAppointmentStatus,
    fetchAppointments
  };
};
