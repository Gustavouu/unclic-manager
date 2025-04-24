import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  ultima_visita?: string;
  valor_total_gasto?: number;
  total_agendamentos?: number;
  status?: 'active' | 'inactive';
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('*');

        if (error) {
          console.error("Erro ao buscar clientes:", error);
          setError(error.message);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        }

        setClients(data || []);
      } catch (err: any) {
        console.error("Erro inesperado ao buscar clientes:", err);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  return { clients, isLoading, error };
};
