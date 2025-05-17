
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppointmentFormValues } from '../schemas/appointmentFormSchema';
import AppointmentForm from './AppointmentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard } from 'lucide-react';
import NotificationOptions from './NotificationsOptions';

interface PaymentRequiredAppointmentFormProps {
  form: UseFormReturn<AppointmentFormValues>;
  onSubmit: (values: AppointmentFormValues) => void;
  isSubmitting?: boolean;
}

const PaymentRequiredAppointmentForm = ({ form, onSubmit, isSubmitting }: PaymentRequiredAppointmentFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <CreditCard className="h-4 w-4" />
          <AlertTitle>Pré-pagamento requerido</AlertTitle>
          <AlertDescription>
            Este serviço requer um pré-pagamento para confirmar o agendamento.
          </AlertDescription>
        </Alert>
        
        <AppointmentForm 
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentRequiredAppointmentForm;
