
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

type ClientSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
  disabled?: boolean;
  clientName?: string;
};

const ClientSelectWrapper = ({ form, disabled = false, clientName }: ClientSelectWrapperProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get client data from database
  useEffect(() => {
    if (disabled) return; // Skip fetching if client is already selected

    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('id, nome, email, telefone')
          .order('nome');
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [disabled]);

  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          {disabled ? (
            <Input 
              value={clientName || 'Cliente selecionado'} 
              disabled 
              className="bg-muted"
            />
          ) : (
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Carregando clientes..." : "Selecione um cliente"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nome} {client.telefone ? `(${client.telefone})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ClientSelectWrapper;
