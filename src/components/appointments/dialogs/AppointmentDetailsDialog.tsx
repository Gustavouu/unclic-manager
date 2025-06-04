
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Scissors, CreditCard, FileText, Phone, Mail } from 'lucide-react';
import { Appointment } from '@/hooks/appointments/types';
import { formatCurrency } from '@/lib/format';

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
}

export function AppointmentDetailsDialog({ 
  appointment, 
  open, 
  onOpenChange, 
  onEdit, 
  onCancel 
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'concluido':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'faltou':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'confirmado':
        return 'Confirmado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      case 'faltou':
        return 'Faltou';
      default:
        return 'Agendado';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Agendamento</span>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do cliente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <User size={16} />
              Cliente
            </h3>
            <p className="text-sm text-gray-600">{appointment.clientName}</p>
          </div>

          {/* Data e hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Data
              </h3>
              <p className="text-sm text-gray-600">
                {format(appointment.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Horário
              </h3>
              <p className="text-sm text-gray-600">
                {format(appointment.date, 'HH:mm')} ({appointment.duration} min)
              </p>
            </div>
          </div>

          {/* Serviço */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Scissors size={16} />
              Serviço
            </h3>
            <p className="text-sm text-gray-600">{appointment.serviceName}</p>
          </div>

          {/* Profissional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <User size={16} />
              Profissional
            </h3>
            <p className="text-sm text-gray-600">{appointment.professionalName}</p>
          </div>

          {/* Valor e pagamento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CreditCard size={16} />
                Valor
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {formatCurrency(appointment.price)}
              </p>
            </div>

            {appointment.paymentMethod && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Pagamento</h3>
                <p className="text-sm text-gray-600">{appointment.paymentMethod}</p>
              </div>
            )}
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Observações
              </h3>
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            {onEdit && appointment.status !== 'concluido' && appointment.status !== 'cancelado' && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onEdit(appointment)}
              >
                Editar
              </Button>
            )}
            
            {onCancel && appointment.status !== 'concluido' && appointment.status !== 'cancelado' && (
              <Button 
                variant="outline" 
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onCancel(appointment)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
