import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/formatters";

interface Appointment {
  id: string;
  booking_date: string;
  start_time: string;
  status: string;
  price: number;
  duration: number;
  service?: {
    name: string;
  };
  professional?: {
    name: string;
  };
}

interface ClientAppointmentsTabProps {
  clientId: string;
}

export function ClientAppointmentsTab({ clientId }: ClientAppointmentsTabProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            services:service_id (name),
            professionals:employee_id (name)
          `)
          .eq('client_id', clientId)
          .order('booking_date', { ascending: false });

        if (error) throw error;

        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchAppointments();
    }
  }, [clientId]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      scheduled: { label: 'Agendado', variant: 'default' as const },
      confirmed: { label: 'Confirmado', variant: 'secondary' as const },
      completed: { label: 'Concluído', variant: 'secondary' as const },
      canceled: { label: 'Cancelado', variant: 'destructive' as const },
      no_show: { label: 'Faltou', variant: 'outline' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'default' as const };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return `${date} às ${time}`;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum agendamento encontrado
        </h3>
        <p className="text-gray-500">
          Este cliente ainda não possui agendamentos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Histórico de Agendamentos ({appointments.length})
        </h3>
        <Button variant="outline" size="sm">
          Novo Agendamento
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatDateTime(appointment.booking_date, appointment.start_time)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {appointment.service?.name || 'Serviço não especificado'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.duration}min
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{appointment.professional?.name || 'Não especificado'}</span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(appointment.status)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {formatCurrency(appointment.price)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
