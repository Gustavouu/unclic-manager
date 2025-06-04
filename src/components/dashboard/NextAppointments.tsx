
import React from 'react';
import { Clock, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  status: string;
}

interface NextAppointmentsProps {
  appointments: Appointment[];
}

export function NextAppointments({ appointments }: NextAppointmentsProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mb-2 opacity-20" />
        <p>Nenhum agendamento próximo</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'agendado':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'aguardando':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dateLabel = '';
      if (date.toDateString() === today.toDateString()) {
        dateLabel = 'Hoje';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        dateLabel = 'Amanhã';
      } else {
        dateLabel = date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
      }

      const timeLabel = date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      return { dateLabel, timeLabel };
    } catch (error) {
      return { dateLabel: 'Data inválida', timeLabel: '' };
    }
  };

  return (
    <div className="space-y-3">
      {appointments.slice(0, 5).map((appointment) => {
        const { dateLabel, timeLabel } = formatDateTime(appointment.date);
        
        return (
          <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-sm text-gray-900 truncate">
                  {appointment.clientName}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 mb-1">
                {appointment.serviceName}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{dateLabel} às {timeLabel}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getStatusColor(appointment.status)}`}
              >
                {appointment.status}
              </Badge>
              <span className="text-xs text-gray-500 truncate max-w-20">
                {appointment.professionalName}
              </span>
            </div>
          </div>
        );
      })}
      
      {appointments.length > 5 && (
        <div className="text-center pt-2">
          <span className="text-sm text-gray-500">
            +{appointments.length - 5} agendamentos adicionais
          </span>
        </div>
      )}
    </div>
  );
}
