
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus } from "@/components/appointments/types";
import { toast } from "sonner";
import { format } from "date-fns";

export const useAppointmentsFetch = () => {
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

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments
  };
};
