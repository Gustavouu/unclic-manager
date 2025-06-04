
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AppointmentFormValues } from '@/types/appointments';
import ProfessionalSelectWrapper from './ProfessionalSelectWrapper';

const appointmentSchema = z.object({
  serviceId: z.string().optional(),
  professionalId: z.string({
    required_error: "Por favor selecione um profissional",
  }),
  clientId: z.string().optional(),
  date: z.date().optional(),
  time: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  duration: z.number().optional(),
  price: z.number().optional(),
  paymentMethod: z.string().optional(),
  notifications: z.boolean().optional(),
  reminderSent: z.boolean().optional(),
  rating: z.number().optional(),
  feedbackComment: z.string().optional(),
  termsAccepted: z.boolean().optional(),
});

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => void;
  initialData?: Partial<AppointmentFormValues>;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  initialData
}) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      professionalId: '',
      serviceId: '',
      clientId: '',
      notifications: true,
      ...initialData,
    },
  });

  const handleSubmit = (data: AppointmentFormValues) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ProfessionalSelectWrapper 
              form={form}
              serviceId={form.watch('serviceId')}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="submit">
                Criar Agendamento
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
