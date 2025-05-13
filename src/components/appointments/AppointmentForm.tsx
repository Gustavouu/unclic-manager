
import React, { useState } from 'react';
import { z } from 'zod';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { services } from '@/components/services/servicesData';
import { AppointmentStatus } from '@/hooks/appointments/types';

const appointmentFormSchema = z.object({
  date: z.date({
    required_error: "A data é obrigatória",
  }),
  clientName: z.string().min(1, "O nome do cliente é obrigatório"),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  serviceName: z.string().optional(),
  professionalId: z.string().optional(),
  professionalName: z.string().optional(),
  duration: z.number().min(1, "A duração deve ser maior que 0"),
  price: z.number().min(0, "O preço não pode ser negativo"),
  status: z.enum(["agendado", "confirmado", "pendente", "concluido", "cancelado"] as const),
  notes: z.string().optional(),
  sendReminders: z.boolean().default(true),
  sendConfirmation: z.boolean().default(true),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  appointmentId?: string;
  onSubmit: (data: AppointmentFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function AppointmentForm({ appointmentId, onSubmit, onCancel }: AppointmentFormProps) {
  const [selectedService, setSelectedService] = useState<any>(null);
  
  // For demo purposes - would come from API in real implementation
  const professionals = [
    { id: "1", name: "João Silva", specialties: ["Cabelo", "Barba"] },
    { id: "2", name: "Maria Santos", specialties: ["Manicure", "Pedicure"] },
    { id: "3", name: "Carlos Oliveira", specialties: ["Cabelo", "Barba", "Tintura"] },
  ];
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: new Date(),
      clientName: "",
      serviceId: "",
      serviceName: "",
      professionalId: "",
      professionalName: "",
      duration: 30,
      price: 0,
      status: "agendado" as AppointmentStatus,
      notes: "",
      sendReminders: true,
      sendConfirmation: true,
    },
  });
  
  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
      form.setValue("serviceId", service.id);
      form.setValue("serviceName", service.name);
      form.setValue("duration", service.duration);
      form.setValue("price", Number(service.price));
      setSelectedService(service);
    }
  };
  
  const handleProfessionalChange = (professionalId: string) => {
    const professional = professionals.find(p => p.id === professionalId);
    
    if (professional) {
      form.setValue("professionalId", professional.id);
      form.setValue("professionalName", professional.name);
    }
  };
  
  const handleFormSubmit = async (data: AppointmentFormValues) => {
    console.log("Form data:", data);
    await onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora</FormLabel>
                <FormControl>
                  <DateTimePicker 
                    date={field.value} 
                    setDate={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <Select 
                  onValueChange={(value) => handleServiceChange(value)} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {typeof service.price === 'number' ? `R$ ${service.price.toFixed(2)}` : service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="professionalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissional</FormLabel>
                <Select 
                  onValueChange={(value) => handleProfessionalChange(value)} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professionals.map(professional => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione observações sobre o agendamento"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sendConfirmation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="cursor-pointer">Enviar confirmação</FormLabel>
                  <FormDescription>
                    Enviar email de confirmação após o agendamento
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sendReminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="cursor-pointer">Enviar lembretes</FormLabel>
                  <FormDescription>
                    Enviar lembretes antes do horário agendado
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {appointmentId ? 'Atualizar Agendamento' : 'Criar Agendamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Expose schema for use in other components
AppointmentForm.schema = appointmentFormSchema;
