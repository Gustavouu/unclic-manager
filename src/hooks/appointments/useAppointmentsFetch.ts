
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "./types";
import { useTenant } from "@/contexts/TenantContext";

export function useAppointmentsFetch() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchAppointments = useCallback(async () => {
    if (!businessId) {
      console.log('No business ID available, skipping appointments fetch');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching appointments for business ID:', businessId);
      
      // Fetch appointments with related data
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes:id_cliente (*),
          servicos:id_servico (*),
          funcionarios:id_funcionario (*)
        `)
        .eq('id_negocio', businessId)
        .order('data', { ascending: false })
        .order('hora_inicio', { ascending: false });
      
      if (error) throw error;
      
      // Map database response to our Appointment interface
      const mappedAppointments = (data || []).map(app => {
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
          serviceType: "service", // Default type
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
      
      setAppointments(mappedAppointments);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments,
  };
}
