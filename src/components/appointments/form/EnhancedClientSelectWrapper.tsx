
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, User, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { normalizeClientData } from "@/utils/databaseUtils";
import { NewClientDialog } from "@/components/clients/NewClientDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export type EnhancedClientSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export default function EnhancedClientSelectWrapper({ form }: EnhancedClientSelectWrapperProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { businessId } = useTenant();
  
  useEffect(() => {
    const fetchClients = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        console.log('Fetching clients for business ID:', businessId);
        
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId)
          .order('nome', { ascending: true });
          
        if (error) {
          console.error('Error fetching clients:', error);
          setClients([]);
        } else if (data && data.length > 0) {
          console.log('Found clients:', data.length);
          const normalizedClients = data.map(normalizeClientData);
          setClients(normalizedClients);
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

  const handleNewClient = (newClient: any) => {
    const normalizedClient = normalizeClientData(newClient);
    setClients(prev => [normalizedClient, ...prev]);
    form.setValue("clientId", normalizedClient.id);
    setShowNewClientDialog(false);
    setOpen(false);
  };

  const selectedClientId = form.watch("clientId");
  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Filter clients based on search query
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.phone && client.phone.includes(searchQuery)) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <>
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente *
            </FormLabel>
            
            {/* Selected Client Display */}
            {selectedClient && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">{selectedClient.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-green-700">
                        {selectedClient.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {selectedClient.phone}
                          </div>
                        )}
                        {selectedClient.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedClient.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Selecionado
                  </Badge>
                </div>
              </div>
            )}
            
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
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          Carregando clientes...
                        </div>
                      ) : field.value ? (
                        selectedClient?.name || "Cliente selecionado"
                      ) : (
                        "Buscar cliente..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full" style={{width: "var(--radix-popover-trigger-width)", maxWidth: "100%"}}>
                  <Command>
                    <CommandInput 
                      placeholder="Buscar por nome, telefone ou email..." 
                      className="h-9"
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandEmpty>
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Nenhum cliente encontrado.
                        </p>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setShowNewClientDialog(true);
                            setOpen(false);
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Cadastrar novo cliente
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {filteredClients.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.name}
                          onSelect={() => {
                            form.setValue("clientId", client.id);
                            setOpen(false);
                          }}
                          className="flex items-center gap-3 p-3"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{client.name}</div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {client.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {client.phone}
                                </div>
                              )}
                              {client.email && (
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{client.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {field.value === client.id && (
                            <Check className="h-4 w-4 text-green-600" />
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
                title="Cadastrar novo cliente"
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
