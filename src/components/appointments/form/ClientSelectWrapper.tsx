
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useMemo } from "react";
import { toast } from "sonner";
import { normalizeClientData, tableExists } from "@/utils/databaseUtils";

export interface ClientSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  onNewClient?: () => void;
}

export default function ClientSelectWrapper({ form, onNewClient }: ClientSelectWrapperProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { businessId } = useTenant();
  
  // Buscar clientes do banco de dados
  useEffect(() => {
    const fetchClients = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        console.log('Fetching clients for business ID:', businessId);
        let clientsData;
        
        // Primeiro tenta tabela clients
        const hasClientsTable = await tableExists('clients');
        
        if (hasClientsTable) {
          console.log('Trying clients table');
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', businessId);
            
          if (error) {
            console.error('Error fetching clients:', error);
          } else if (data && data.length > 0) {
            console.log('Found clients in clients table:', data.length);
            clientsData = data.map(normalizeClientData);
          }
        }
        
        // Se não encontrou na tabela clients, tenta na tabela clientes
        if (!clientsData) {
          try {
            console.log('Trying clientes table');
            // Check if the table exists before querying
            const { data, error } = await supabase.rpc('table_exists', { table_name: 'clientes' });
            if (data) {
              const response = await supabase
                .from('clientes')
                .select('*')
                .eq('id_negocio', businessId);
                
              if (response.error) {
                console.error('Error fetching from clientes table:', response.error);
              } else if (response.data && response.data.length > 0) {
                console.log('Found clients in clientes table:', response.data.length);
                clientsData = response.data.map(normalizeClientData);
              }
            }
          } catch (error) {
            console.error('Error checking clientes table:', error);
          }
        }
        
        if (clientsData && clientsData.length > 0) {
          setClients(clientsData);
        } else {
          console.log('No clients found in any table');
          setClients([]);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [businessId]);
  
  const clientsOptions = useMemo(() => {
    return clients.map(client => ({
      value: client.id,
      label: client.name || client.nome,
      details: `${client.email || ''} · ${client.phone || client.telefone || ''}`
    }));
  }, [clients]);
  
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Cliente</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between w-full font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setOpen(!open)}
                >
                  {field.value ? 
                    clientsOptions.find(client => client.value === field.value)?.label || "Selecione um cliente" : 
                    "Selecione um cliente"
                  }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full" style={{width: "var(--radix-popover-trigger-width)"}}>
              <Command>
                <CommandInput placeholder="Buscar cliente..." className="h-9" />
                <CommandEmpty>
                  Nenhum cliente encontrado.
                  {onNewClient && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 flex items-center gap-1 justify-center"
                      onClick={() => {
                        setOpen(false);
                        onNewClient();
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Novo Cliente
                    </Button>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {clientsOptions.map((client) => (
                    <CommandItem
                      key={client.value}
                      value={`${client.label} ${client.details}`}
                      onSelect={() => {
                        form.setValue("clientId", client.value);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span>{client.label}</span>
                        <p className="text-xs text-muted-foreground">{client.details}</p>
                      </div>
                      
                      {field.value === client.value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {onNewClient && (
                  <div className="p-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm" 
                      className="w-full flex items-center gap-1 justify-center"
                      onClick={() => {
                        setOpen(false);
                        onNewClient();
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Novo Cliente
                    </Button>
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
