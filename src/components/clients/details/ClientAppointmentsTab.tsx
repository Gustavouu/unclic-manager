
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Appointment } from "@/components/appointments/types";

interface ClientAppointmentsTabProps {
  clientId: string;
}

export function ClientAppointmentsTab({ clientId }: ClientAppointmentsTabProps) {
  const { appointments, isLoading } = useAppointments();
  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Filter appointments for this client
    const filteredAppointments = appointments.filter(
      appointment => appointment.clientId === clientId
    );
    setClientAppointments(filteredAppointments);
  }, [clientId, appointments]);

  const statusMap = {
    "scheduled": { label: "Agendado", className: "bg-blue-100 text-blue-800 border-blue-200" },
    "completed": { label: "Concluído", className: "bg-green-100 text-green-800 border-green-200" },
    "canceled": { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200" },
    "pending": { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    "no-show": { label: "Não Compareceu", className: "bg-gray-100 text-gray-800 border-gray-200" },
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Agendamentos</h3>
        <Button variant="outline" size="sm">
          Novo Agendamento
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead className="hidden md:table-cell">Profissional</TableHead>
              <TableHead className="hidden md:table-cell">Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : clientAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Agendar agora
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              clientAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center font-medium">
                        <Calendar size={14} className="mr-1 text-muted-foreground" />
                        {formatDate(appointment.date)}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock size={12} className="mr-1" />
                        {formatTime(appointment.date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{appointment.serviceName}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {appointment.professionalId}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(appointment.price)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusMap[appointment.status as keyof typeof statusMap]?.className}
                    >
                      {statusMap[appointment.status as keyof typeof statusMap]?.label || appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
