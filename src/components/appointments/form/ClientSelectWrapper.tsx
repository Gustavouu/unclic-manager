
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { NewClientDialog } from "@/components/clients/NewClientDialog";

export type ClientSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export default function ClientSelectWrapper({ form }: ClientSelectWrapperProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const { businessId } = useTenant();
  
  useEffect(() => {
    const fetchClients = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        console.log('Fetching clients for business ID:', businessId);
        
        // Use the clients table
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId);
          
        if (error) {
          console.error('Error fetching clients:', error);
          setClients([]);
        } else if (data && data.length > 0) {
          console.log('Found clients:', data.length);
          setClients(data);
        } else {
          console.log('No clients found');
          setClients([]);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [businessId]);

  const handleNewClient = () => {
    setShowNewClientDialog(false);
    // Refresh the clients list
    const fetchClients = async () => {
      if (!businessId) return;
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId);
          
        if (!error && data) {
          setClients(data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    
    fetchClients();
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Cliente</FormLabel>
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "flex-1 justify-between font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      onClick={() => setOpen(!open)}
                      disabled={loading}
                    >
                      {field.value ? 
                        clients.find(c => c.id === field.value)?.name || "Selecione um cliente" : 
                        "Selecione um cliente"
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full" style={{width: "var(--radix-popover-trigger-width)", maxWidth: "100%"}}>
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." className="h-9" />
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {clients.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.name}
                          onSelect={() => {
                            form.setValue("clientId", client.id);
                            setOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            {client.phone && (
                              <span className="text-sm text-muted-foreground">{client.phone}</span>
                            )}
                          </div>
                          {field.value === client.id && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowNewClientDialog(true)}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <NewClientDialog
        open={showNewClientDialog}
        onOpenChange={setShowNewClientDialog}
        onClientCreated={handleNewClient}
      />
    </>
  );
}
