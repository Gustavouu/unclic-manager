
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
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching appointments for business ID:', businessId);
      let appointmentData;
      let fetchError;
      
      // Try fetching from bookings table first
      try {
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
          console.error('Error fetching from bookings:', error);
          fetchError = error;
        } else if (data && data.length > 0) {
          console.log('Successfully fetched data from bookings table:', data.length, 'records');
          appointmentData = data;
        } else {
          console.log('No data in bookings table');
        }
      } catch (err) {
        console.error('Exception when fetching from bookings:', err);
      }
      
      // If bookings didn't work, try original agendamentos table
      if (!appointmentData) {
        try {
          console.log('Trying legacy agendamentos table');
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
            
          if (legacyError) {
            console.error('Error fetching from agendamentos:', legacyError);
            if (!fetchError) fetchError = legacyError;
          } else if (legacyData && legacyData.length > 0) {
            console.log('Successfully fetched data from agendamentos table:', legacyData.length, 'records');
            appointmentData = legacyData;
          } else {
            console.log('No data in agendamentos table');
          }
        } catch (err) {
          console.error('Exception when fetching from agendamentos:', err);
        }
      }
      
      // Try the capitalized table name as a last resort
      if (!appointmentData) {
        try {
          console.log('Trying Appointments table with capital A');
          const { data: capitalData, error: capitalError } = await supabase
            .from('Appointments')
            .select(`
              *,
              clientes:id_cliente (*),
              servicos:id_servico (*),
              funcionarios:id_funcionario (*)
            `)
            .eq('id_negocio', businessId)
            .order('data', { ascending: false })
            .order('hora_inicio', { ascending: false });
            
          if (capitalError) {
            console.error('Error fetching from Appointments:', capitalError);
            if (!fetchError) fetchError = capitalError;
          } else if (capitalData && capitalData.length > 0) {
            console.log('Successfully fetched data from Appointments table:', capitalData.length, 'records');
            appointmentData = capitalData;
          } else {
            console.log('No data in Appointments table');
          }
        } catch (err) {
          console.error('Exception when fetching from Appointments:', err);
        }
      }
      
      // If we still have no data and have errors, throw the first error
      if (!appointmentData && fetchError) {
        throw fetchError;
      }
      
      if (!appointmentData || appointmentData.length === 0) {
        console.log('No appointment data found in any table');
        setAppointments([]);
        setIsLoading(false);
        return;
      }
      
      // Map database response to our Appointment interface
      const mappedAppointments = appointmentData.map(app => {
        // Determine if we're using the new or legacy schema
        const isNewSchema = 'booking_date' in app;
        
        if (isNewSchema) {
          // New schema (bookings table)
          const client = app.clients || {};
          const service = app.services_v2 || {};
          const employee = app.employees || {};
          
          // Parse date and time to create a JavaScript Date object
          const dateStr = app.booking_date;
          const timeStr = app.start_time;
          const dateTimeStr = `${dateStr}T${timeStr}`;
          const dateObj = new Date(dateTimeStr);
          
          return {
            id: app.id,
            clientId: app.client_id,
            clientName: client.name || "Client not identified",
            serviceId: app.service_id,
            serviceName: service.name || "Service not identified",
            serviceType: service.type || "service",
            professionalId: app.employee_id,
            professionalName: employee.name || "Professional not identified",
            date: dateObj,
            duration: app.duration || 30,
            price: app.price || 0,
            status: (app.status as AppointmentStatus) || "scheduled",
            notes: app.notes,
            paymentMethod: app.payment_method
          } as Appointment;
        } else {
          // Legacy schema (agendamentos or Appointments table)
          const cliente = app.clientes || {};
          const servico = app.servicos || {};
          const funcionario = app.funcionarios || {};
          
          // Parse date and time
          const dateStr = app.data;
          const timeStr = app.hora_inicio;
          const dateTimeStr = `${dateStr}T${timeStr}`;
          const dateObj = new Date(dateTimeStr);
          
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
        }
      });
      
      setAppointments(mappedAppointments);
      console.log('Successfully mapped', mappedAppointments.length, 'appointments');
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
