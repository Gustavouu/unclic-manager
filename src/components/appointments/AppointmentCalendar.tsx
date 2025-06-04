
import React, { useState } from 'react';
import { CalendarView } from './calendar/CalendarView';
import { AppointmentDetailsDialog } from './dialogs/AppointmentDetailsDialog';
import { useAppointments } from '@/hooks/useAppointments';
import { UnifiedAppointment, normalizeStatus } from '@/types/appointment-unified';
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
  const [selectedAppointment, setSelectedAppointment] = useState<UnifiedAppointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Convert appointments to unified format
  const unifiedAppointments: UnifiedAppointment[] = appointments.map(apt => ({
    ...apt,
    // Ensure legacy compatibility fields
    clientId: apt.client_id,
    clientName: apt.client_name || 'Cliente',
    serviceId: apt.service_id, 
    serviceName: apt.service_name || 'Serviço',
    professionalId: apt.professional_id,
    professionalName: apt.professional_name || 'Profissional',
    // Normalize date if needed
    date: typeof apt.date === 'string' ? new Date(apt.date) : apt.date
  }));

  const handleSelectAppointment = (appointment: UnifiedAppointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };

  const handleNewAppointment = () => {
    console.log('Novo agendamento');
  };

  const handleEditAppointment = (appointment: UnifiedAppointment) => {
    console.log('Editar agendamento:', appointment.id);
    setShowDetailsDialog(false);
  };

  const handleCancelAppointment = async (appointment: UnifiedAppointment) => {
    try {
      await updateAppointment(appointment.id, { status: normalizeStatus('cancelado') });
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
        appointments={unifiedAppointments}
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
