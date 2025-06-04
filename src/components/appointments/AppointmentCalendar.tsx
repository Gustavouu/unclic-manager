
import React, { useState } from 'react';
import { CalendarView } from './calendar/CalendarView';
import { AppointmentDetailsDialog } from './dialogs/AppointmentDetailsDialog';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment } from '@/types/appointment';
import { CalendarViewType } from '@/types/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface AppointmentCalendarProps {
  initialView?: CalendarViewType;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  initialView = 'month' 
}) => {
  const { appointments, isLoading, error, updateAppointment } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };

  const handleNewAppointment = () => {
    // Esta função será chamada quando o usuário clicar em "Novo Agendamento"
    // Por enquanto, apenas um log - pode ser conectado ao dialog de novo agendamento
    console.log('Novo agendamento');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Função para editar agendamento
    console.log('Editar agendamento:', appointment.id);
    setShowDetailsDialog(false);
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
      await updateAppointment(appointment.id, { status: 'canceled' });
      setShowDetailsDialog(false);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar agendamentos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-full">
      <CalendarView
        appointments={appointments}
        onNewAppointment={handleNewAppointment}
        onSelectAppointment={handleSelectAppointment}
      />

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        onEdit={handleEditAppointment}
        onCancel={handleCancelAppointment}
      />
    </div>
  );
};
