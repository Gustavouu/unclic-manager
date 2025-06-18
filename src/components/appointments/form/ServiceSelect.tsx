
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from "react";

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
  label?: string;
  excludeIds?: string[];
  onServiceSelect?: (service: any) => void;
  options?: Array<{
    value: string;
    label: string;
    price?: number;
    duration?: number;
  }>;
  optional?: boolean; // Add this property for StepperForm
}

export const ServiceSelect = ({
  form,
  selectedService = null,
  setSelectedService = () => {},
  label = "Serviço",
  excludeIds = [],
  onServiceSelect,
  options,
  optional = false // Default value for new property
}: ServiceSelectProps) => {
  // This could come from API or context
  const defaultServices = [
    { id: "s1", name: "Corte de Cabelo", duration: 30, price: 50 },
    { id: "s2", name: "Barba", duration: 20, price: 30 },
    { id: "s3", name: "Corte e Barba", duration: 45, price: 70 },
    { id: "s4", name: "Coloração", duration: 90, price: 120 },
    { id: "s5", name: "Hidratação", duration: 60, price: 80 },
  ];

  // Use provided options or default services
  const services = options 
    ? options.map(opt => ({
        id: opt.value,
        name: opt.label,
        duration: opt.duration || 30,
        price: opt.price || 0
      }))
    : defaultServices;

  const filteredServices = services.filter(
    service => !excludeIds.includes(service.id)
  );

  const handleSelectService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
      setSelectedService({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price
      });
      
      if (onServiceSelect) {
        onServiceSelect(service);
      }
    }
  };

  // Update the form with the selected service's details when it changes
  useEffect(() => {
    if (selectedService) {
      form.setValue('duration', selectedService.duration);
      form.setValue('price', selectedService.price);
    }
  }, [selectedService, form]);

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
              handleSelectService(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filteredServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - R${service.price.toFixed(2)} ({service.duration}min)
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
