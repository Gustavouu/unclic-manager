
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
      
      // First try to fetch from the new bookings table
      let { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clients:client_id (*),
          services_v2:service_id (*),
          employees:employee_id (*)
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: false });
      
      if (error) {
        console.log('Error fetching from bookings, trying legacy table instead');
        // If there's an error or no data, try the legacy table
        const { data: legacyData, error: legacyError } = await supabase
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
        
        if (legacyError) throw legacyError;
        
        data = legacyData;
      }
      
      // Map database response to our Appointment interface
      const mappedAppointments = (data || []).map(app => {
        // Get related data safely based on table structure
        const isLegacyStructure = "id_cliente" in app;
        
        // Handle data from either table structure
        if (isLegacyStructure) {
          // Legacy structure (agendamentos)
          const cliente = app.clientes || {};
          const servico = app.servicos || {};
          const funcionario = app.funcionarios || {};
          
          // Parse date and time
          const dateObj = new Date(`${app.data}T${app.hora_inicio}`);
          
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
        } else {
          // New structure (bookings)
          const client = app.clients || {};
          const service = app.services_v2 || {};
          const employee = app.employees || {};
          
          // Parse date and time
          const dateObj = new Date(`${app.booking_date}T${app.start_time}`);
          
          return {
            id: app.id,
            clientId: app.client_id,
            clientName: client.name || "Client not identified",
            serviceId: app.service_id,
            serviceName: service.name || "Service not identified",
            serviceType: "service", // Default type
            professionalId: app.employee_id,
            professionalName: employee.name || "Professional not identified",
            date: dateObj,
            duration: app.duration || 30,
            price: app.price || 0,
            status: (app.status as AppointmentStatus) || "scheduled",
            notes: app.notes,
            paymentMethod: app.payment_method
          } as Appointment;
        }
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
