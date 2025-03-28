
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type ServiceSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
  availableServices?: any[];
};

const ServiceSelectWrapper = ({ form, availableServices }: ServiceSelectWrapperProps) => {
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Use provided services or fetch from the database
  useEffect(() => {
    if (availableServices && availableServices.length > 0) {
      setServices(availableServices);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('servicos')
          .select('id, nome, duracao, preco')
          .eq('ativo', true);
        
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [availableServices]);

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService({
        id: service.id,
        name: service.nome,
        duration: service.duracao,
        price: service.preco
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
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Carregando serviços..." : "Selecione um serviço"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.nome} - {service.duracao}min - R${service.preco}
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

export default ServiceSelectWrapper;
