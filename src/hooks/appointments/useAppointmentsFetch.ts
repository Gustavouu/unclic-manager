
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus } from "@/components/appointments/types";
import { toast } from "sonner";
import { format } from "date-fns";

export const useAppointmentsFetch = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching appointments...");
      
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
          id_servico,
          id_cliente,
          id_funcionario,
          servicos(nome),
          clientes(nome),
          funcionarios(nome)
        `)
        .order('data', { ascending: false })
        .order('hora_inicio', { ascending: true });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched appointments:", data);

      // Transform database data to application format
      const formattedAppointments = data.map(item => {
        try {
          // Parse date and time into a JavaScript Date object
          const dateStr = item.data;
          const timeStr = item.hora_inicio;
          
          // Create a Date object from the date and time strings
          const dateTimeStr = `${dateStr}T${timeStr}`;
          const appointmentDate = new Date(dateTimeStr);
          
          // Ensure we cast the status to AppointmentStatus type
          const status = (item.status || "agendado") as AppointmentStatus;
          
          // Get cliente name safely, handling potential null values and different data structures
          let clientName = "Cliente não identificado";
          if (item.clientes) {
            // Check if clientes is an object
            if (typeof item.clientes === 'object' && item.clientes !== null) {
              // Handle case where clientes is a single object with nome property
              if (!Array.isArray(item.clientes)) {
                // Fix: Type assertion to safely access nome property
                const clientsObj = item.clientes as { nome?: string };
                if (clientsObj && 'nome' in clientsObj && typeof clientsObj.nome === 'string') {
                  clientName = clientsObj.nome;
                }
              } 
              // Handle case where clientes is an array
              else if (Array.isArray(item.clientes) && item.clientes.length > 0) {
                const firstClient = item.clientes[0] as { nome?: string };
                // Fix: Type assertion to safely access nome property
                if (typeof firstClient === 'object' && firstClient !== null && 
                    'nome' in firstClient && typeof firstClient.nome === 'string') {
                  clientName = firstClient.nome;
                }
              }
            }
          } else if (item.observacoes) {
            const parts = item.observacoes.split(',');
            if (parts.length > 0) clientName = parts[0].trim();
          }
          
          // Get service name safely
          let serviceName = "Serviço não identificado";
          if (item.servicos) {
            // Check if servicos is an object
            if (typeof item.servicos === 'object' && item.servicos !== null) {
              // Handle case where servicos is a single object with nome property
              if (!Array.isArray(item.servicos)) {
                // Fix: Type assertion to safely access nome property
                const servicesObj = item.servicos as { nome?: string };
                if (servicesObj && 'nome' in servicesObj && typeof servicesObj.nome === 'string') {
                  serviceName = servicesObj.nome;
                }
              } 
              // Handle case where servicos is an array
              else if (Array.isArray(item.servicos) && item.servicos.length > 0) {
                const firstService = item.servicos[0] as { nome?: string };
                // Fix: Type assertion to safely access nome property
                if (typeof firstService === 'object' && firstService !== null && 
                    'nome' in firstService && typeof firstService.nome === 'string') {
                  serviceName = firstService.nome;
                }
              }
            }
          }
          
          // Create an Appointment object
          return {
            id: item.id,
            clientName: clientName,
            serviceName: serviceName,
            date: appointmentDate,
            status: status,
            price: item.valor || 0,
            serviceType: "haircut", // Default type, can be improved with categorization
            duration: item.duracao || 60,
            notes: item.observacoes,
            paymentMethod: item.forma_pagamento,
            serviceId: item.id_servico,
            clientId: item.id_cliente,
            professionalId: item.id_funcionario
          };
        } catch (err) {
          console.error("Error formatting appointment:", err, item);
          return null;
        }
      }).filter(Boolean) as Appointment[];
      
      setAppointments(formattedAppointments);
      console.log("Formatted appointments:", formattedAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Não foi possível carregar os agendamentos");
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments
  };
};
