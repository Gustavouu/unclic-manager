
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormData } from "../schemas/appointmentFormSchema";
import { useServices } from "@/hooks/useServices";

export type ServiceSelectProps = {
  form: UseFormReturn<AppointmentFormData>;
};

export const ServiceSelect = ({ form }: ServiceSelectProps) => {
  const { services, isLoading } = useServices();

  return (
    <FormField
      control={form.control}
      name="serviceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Serviço</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um serviço"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - R$ {service.price.toFixed(2)} ({service.duration}min)
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
