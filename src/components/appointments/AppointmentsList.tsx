
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, DollarSign, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, AppointmentStatus } from './types';
import { useAppointments } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';

const statusConfig = {
  scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-800' },
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
  canceled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  no_show: { label: 'Faltou', color: 'bg-yellow-100 text-yellow-800' },
};

interface AppointmentsListProps {
  appointments?: Appointment[];
  showActions?: boolean;
  onEditAppointment?: (appointment: Appointment) => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments: propAppointments,
  showActions = true,
  onEditAppointment,
}) => {
  const { appointments: hookAppointments, isLoading, updateAppointment, deleteAppointment } = useAppointments();
  
  // Use prop appointments if provided, otherwise use hook appointments
  const appointments = propAppointments || hookAppointments;

  const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
      toast.success('Status do agendamento atualizado!');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Erro ao atualizar status do agendamento');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
    
    try {
      await deleteAppointment(appointmentId);
      toast.success('Agendamento excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Erro ao excluir agendamento');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading && !propAppointments) {
    return <Loading size="lg" className="h-64" />;
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-500">
              Não há agendamentos para exibir no momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-lg">
                  {format(appointment.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </div>
              <Badge 
                className={statusConfig[appointment.status]?.color || 'bg-gray-100 text-gray-800'}
              >
                {statusConfig[appointment.status]?.label || appointment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{appointment.clientName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{appointment.time} - {appointment.endTime}</span>
                  <span className="text-sm text-gray-500">({appointment.duration}min)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Serviço:</span>
                  <span>{appointment.serviceName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Profissional:</span>
                  <span>{appointment.professionalName}</span>
                </div>
              </div>
            </div>

            {appointment.price > 0 && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{formatCurrency(appointment.price)}</span>
                {appointment.paymentMethod && (
                  <span className="text-sm text-gray-500">
                    • {appointment.paymentMethod}
                  </span>
                )}
              </div>
            )}

            {appointment.notes && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">{appointment.notes}</p>
              </div>
            )}

            {showActions && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {appointment.status === 'scheduled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                  >
                    Confirmar
                  </Button>
                )}
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                  >
                    Concluir
                  </Button>
                )}
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(appointment.id, 'canceled')}
                  >
                    Cancelar
                  </Button>
                )}
                {onEditAppointment && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditAppointment(appointment)}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Excluir
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
