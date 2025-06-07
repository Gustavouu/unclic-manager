import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UnifiedAppointment } from '@/types/appointment-unified';

interface CalendarGridProps {
  calendarDays: (Date | null)[];
  appointments: UnifiedAppointment[];
  selectedDate: Date;
  onSelectDay: (day: Date) => void;
  onSelectAppointment: (appointment: UnifiedAppointment) => void;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getStatusColor = (status: string): string => {
  console.log('Getting color for status:', status);
  
  // Normalize status to handle both Portuguese and English
  const normalizedStatus = status?.toLowerCase().trim();
  
  const statusColors: Record<string, string> = {
    // Portuguese statuses
    'agendado': 'bg-blue-500',
    'confirmado': 'bg-green-500', 
    'concluido': 'bg-emerald-500',
    'cancelado': 'bg-red-500',
    'faltou': 'bg-gray-500',
    'pendente': 'bg-yellow-500',
    // English statuses
    'scheduled': 'bg-blue-500',
    'confirmed': 'bg-green-500',
    'completed': 'bg-emerald-500',
    'canceled': 'bg-red-500',
    'cancelled': 'bg-red-500',
    'no_show': 'bg-gray-500',
    'pending': 'bg-yellow-500'
  };
  
  return statusColors[normalizedStatus] || 'bg-blue-500'; // Default color
};

const getStatusLabel = (status: string): string => {
  const normalizedStatus = status?.toLowerCase().trim();
  
  const statusLabels: Record<string, string> = {
    // Portuguese statuses
    'agendado': 'Agendado',
    'confirmado': 'Confirmado', 
    'concluido': 'Concluído',
    'cancelado': 'Cancelado',
    'faltou': 'Faltou',
    'pendente': 'Pendente',
    // English statuses
    'scheduled': 'Agendado',
    'confirmed': 'Confirmado',
    'completed': 'Concluído',
    'canceled': 'Cancelado',
    'cancelled': 'Cancelado',
    'no_show': 'Faltou',
    'pending': 'Pendente'
  };
  
  return statusLabels[normalizedStatus] || status;
};

export function CalendarGrid({ 
  calendarDays, 
  appointments, 
  selectedDate, 
  onSelectDay, 
  onSelectAppointment 
}: CalendarGridProps) {
  console.log('CalendarGrid rendering with appointments:', appointments.length);
  
  const getAppointmentsForDay = (day: Date) => {
    const dayAppointments = appointments.filter(appointment => {
      let appointmentDate: Date;
      
      // Handle different date formats
      if (appointment.date instanceof Date) {
        appointmentDate = appointment.date;
      } else if (typeof appointment.date === 'string') {
        appointmentDate = parseISO(appointment.date);
      } else {
        console.warn('Invalid appointment date format:', appointment.date);
        return false;
      }
      
      const isSame = isSameDay(appointmentDate, day);
      if (isSame) {
        console.log(`Found appointment for ${format(day, 'yyyy-MM-dd')}:`, appointment);
      }
      return isSame;
    });
    
    console.log(`Appointments for ${format(day, 'yyyy-MM-dd')}:`, dayAppointments.length);
    return dayAppointments;
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Header com dias da semana */}
      <div className="grid grid-cols-7 gap-0 border-b">
        {weekDays.map((day, index) => (
          <div key={index} className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-32 border-r border-b last:border-r-0"></div>;
          }

          const dayAppointments = getAppointmentsForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={cn(
                "h-32 border-r border-b last:border-r-0 p-2 cursor-pointer hover:bg-gray-50 relative",
                isSelected && "bg-blue-50",
                isToday && "bg-yellow-50"
              )}
              onClick={() => onSelectDay(day)}
            >
              {/* Número do dia */}
              <div className={cn(
                "text-sm font-medium mb-1",
                isToday && "text-blue-600 font-bold",
                isSelected && "text-blue-800"
              )}>
                {format(day, 'd')}
              </div>

              {/* Indicadores de agendamentos */}
              <div className="space-y-1">
                {dayAppointments.length > 0 && (
                  <>
                    {/* Contador de agendamentos */}
                    <div className="text-xs text-gray-600 mb-1">
                      {dayAppointments.length} agendamento{dayAppointments.length > 1 ? 's' : ''}
                    </div>

                    {/* Mostrar até 3 agendamentos */}
                    {dayAppointments.slice(0, 3).map((appointment, idx) => (
                      <div
                        key={appointment.id}
                        className="text-xs truncate cursor-pointer hover:bg-white p-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAppointment(appointment);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div 
                            className={cn(
                              "w-2 h-2 rounded-full flex-shrink-0",
                              getStatusColor(appointment.status)
                            )}
                          />
                          <span className="truncate">
                            {appointment.time} - {appointment.client_name}
                          </span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs mt-1 h-4"
                        >
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                    ))}

                    {/* Indicador de mais agendamentos */}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 3} mais
                      </div>
                    )}
                  </>
                )}

                {/* Indicador visual quando há agendamentos mas não há espaço */}
                {dayAppointments.length > 0 && (
                  <div className="absolute bottom-1 right-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      dayAppointments.some(apt => apt.status === 'agendado' || apt.status === 'scheduled') ? 'bg-blue-500' :
                      dayAppointments.some(apt => apt.status === 'confirmado' || apt.status === 'confirmed') ? 'bg-green-500' :
                      dayAppointments.some(apt => apt.status === 'concluido' || apt.status === 'completed') ? 'bg-emerald-500' :
                      'bg-gray-500'
                    )} />
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
