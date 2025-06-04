
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, MoreVertical } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  clientAvatar?: string;
  serviceName: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  phone?: string;
  isToday?: boolean;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'João Silva',
    serviceName: 'Corte de Cabelo',
    time: '09:00',
    duration: 45,
    status: 'confirmed',
    phone: '(11) 99999-9999',
    isToday: true
  },
  {
    id: '2',
    clientName: 'Maria Santos',
    serviceName: 'Coloração',
    time: '10:30',
    duration: 120,
    status: 'scheduled',
    phone: '(11) 88888-8888',
    isToday: true
  },
  {
    id: '3',
    clientName: 'Pedro Costa',
    serviceName: 'Barba',
    time: '14:00',
    duration: 30,
    status: 'in-progress',
    phone: '(11) 77777-7777',
    isToday: true
  },
  {
    id: '4',
    clientName: 'Ana Oliveira',
    serviceName: 'Sobrancelha',
    time: '15:15',
    duration: 30,
    status: 'scheduled',
    phone: '(11) 66666-6666',
    isToday: true
  },
  {
    id: '5',
    clientName: 'Carlos Lima',
    serviceName: 'Corte + Barba',
    time: '16:30',
    duration: 60,
    status: 'scheduled',
    phone: '(11) 55555-5555',
    isToday: true
  }
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: any; label: string; color: string }> = {
    scheduled: { variant: 'secondary', label: 'Agendado', color: 'text-gray-600' },
    confirmed: { variant: 'default', label: 'Confirmado', color: 'text-blue-600' },
    'in-progress': { variant: 'default', label: 'Em Andamento', color: 'text-green-600' },
    completed: { variant: 'default', label: 'Concluído', color: 'text-emerald-600' },
    cancelled: { variant: 'destructive', label: 'Cancelado', color: 'text-red-600' }
  };

  const config = variants[status] || variants.scheduled;
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
};

export const RecentAppointments: React.FC = () => {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Agendamentos de Hoje</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            {mockAppointments.length} agendamentos programados
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Ver Agenda
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={appointment.clientAvatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {appointment.clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {appointment.clientName}
                    </p>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {appointment.serviceName}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointment.time} ({appointment.duration}min)
                    </div>
                    {appointment.phone && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {appointment.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {appointment.status === 'scheduled' && (
                  <Button size="sm" variant="outline" className="text-xs">
                    Confirmar
                  </Button>
                )}
                {appointment.status === 'confirmed' && (
                  <Button size="sm" className="text-xs">
                    Iniciar
                  </Button>
                )}
                {appointment.status === 'in-progress' && (
                  <Button size="sm" variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                    Finalizar
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900">
            Ver todos os agendamentos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
