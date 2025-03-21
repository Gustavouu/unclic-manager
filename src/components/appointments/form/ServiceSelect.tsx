
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { services } from "../data/appointmentMockData";

type ServiceSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
  selectedService: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  setSelectedService: (service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null) => void;
};

export const ServiceSelect = ({ form, selectedService, setSelectedService }: ServiceSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="serviceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Serviço</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              setSelectedService(services.find(s => s.id === value) || null);
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - R${service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedService && (
            <FormDescription>
              Duração: {selectedService.duration} minutos | Valor: R${selectedService.price}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
