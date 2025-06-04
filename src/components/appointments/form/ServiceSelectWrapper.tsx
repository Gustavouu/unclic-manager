
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServices } from "@/hooks/useServices";
import { formatCurrency } from "@/lib/format";

export type ServiceSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export default function ServiceSelectWrapper({ form }: ServiceSelectWrapperProps) {
  const { services, isLoading } = useServices();

  return (
    <FormField
      control={form.control}
      name="serviceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Serviço *</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              // Auto-fill price and duration when service is selected
              const selectedService = services.find(s => s.id === value);
              if (selectedService) {
                form.setValue('price', selectedService.price);
                form.setValue('duration', selectedService.duration);
              }
            }} 
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue 
                  placeholder={isLoading ? "Carregando serviços..." : "Selecione um serviço"} 
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(service.price)} • {service.duration}min
                    </span>
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
}
