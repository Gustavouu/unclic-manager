
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImprovedAppointmentForm } from './form/ImprovedAppointmentForm';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { toast } from 'sonner';
import { AppointmentFormValues } from './schemas/appointmentFormSchema';
import { CreateAppointmentData, AppointmentStatus } from '@/hooks/appointments/types';
import { useServices } from '@/hooks/useServices';
import { useProfessionals } from '@/hooks/professionals/useProfessionals';

interface NewAppointmentDialogImprovedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAppointmentDialogImproved({
  open,
  onOpenChange,
}: NewAppointmentDialogImprovedProps) {
  const { createAppointment } = useAppointments();
  const { services } = useServices();
  const { professionals } = useProfessionals();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AppointmentFormValues) => {
    try {
      setIsSubmitting(true);
      
      console.log('Form data received:', data);

      // Find the selected service and professional for additional data
      const service = services.find(s => s.id === data.serviceId);
      const professional = professionals.find(p => p.id === data.professionalId);
      
      if (!service) {
        toast.error('Serviço não encontrado');
        return;
      }
      
      if (!professional) {
        toast.error('Profissional não encontrado');
        return;
      }
      
      // Combine date and time into a Date object
      const appointmentDate = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Calculate end time
      const endTime = new Date(appointmentDate.getTime() + (data.duration || service.duration || 60) * 60000);
      const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Ensure status is properly typed as AppointmentStatus
      const appointmentStatus: AppointmentStatus = (data.status as AppointmentStatus) || 'scheduled';
      
      const appointmentData: CreateAppointmentData = {
        clientId: data.clientId,
        serviceId: data.serviceId,
        professionalId: data.professionalId,
        date: appointmentDate,
        time: data.time,
        endTime: endTimeString,
        duration: data.duration || service.duration || 60,
        price: data.price || service.price || 0,
        status: appointmentStatus,
        paymentMethod: data.paymentMethod || 'cash',
        notes: data.notes || '',
        // Additional data for better UX
        serviceName: service.name,
        professionalName: professional.name,
        clientName: 'Cliente', // This would be fetched from the client data
      };
      
      console.log('Creating appointment with data:', appointmentData);
      
      await createAppointment(appointmentData);
      
      toast.success('Agendamento criado com sucesso!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <ImprovedAppointmentForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            title=""
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
