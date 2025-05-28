
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment } from "./types";

export const useAppointmentDelete = (
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const deleteAppointment = async (id: string) => {
    try {
      // Use the bookings table which exists in the database
      const { error } = await supabase
        .from('bookings')
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

  return { deleteAppointment };
};
