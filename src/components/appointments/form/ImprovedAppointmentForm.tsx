
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { appointmentFormSchema, AppointmentFormValues } from '../schemas/appointmentFormSchema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import ClientSelectWrapper from './ClientSelectWrapper';
import ServiceSelectWrapper from './ServiceSelectWrapper';
import ProfessionalSelectWrapper from './ProfessionalSelectWrapper';
import DateTimeSelectWrapper from './DateTimeSelectWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImprovedAppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<AppointmentFormValues>;
  isSubmitting?: boolean;
  title?: string;
}

export const ImprovedAppointmentForm: React.FC<ImprovedAppointmentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  title = "Novo Agendamento"
}) => {
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      professionalId: '',
      serviceId: '',
      clientId: '',
      notifications: true,
      status: 'scheduled',
      paymentMethod: 'dinheiro',
      notes: '',
      ...initialData,
    },
  });

  const handleSubmit = (data: AppointmentFormValues) => {
    console.log('Submitting appointment data:', data);
    setFormErrors([]);
    
    // Additional validation
    const errors: string[] = [];
    
    if (!data.clientId) {
      errors.push('Cliente é obrigatório');
    }
    
    if (!data.serviceId) {
      errors.push('Serviço é obrigatório');
    }
    
    if (!data.professionalId) {
      errors.push('Profissional é obrigatório');
    }
    
    if (!data.date) {
      errors.push('Data é obrigatória');
    }
    
    if (!data.time) {
      errors.push('Horário é obrigatório');
    }
    
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onSubmit(data);
  };

  const selectedService = form.watch('serviceId');
  const selectedProfessional = form.watch('professionalId');
  const selectedClient = form.watch('clientId');

  const isFormValid = selectedClient && selectedService && selectedProfessional;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {isFormValid && <CheckCircle className="h-5 w-5 text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Error Alert */}
            {formErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Progress Indicator */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-4">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${selectedClient ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedClient ? 'bg-green-600' : 'bg-gray-300'}`} />
                  Cliente
                </div>
                <div className={`flex items-center gap-2 ${selectedService ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedService ? 'bg-green-600' : 'bg-gray-300'}`} />
                  Serviço
                </div>
                <div className={`flex items-center gap-2 ${selectedProfessional ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedProfessional ? 'bg-green-600' : 'bg-gray-300'}`} />
                  Profissional
                </div>
              </div>
            </div>

            {/* Cliente Selection */}
            <div className="space-y-2">
              <ClientSelectWrapper form={form} />
            </div>
            
            {/* Serviço Selection */}
            <div className="space-y-2">
              <ServiceSelectWrapper form={form} />
            </div>
            
            {/* Profissional Selection */}
            <div className="space-y-2">
              <ProfessionalSelectWrapper 
                form={form}
                serviceId={selectedService}
              />
            </div>
            
            {/* Data e Hora Selection */}
            <div className="space-y-2">
              <DateTimeSelectWrapper 
                form={form}
                professionalId={selectedProfessional}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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
            </div>

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
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
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
                disabled={isSubmitting || !isFormValid}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Agendamento'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
