
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'pending';
}

interface NextAppointmentsProps {
  appointments?: Appointment[];
}

export const NextAppointments: React.FC<NextAppointmentsProps> = ({ 
  appointments = [
    { id: '1', clientName: 'João Silva', serviceName: 'Corte de Cabelo', time: '14:00', status: 'confirmed' },
    { id: '2', clientName: 'Maria Santos', serviceName: 'Manicure', time: '15:30', status: 'scheduled' },
    { id: '3', clientName: 'Pedro Costa', serviceName: 'Barba', time: '16:00', status: 'pending' },
    { id: '4', clientName: 'Ana Oliveira', serviceName: 'Coloração', time: '17:00', status: 'confirmed' },
  ]
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'scheduled':
        return 'Agendado';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{appointment.clientName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.serviceName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{appointment.time}</span>
                  </div>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </Badge>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum agendamento para hoje</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
