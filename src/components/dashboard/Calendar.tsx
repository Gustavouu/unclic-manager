
import { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { format, parseISO, isEqual } from 'date-fns';
import { DayClickEventHandler } from 'react-day-picker';

export interface AppointmentType {
  id: string;
  date: string;
  startTime: string;
  status: string;
  clientName: string;
  serviceName?: string;
}

interface DayComponentProps {
  date: Date;
  displayMonth: Date;
  [key: string]: any;
}

export function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<AppointmentType[]>([]);
  const { businessId } = useCurrentBusiness();

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!businessId) return;

      try {
        console.log('Fetching calendar appointments for business:', businessId);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id, 
            status, 
            booking_date,
            start_time,
            clients:client_id (name),
            services:service_id (name)
          `)
          .eq('business_id', businessId)
          .order('booking_date', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          setAppointments([]);
          return;
        }

        if (data && data.length > 0) {
          const mappedAppointments: AppointmentType[] = data.map((app: any) => ({
            id: app.id,
            date: app.booking_date,
            startTime: app.start_time,
            status: app.status,
            clientName: app.clients?.name ?? "Cliente",
            serviceName: app.services?.name ?? "Serviço"
          }));
          setAppointments(mappedAppointments);
        } else {
          setAppointments([]);
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
      return appointment.date === formattedDate;
    });

    setSelectedDayAppointments(filteredAppointments);
  }, [date, appointments]);

  // Get days with appointments for highlighting
  const getDaysWithAppointments = () => {
    if (!appointments.length) return [];
    
    return appointments.map(appointment => {
      try {
        return parseISO(appointment.date);
      } catch (e) {
        console.error('Invalid date format:', appointment.date);
        return null;
      }
    }).filter(Boolean) as Date[];
  };

  // Custom day renderer for the calendar
  const renderDay = (props: DayComponentProps) => {
    const { date } = props;
    
    const isAppointmentDay = getDaysWithAppointments().some(appDay => 
      appDay && isEqual(new Date(appDay.setHours(0, 0, 0, 0)), new Date(date.setHours(0, 0, 0, 0)))
    );
    
    return (
      <div className="relative">
        <div>{date.getDate()}</div>
        {isAppointmentDay && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  const handleSelectDay: DayClickEventHandler = (day) => {
    setDate(day);
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
            Day: renderDay as any
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
                    {appointment.clientName || "Cliente"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {appointment.startTime}
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
