
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AppointmentType } from "./calendar/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@/hooks/appointments/types";

export interface AppointmentsListProps {
  appointments: AppointmentType[];
  isLoading?: boolean;
  onViewAppointment?: (id: string) => void;
  onEditAppointment?: (id: string) => void;
  onDeleteAppointment?: (id: string) => void;
}

export function AppointmentsList({
  appointments,
  isLoading = false,
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}: AppointmentsListProps) {
  const getStatusBadge = (status?: AppointmentStatus) => {
    switch (status) {
      case "agendado":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Agendado
          </Badge>
        );
      case "confirmado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Confirmado
          </Badge>
        );
      case "pendente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Pendente
          </Badge>
        );
      case "concluido":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            Concluído
          </Badge>
        );
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell>
                    <Skeleton className="h-5 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[50px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[70px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
          ) : appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Nenhum agendamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {format(appointment.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell className="font-medium">
                  {appointment.clientName}
                </TableCell>
                <TableCell>{appointment.serviceName}</TableCell>
                <TableCell>{appointment.duration} min</TableCell>
                <TableCell>
                  {typeof appointment.price === "number"
                    ? `R$ ${appointment.price.toFixed(2)}`
                    : appointment.price}
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onViewAppointment?.(appointment.id)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEditAppointment?.(appointment.id)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteAppointment?.(appointment.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
