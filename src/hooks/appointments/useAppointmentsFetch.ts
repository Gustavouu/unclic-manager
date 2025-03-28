
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
