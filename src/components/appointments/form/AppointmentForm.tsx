
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppointmentFormValues } from '../schemas/appointmentFormSchema';
import DateTimeSelectWrapper from './DateTimeSelectWrapper';
import ServiceSelectWrapper from './ServiceSelectWrapper';
import ProfessionalSelectWrapper from './ProfessionalSelectWrapper';
import ClientSelectWrapper from './ClientSelectWrapper';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import NotificationOptions from './NotificationsOptions';
import { useTenant } from '@/contexts/TenantContext';

interface AppointmentFormProps {
  form: UseFormReturn<AppointmentFormValues>;
  onSubmit: (values: AppointmentFormValues) => void;
  isSubmitting?: boolean;
  className?: string;
}

const AppointmentForm = ({ form, onSubmit, isSubmitting = false, className }: AppointmentFormProps) => {
  const { businessId } = useTenant();
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Selection */}
        <ServiceSelectWrapper form={form} />
        
        {/* Professional Selection */}
        <ProfessionalSelectWrapper 
          form={form}
          serviceId={form.watch('serviceId')}
        />
        
        {/* Client Selection */}
        <ClientSelectWrapper form={form} />
        
        {/* Date and Time Selection */}
        <DateTimeSelectWrapper 
          form={form}
          serviceId={form.watch('serviceId')}
          professionalId={form.watch('professionalId')}
        />
      </div>
      
      {/* Notes */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Adicione observações importantes sobre o agendamento..." 
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Notification Options */}
      <div>
        <h3 className="text-sm font-medium mb-2">Notificações</h3>
        {businessId && <NotificationOptions businessId={businessId} />}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Agendamento"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
