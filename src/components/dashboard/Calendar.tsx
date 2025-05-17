
import { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { format, parseISO, isEqual } from 'date-fns';

interface Appointment {
  id: string;
  data: string;
  hora_inicio: string;
  status: string;
  nome_cliente?: string;
  client_name?: string;
}

export function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);
  const { businessId } = useTenant();

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!businessId) return;

      try {
        // First try the modern appointments table
        let { data: modernData, error: modernError } = await supabase
          .from('bookings')
          .select(`
            id, 
            status, 
            booking_date,
            start_time,
            clients:client_id (name)
          `)
          .eq('business_id', businessId)
          .order('booking_date', { ascending: true });

        if (modernError || !modernData || modernData.length === 0) {
          // Try legacy table
          console.log('Trying legacy appointments table');
          const { data: legacyData, error: legacyError } = await supabase
            .from('agendamentos')
            .select(`
              id, 
              data, 
              hora_inicio, 
              status,
              clientes:id_cliente (nome)
            `)
            .eq('id_negocio', businessId);

          if (legacyError) {
            console.error('Error fetching appointments:', legacyError);
            setAppointments([]);
            return;
          }

          if (legacyData && legacyData.length > 0) {
            // Map legacy data
            const mappedAppointments: Appointment[] = legacyData.map(app => ({
              id: app.id,
              data: app.data,
              hora_inicio: app.hora_inicio,
              status: app.status,
              nome_cliente: app.clientes?.nome
            }));
            setAppointments(mappedAppointments);
          } else {
            setAppointments([]);
          }
        } else {
          // Map modern data
          const mappedAppointments: Appointment[] = modernData.map(app => ({
            id: app.id,
            data: app.booking_date,
            hora_inicio: app.start_time,
            status: app.status,
            client_name: app.clients?.name
          }));
          setAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, [businessId]);

  // Filter appointments for selected day
  useEffect(() => {
    if (!date || !appointments.length) {
      setSelectedDayAppointments([]);
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    const filteredAppointments = appointments.filter(appointment => {
      return appointment.data === formattedDate;
    });

    setSelectedDayAppointments(filteredAppointments);
  }, [date, appointments]);

  // Get days with appointments for highlighting
  const getDaysWithAppointments = () => {
    if (!appointments.length) return [];
    
    return appointments.map(appointment => {
      try {
        return parseISO(appointment.data);
      } catch (e) {
        console.error('Invalid date format:', appointment.data);
        return null;
      }
    }).filter(Boolean) as Date[];
  };

  // Custom day renderer for the calendar
  const renderDay = (day: Date, selectedDate: Date) => {
    const isAppointmentDay = getDaysWithAppointments().some(appDay => 
      appDay && isEqual(new Date(appDay.setHours(0, 0, 0, 0)), new Date(day.setHours(0, 0, 0, 0)))
    );
    
    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {isAppointmentDay && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  return (
    <Card className="col-span-1 row-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Agenda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate || new Date())}
          className="rounded-md border"
          components={{
            Day: ({ day, selectedDate }) => renderDay(day, selectedDate)
          }}
        />

        <div className="space-y-2 mt-4">
          <h3 className="font-medium text-sm">Agendamentos do dia</h3>
          {selectedDayAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum agendamento para este dia.</p>
          ) : (
            selectedDayAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-md p-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {appointment.client_name || appointment.nome_cliente || "Cliente"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {appointment.hora_inicio}
                  </div>
                </div>
                <div className="text-xs">
                  <span className={`inline-block px-1 rounded ${
                    appointment.status === 'completed' || appointment.status === 'concluido' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'canceled' || appointment.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
