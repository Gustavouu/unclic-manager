
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Appointment, AppointmentStatus } from '@/hooks/appointments/types';

export interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
  onAppointmentUpdate?: () => void;
  onAppointmentDelete?: (id: string) => Promise<void>;
}

const getStatusBadge = (status: AppointmentStatus) => {
  switch(status) {
    case 'agendado': 
      return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Agendado</Badge>;
    case 'confirmado': 
      return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Confirmado</Badge>;
    case 'concluido': 
      return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">Concluído</Badge>;
    case 'cancelado': 
      return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function AppointmentsList({ appointments, isLoading = false, onAppointmentUpdate, onAppointmentDelete }: AppointmentsListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-2 text-muted-foreground">Carregando agendamentos...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p className="mb-2">Nenhum agendamento encontrado.</p>
        <p className="text-sm">Crie um novo agendamento para começar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Preço</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onAppointmentUpdate?.()}>
              <TableCell className="font-medium">{appointment.clientName}</TableCell>
              <TableCell>{appointment.serviceName}</TableCell>
              <TableCell>{format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
              <TableCell>{format(new Date(appointment.date), 'HH:mm', { locale: ptBR })}</TableCell>
              <TableCell>{appointment.duration} min</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="text-right">
                {typeof appointment.price === 'number' 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appointment.price)
                  : 'N/A'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
