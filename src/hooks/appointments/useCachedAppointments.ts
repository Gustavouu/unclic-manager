
import { useSupabaseQuery, queryClient } from "@/lib/react-query-utils";
import { AppointmentStatus, Appointment } from "../appointments/types";
import { useTenant } from "@/contexts/TenantContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AppointmentsFilter {
  status?: AppointmentStatus | 'all';
  serviceType?: string | 'all';
  date?: { start?: Date; end?: Date } | null;
  clientId?: string;
  professionalId?: string;
  search?: string;
}

export function useCachedAppointments(
  filters: AppointmentsFilter = {},
  pagination = { page: 0, pageSize: 20 },
  enabled = true
) {
  const { businessId } = useTenant();
  
  // Format filters for Supabase query
  const formattedFilters: Record<string, any> = {};
  
  if (businessId) {
    formattedFilters.id_negocio = businessId;
  }
  
  if (filters.status && filters.status !== 'all') {
    formattedFilters.status = filters.status;
  }
  
  if (filters.serviceType && filters.serviceType !== 'all') {
    formattedFilters.serviceType = filters.serviceType;
  }
  
  if (filters.clientId) {
    formattedFilters.id_cliente = filters.clientId;
  }
  
  if (filters.professionalId) {
    formattedFilters.id_funcionario = filters.professionalId;
  }
  
  // Date filtering
  if (filters.date?.start) {
    formattedFilters.data = { 
      gte: filters.date.start.toISOString().split('T')[0] 
    };
  }
  
  if (filters.date?.end) {
    if (!formattedFilters.data) formattedFilters.data = {};
    formattedFilters.data.lte = filters.date.end.toISOString().split('T')[0];
  }
  
  // Use our custom query hook
  const appointmentsQuery = useSupabaseQuery<Appointment>('agendamentos', {
    page: pagination.page,
    pageSize: pagination.pageSize,
    select: `
      *,
      clientes:id_cliente (*),
      servicos:id_servico (*),
      funcionarios:id_funcionario (*)
    `,
    filters: formattedFilters,
    sortBy: { column: 'data', ascending: false },
    enabled: !!businessId && enabled
  });
  
  // Map database response to our Appointment interface
  const appointments = (appointmentsQuery.data?.data || []).map(app => {
    // Get related data safely
    const cliente = app.clientes || {};
    const servico = app.servicos || {};
    const funcionario = app.funcionarios || {};
    
    // Parse date and time
    const dateObj = new Date(`${app.data}T${app.hora_inicio}`);
    
    // Create appointment object
    return {
      id: app.id,
      clientId: app.id_cliente,
      clientName: cliente.nome || "Cliente não identificado",
      serviceId: app.id_servico,
      serviceName: servico.nome || "Serviço não identificado",
      serviceType: app.serviceType || "service", // Default type
      professionalId: app.id_funcionario,
      professionalName: funcionario.nome || "Profissional não identificado",
      date: dateObj,
      duration: app.duracao || 30,
      price: app.valor || 0,
      status: (app.status as AppointmentStatus) || "agendado",
      notes: app.observacoes,
      paymentMethod: app.forma_pagamento
    } as Appointment;
  });
  
  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: Partial<Appointment>) => {
      if (!businessId) throw new Error("Business ID is required");
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          id_negocio: businessId,
          id_cliente: newAppointment.clientId,
          id_servico: newAppointment.serviceId,
          id_funcionario: newAppointment.professionalId,
          data: newAppointment.date ? newAppointment.date.toISOString().split('T')[0] : null,
          hora_inicio: newAppointment.date ? newAppointment.date.toISOString().split('T')[1].substring(0, 5) : null,
          duracao: newAppointment.duration,
          valor: newAppointment.price,
          status: newAppointment.status || "agendado",
          observacoes: newAppointment.notes,
          forma_pagamento: newAppointment.paymentMethod
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch appointments
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao criar agendamento");
    }
  });
  
  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Appointment> & { id: string }) => {
      const { data, error } = await supabase
        .from('agendamentos')
        .update({
          ...(updates.clientId && { id_cliente: updates.clientId }),
          ...(updates.serviceId && { id_servico: updates.serviceId }),
          ...(updates.professionalId && { id_funcionario: updates.professionalId }),
          ...(updates.date && { 
            data: updates.date.toISOString().split('T')[0],
            hora_inicio: updates.date.toISOString().split('T')[1].substring(0, 5) 
          }),
          ...(updates.duration && { duracao: updates.duration }),
          ...(updates.price && { valor: updates.price }),
          ...(updates.status && { status: updates.status }),
          ...(updates.notes !== undefined && { observacoes: updates.notes }),
          ...(updates.paymentMethod && { forma_pagamento: updates.paymentMethod })
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success("Agendamento atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating appointment:", error);
      toast.error("Erro ao atualizar agendamento");
    }
  });
  
  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success("Agendamento removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting appointment:", error);
      toast.error("Erro ao remover agendamento");
    }
  });
  
  return {
    appointments,
    isLoading: appointmentsQuery.isLoading,
    isError: appointmentsQuery.isError,
    error: appointmentsQuery.error,
    metadata: appointmentsQuery.data?.meta,
    refresh: () => appointmentsQuery.refetch(),
    createAppointment: createAppointmentMutation.mutateAsync,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    deleteAppointment: deleteAppointmentMutation.mutateAsync,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending
  };
}
