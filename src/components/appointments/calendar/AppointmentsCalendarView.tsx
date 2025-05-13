
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentType } from './types';
import { Badge } from '@/components/ui/badge';

interface AppointmentsCalendarViewProps {
  appointments: AppointmentType[];
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function AppointmentsCalendarView({
  appointments,
  date,
  onDateChange,
}: AppointmentsCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  
  // Get appointments for the selected date
  const selectedDateAppointments = selectedDate ? 
    appointments.filter(appointment => isSameDay(appointment.date, selectedDate)) : 
    [];
  
  // Custom day renderer to show appointments count
  const renderDay = (day: Date) => {
    const dayAppointments = appointments.filter(appointment => 
      isSameDay(appointment.date, day)
    );
    
    if (dayAppointments.length === 0) return null;
    
    return (
      <Badge
        className="absolute bottom-1 right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px]"
        variant="default"
      >
        {dayAppointments.length}
      </Badge>
    );
  };
  
  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={ptBR}
          className="rounded-md border w-full"
          components={{
            DayContent: (props) => (
              <div className="relative flex items-center justify-center h-full w-full">
                {props.date.getDate()}
                {renderDay(props.date)}
              </div>
            ),
          }}
        />
      </div>
      <div className="md:w-1/2 p-4 border-t md:border-t-0 md:border-l">
        <h3 className="font-medium mb-4">
          {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
        </h3>
        
        {selectedDateAppointments.length === 0 ? (
          <p className="text-muted-foreground">Nenhum agendamento para esta data.</p>
        ) : (
          <div className="space-y-4">
            {selectedDateAppointments.map(appointment => (
              <div 
                key={appointment.id}
                className="p-4 border rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{appointment.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(appointment.date, 'HH:mm', { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.duration} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
