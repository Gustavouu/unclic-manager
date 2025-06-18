
import React, { useState } from 'react';
import { CalendarView } from './calendar/CalendarView';
import { AppointmentDetailsDialog } from './dialogs/AppointmentDetailsDialog';
import { useUnifiedAppointments } from '@/hooks/useUnifiedAppointments';
import { UnifiedAppointment, normalizeStatus } from '@/types/appointment-unified';
import { Appointment } from './types';
import { CalendarViewType } from '@/types/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface AppointmentCalendarStandardizedProps {
  initialView?: CalendarViewType;
}

export const AppointmentCalendarStandardized: React.FC<AppointmentCalendarStandardizedProps> = ({ 
  initialView = 'month' 
}) => {
  const { appointments, isLoading, error, updateAppointment } = useUnifiedAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<UnifiedAppointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Convert UnifiedAppointment to Appointment format for calendar compatibility
  const calendarAppointments: Appointment[] = appointments.map(apt => ({
    id: apt.id,
    clientId: apt.client_id,
    clientName: apt.client_name || 'Cliente',
    serviceId: apt.service_id,
    serviceName: apt.service_name || 'Serviço',
    serviceType: apt.service_type || 'general',
    professionalId: apt.professional_id,
    professionalName: apt.professional_name || 'Profissional',
    date: typeof apt.date === 'string' ? new Date(apt.date) : apt.date,
    duration: apt.duration,
    price: apt.price,
    status: normalizeStatus(apt.status) as any,
    notes: apt.notes || '',
    paymentMethod: apt.payment_method,
    businessId: apt.business_id
  }));

  const handleSelectAppointment = (appointment: Appointment) => {
    // Find the original unified appointment
    const unifiedAppointment = appointments.find(apt => apt.id === appointment.id);
    if (unifiedAppointment) {
      setSelectedAppointment(unifiedAppointment);
      setShowDetailsDialog(true);
    }
  };

  const handleNewAppointment = () => {
    console.log('Novo agendamento');
  };

  const handleEditAppointment = (unifiedAppointment: UnifiedAppointment) => {
    console.log('Editar agendamento:', unifiedAppointment.id);
    setShowDetailsDialog(false);
  };

  const handleCancelAppointment = async (unifiedAppointment: UnifiedAppointment) => {
    try {
      await updateAppointment(unifiedAppointment.id, { status: 'canceled' });
      setShowDetailsDialog(false);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    }
  };

  // Create wrapper functions that convert between types
  const handleEditAppointmentWrapper = (appointment: Appointment) => {
    const unifiedAppointment = appointments.find(apt => apt.id === appointment.id);
    if (unifiedAppointment) {
      handleEditAppointment(unifiedAppointment);
    }
  };

  const handleCancelAppointmentWrapper = (appointment: Appointment) => {
    const unifiedAppointment = appointments.find(apt => apt.id === appointment.id);
    if (unifiedAppointment) {
      handleCancelAppointment(unifiedAppointment);
    }
  };

  // Convert UnifiedAppointment to Appointment for the dialog
  const selectedAppointmentForDialog: Appointment | null = selectedAppointment ? {
    id: selectedAppointment.id,
    clientId: selectedAppointment.client_id,
    clientName: selectedAppointment.client_name || 'Cliente',
    serviceId: selectedAppointment.service_id,
    serviceName: selectedAppointment.service_name || 'Serviço',
    serviceType: selectedAppointment.service_type || 'general',
    professionalId: selectedAppointment.professional_id,
    professionalName: selectedAppointment.professional_name || 'Profissional',
    date: typeof selectedAppointment.date === 'string' ? new Date(selectedAppointment.date) : selectedAppointment.date,
    duration: selectedAppointment.duration,
    price: selectedAppointment.price,
    status: normalizeStatus(selectedAppointment.status) as any,
    notes: selectedAppointment.notes || '',
    paymentMethod: selectedAppointment.payment_method,
    businessId: selectedAppointment.business_id
  } : null;

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
        appointments={calendarAppointments}
        onNewAppointment={handleNewAppointment}
        onSelectAppointment={handleSelectAppointment}
      />

      <AppointmentDetailsDialog
        appointment={selectedAppointmentForDialog}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        onEdit={handleEditAppointmentWrapper}
        onCancel={handleCancelAppointmentWrapper}
      />
    </div>
  );
};
