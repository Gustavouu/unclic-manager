
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus } from "@/components/appointments/types";
import { format } from "date-fns";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch from database
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          id,
          data,
          hora_inicio,
          hora_fim,
          duracao,
          valor,
          status,
          forma_pagamento,
          observacoes,
          servicos(nome),
          clientes(nome),
          funcionarios(nome)
        `);
      
      if (error) throw error;

      // Transform database data to application format
      const formattedAppointments = data.map(item => {
        const appointmentDate = new Date(`${item.data}T${item.hora_inicio}`);
        
        // Ensure we cast the status to AppointmentStatus type
        const status = (item.status || "agendado") as AppointmentStatus;
        
        return {
          id: item.id,
          clientName: item.clientes?.nome || "Cliente não encontrado",
          serviceName: item.servicos?.nome || "Serviço não encontrado",
          date: appointmentDate,
          status: status,
          price: item.valor || 0,
          serviceType: "haircut", // Default type, can be improved with categorization
          duration: item.duracao || 60,
          notes: item.observacoes,
          paymentMethod: item.forma_pagamento
        };
      });
      
      setAppointments(formattedAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Não foi possível carregar os agendamentos");
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData: {
    clientName: string;
    serviceName: string;
    date: Date;
    status: AppointmentStatus;
    price: number;
    serviceType: string;
    duration: number;
    notes?: string;
    serviceId?: string;
    clientId?: string;
    professionalId?: string;
    businessId?: string;
    paymentMethod?: string;
  }) => {
    try {
      // Check for valid UUIDs or use sensible defaults
      const defaultUuid = "00000000-0000-4000-a000-000000000001"; // Valid UUID for defaults
      
      const serviceId = isValidUUID(appointmentData.serviceId) ? appointmentData.serviceId : defaultUuid;
      const clientId = isValidUUID(appointmentData.clientId) ? appointmentData.clientId : defaultUuid;
      const professionalId = isValidUUID(appointmentData.professionalId) ? appointmentData.professionalId : defaultUuid;
      const businessId = isValidUUID(appointmentData.businessId) ? appointmentData.businessId : defaultUuid;

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
        paymentMethod: appointmentData.paymentMethod
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

  // Helper function to validate UUID format
  const isValidUUID = (id: string | undefined): boolean => {
    if (!id) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const updateAppointment = async (id: string, changes: Partial<Appointment>) => {
    try {
      // Convert to database format
      const updates: Record<string, any> = {};
      
      if (changes.date) {
        updates.data = format(changes.date, 'yyyy-MM-dd');
        updates.hora_inicio = format(changes.date, 'HH:mm:ss');
        
        if (changes.duration) {
          updates.hora_fim = format(
            new Date(changes.date.getTime() + changes.duration * 60000), 
            'HH:mm:ss'
          );
        }
      }
      
      if (changes.duration) updates.duracao = changes.duration;
      if (changes.price) updates.valor = changes.price;
      if (changes.status) updates.status = changes.status;
      if (changes.paymentMethod) updates.forma_pagamento = changes.paymentMethod;
      if (changes.notes) updates.observacoes = changes.notes;
      
      const { error } = await supabase
        .from('agendamentos')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update in state
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, ...changes } : app)
      );
      
      toast.success("Agendamento atualizado com sucesso!");
    } catch (err) {
      console.error("Error updating appointment:", err);
      toast.error("Erro ao atualizar agendamento");
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from state
      setAppointments(prev => prev.filter(app => app.id !== id));
      toast.success("Agendamento excluído com sucesso!");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error("Erro ao excluir agendamento");
      throw err;
    }
  };

  // Load appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
}
