
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
          
          // Create an Appointment object
          return {
            id: item.id,
            clientName: item.clientes?.nome || item.observacoes?.split(',')[0] || "Cliente não encontrado",
            serviceName: item.servicos?.nome || "Serviço não encontrado",
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
