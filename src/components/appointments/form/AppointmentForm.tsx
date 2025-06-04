
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AppointmentFormValues } from '@/types/appointments';
import ProfessionalSelectWrapper from './ProfessionalSelectWrapper';
import ClientSelectWrapper from './ClientSelectWrapper';
import ServiceSelectWrapper from './ServiceSelectWrapper';
import DateTimeSelectWrapper from './DateTimeSelectWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const appointmentSchema = z.object({
  serviceId: z.string({
    required_error: "Por favor selecione um serviço",
  }).min(1, "Serviço é obrigatório"),
  professionalId: z.string({
    required_error: "Por favor selecione um profissional",
  }).min(1, "Profissional é obrigatório"),
  clientId: z.string({
    required_error: "Por favor selecione um cliente",
  }).min(1, "Cliente é obrigatório"),
  date: z.date({
    required_error: "Por favor selecione uma data",
  }),
  time: z.string({
    required_error: "Por favor selecione um horário",
  }).min(1, "Horário é obrigatório"),
  notes: z.string().optional(),
  status: z.string().optional(),
  duration: z.number().min(1, "Duração deve ser maior que 0").optional(),
  price: z.number().min(0, "Preço não pode ser negativo").optional(),
  paymentMethod: z.string().optional(),
  notifications: z.boolean().optional(),
  reminderSent: z.boolean().optional(),
  rating: z.number().optional(),
  feedbackComment: z.string().optional(),
  termsAccepted: z.boolean().optional(),
});

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<AppointmentFormValues>;
  isSubmitting?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false
}) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      professionalId: '',
      serviceId: '',
      clientId: '',
      notifications: true,
      status: 'agendado',
      paymentMethod: 'dinheiro',
      ...initialData,
    },
  });

  const handleSubmit = (data: AppointmentFormValues) => {
    console.log('Submitting appointment data:', data);
    onSubmit(data);
  };

  const selectedService = form.watch('serviceId');
  const selectedProfessional = form.watch('professionalId');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Cliente Selection */}
            <ClientSelectWrapper form={form} />
            
            {/* Serviço Selection */}
            <ServiceSelectWrapper form={form} />
            
            {/* Profissional Selection */}
            <ProfessionalSelectWrapper 
              form={form}
              serviceId={selectedService}
            />
            
            {/* Data e Hora Selection */}
            <DateTimeSelectWrapper 
              form={form}
              professionalId={selectedProfessional}
            />

            {/* Método de Pagamento */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="debito">Débito</SelectItem>
                      <SelectItem value="credito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre o agendamento..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar Agendamento'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
