import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { services } from "../data/appointmentMockData";

export type ServiceSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
  label?: string;
  excludeIds?: string[];
  onServiceSelect?: (service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  }) => void;
  optional?: boolean;
};

export const ServiceSelect = ({ 
  form, 
  label = "Serviço", 
  excludeIds = [], 
  onServiceSelect,
  optional = false
}: ServiceSelectProps) => {
  const availableServices = services.filter(
    service => !excludeIds.includes(service.id)
  );
  
  return (
    <FormField
      control={form.control}
      name="serviceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              
              // Se o callback existir, encontrar o serviço selecionado e chamar
              if (onServiceSelect) {
                const selectedService = services.find(s => s.id === value);
                if (selectedService) {
                  onServiceSelect({
                    id: selectedService.id,
                    name: selectedService.name,
                    duration: selectedService.duration,
                    price: selectedService.price
                  });
                }
              }
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Selecione um ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - R$ {service.price.toFixed(2)}
                </SelectItem>
              ))}
              {availableServices.length === 0 && (
                <SelectItem value="" disabled>
                  Nenhum serviço disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {!optional && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
