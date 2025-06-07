
import React, { useState, useEffect } from 'react';
import { CalendarView } from './calendar/CalendarView';
import { useAppointments } from '@/hooks/useAppointments';
import { TestDataHelper } from './TestDataHelper';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface AppointmentCalendarProps {
  initialView?: 'month' | 'week';
}

export function AppointmentCalendar({ initialView = 'month' }: AppointmentCalendarProps) {
  const { appointments, isLoading, error, refetch } = useAppointments();
  const [showTestHelper, setShowTestHelper] = useState(false);

  // Show test helper if no appointments exist
  useEffect(() => {
    if (!isLoading && appointments.length === 0) {
      setShowTestHelper(true);
    } else {
      setShowTestHelper(false);
    }
  }, [appointments, isLoading]);

  console.log('AppointmentCalendar - appointments:', appointments.length);
  console.log('AppointmentCalendar - isLoading:', isLoading);
  console.log('AppointmentCalendar - error:', error);

  const handleNewAppointment = () => {
    console.log('New appointment requested');
  };

  const handleSelectAppointment = (appointment: any) => {
    console.log('Selected appointment:', appointment);
  };

  const handleTestDataCreated = () => {
    console.log('Test data created, refreshing appointments...');
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando calendário...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar agendamentos: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="bg-gray-50 p-3 rounded-md text-sm">
        <strong>Debug Info:</strong> {appointments.length} agendamentos carregados
        {appointments.length > 0 && (
          <div className="mt-1 text-xs text-gray-600">
            Status encontrados: {[...new Set(appointments.map(apt => apt.status))].join(', ')}
          </div>
        )}
      </div>

      {/* Test Data Helper */}
      {showTestHelper && (
        <TestDataHelper onDataCreated={handleTestDataCreated} />
      )}

      {/* No appointments message */}
      {appointments.length === 0 && !showTestHelper && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Nenhum agendamento encontrado. Os indicadores aparecerão quando houver agendamentos cadastrados.
          </AlertDescription>
        </Alert>
      )}

      {/* Calendar */}
      <CalendarView
        appointments={appointments}
        onNewAppointment={handleNewAppointment}
        onSelectAppointment={handleSelectAppointment}
      />
    </div>
  );
}
