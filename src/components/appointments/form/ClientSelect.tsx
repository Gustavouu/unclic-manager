
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useClients } from "@/hooks/useClients";

export type ClientSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export const ClientSelect = ({ form }: ClientSelectProps) => {
  const { clients, isLoading } = useClients();

  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue 
                  placeholder={isLoading ? "Carregando clientes..." : "Selecione um cliente"} 
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{client.name}</span>
                    {client.phone && (
                      <span className="text-sm text-muted-foreground">{client.phone}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
