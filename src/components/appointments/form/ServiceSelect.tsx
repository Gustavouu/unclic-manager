
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useEffect } from "react";

export interface ServiceSelectProps {
  form: UseFormReturn<AppointmentFormValues>;
  selectedService?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  setSelectedService?: (service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null) => void;
  options?: Array<{
    value: string;
    label: string;
    price?: number;
    duration?: number;
  }>;
  onServiceSelect?: (service: any) => void;
}

export const ServiceSelect = ({ 
  form, 
  selectedService, 
  setSelectedService,
  options = [],
  onServiceSelect
}: ServiceSelectProps) => {
  // Fetch services from API or context
  const services = options.length > 0 ? options : [
    { value: "s1", label: "Corte de Cabelo", price: 35, duration: 30 },
    { value: "s2", label: "Barba", price: 25, duration: 20 },
    { value: "s3", label: "Corte e Barba", price: 55, duration: 45 },
    { value: "s4", label: "Coloração", price: 80, duration: 60 }
  ];

  // Update the form when service is selected
  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.value === serviceId);
    
    if (service && setSelectedService) {
      setSelectedService({
        id: service.value,
        name: service.label,
        duration: service.duration || 30,
        price: service.price || 0
      });
      
      // Update the form values
      form.setValue("duration", service.duration || 30);
      form.setValue("price", service.price || 0);
    }

    if (service && onServiceSelect) {
      onServiceSelect({
        id: service.value,
        nome: service.label,
        duracao: service.duration || 30,
        preco: service.price || 0
      });
    }
  };

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
              handleServiceSelect(value);
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
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
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
