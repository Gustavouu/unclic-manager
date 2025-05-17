
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

export interface ClientData {
  id: string;
  nome?: string;
  name?: string;
  email?: string;
  telefone?: string;
  phone?: string;
}

type ClientSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
  disabled?: boolean;
  clientName?: string;
};

const ClientSelectWrapper = ({ form, disabled = false, clientName }: ClientSelectWrapperProps) => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);

  // Get client data from database
  useEffect(() => {
    if (disabled) return; // Skip fetching if client is already selected

    const fetchClients = async () => {
      setLoading(true);
      try {
        // Try to fetch from clients table first (new schema)
        let { data: newData, error: newError } = await supabase
          .from('clients')
          .select('id, name, email, phone')
          .order('name');
        
        if (newError || !newData || newData.length === 0) {
          // If no data in clients, try legacy 'clientes' table
          console.log('Trying legacy clients table');
          const { data: legacyData, error: legacyError } = await supabase
            .from('clientes')
            .select('id, nome, email, telefone')
            .order('nome');
          
          if (legacyError) {
            console.error('Error fetching legacy clients:', legacyError);
          } else if (legacyData && legacyData.length > 0) {
            // Map legacy data to match expected format
            const mappedData: ClientData[] = legacyData.map(client => ({
              id: client.id,
              nome: client.nome,
              email: client.email,
              telefone: client.telefone
            }));
            setClients(mappedData);
          } else {
            setClients([]);
          }
        } else {
          // Map new data to match expected format
          const mappedData: ClientData[] = newData.map(client => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone
          }));
          setClients(mappedData);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
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
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value} 
              disabled={loading || disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Carregando clientes..." : "Selecione um cliente"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name || client.nome || 'Unknown'} {(client.phone || client.telefone) ? 
                        `(${client.phone || client.telefone})` : ''}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_clients" disabled>
                    {loading ? "Carregando clientes..." : "Nenhum cliente encontrado"}
                  </SelectItem>
                )}
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
