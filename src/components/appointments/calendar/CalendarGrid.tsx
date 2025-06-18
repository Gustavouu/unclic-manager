
import React from 'react';
import { format, isSameDay, isToday, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Appointment } from '@/hooks/appointments/types';

interface CalendarGridProps {
  calendarDays: (Date | null)[];
  appointments: Appointment[];
  selectedDate: Date;
  onSelectDay: (day: Date) => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

export function CalendarGrid({ 
  calendarDays, 
  appointments, 
  selectedDate, 
  onSelectDay, 
  onSelectAppointment 
}: CalendarGridProps) {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, day));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-500';
      case 'confirmado':
        return 'bg-green-500';
      case 'concluido':
        return 'bg-emerald-500';
      case 'cancelado':
        return 'bg-red-500';
      case 'faltou':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Header dos dias da semana */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-24 border-r border-b" />;
          }

          const dayAppointments = getAppointmentsForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isPastDate = isPast(day) && !isTodayDate;

          return (
            <div 
              key={day.toISOString()}
              className={cn(
                "h-24 border-r border-b p-1 cursor-pointer hover:bg-gray-50 transition-colors",
                isSelected && "bg-blue-50 border-blue-200",
                isTodayDate && "bg-yellow-50"
              )}
              onClick={() => onSelectDay(day)}
            >
              <div className={cn(
                "text-sm font-medium mb-1",
                isTodayDate && "text-blue-600 font-bold",
                isPastDate && "text-gray-400",
                isSelected && "text-blue-600"
              )}>
                {format(day, 'd')}
              </div>

              {/* Lista de agendamentos do dia */}
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((appointment, idx) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      "text-xs px-1 py-0.5 rounded text-white cursor-pointer hover:opacity-80 truncate",
                      getStatusColor(appointment.status)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAppointment(appointment);
                    }}
                    title={`${appointment.clientName} - ${appointment.serviceName}`}
                  >
                    {format(appointment.date, 'HH:mm')} {appointment.clientName}
                  </div>
                ))}
                
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayAppointments.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
