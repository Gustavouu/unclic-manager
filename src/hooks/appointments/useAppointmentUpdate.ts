
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment } from "@/components/appointments/types";

export const useAppointmentUpdate = (
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
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

  return { updateAppointment };
};
