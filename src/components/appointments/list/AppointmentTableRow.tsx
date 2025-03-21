
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Appointment, AppointmentStatus } from "../types";
import { ActionMenu } from "./ActionMenu";

interface AppointmentTableRowProps {
  appointment: Appointment;
}

export const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case "agendado":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Agendado</Badge>;
    case "concluído":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluído</Badge>;
    case "cancelado":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelado</Badge>;
    default:
      return null;
  }
};

export const AppointmentTableRow = ({ appointment }: AppointmentTableRowProps) => {
  return (
    <TableRow key={appointment.id}>
      <TableCell className="font-medium">{appointment.clientName}</TableCell>
      <TableCell>{appointment.serviceName}</TableCell>
      <TableCell>{format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
      <TableCell>{format(appointment.date, "HH:mm")}</TableCell>
      <TableCell>R$ {appointment.price.toFixed(2)}</TableCell>
      <TableCell>{getStatusBadge(appointment.status as AppointmentStatus)}</TableCell>
      <TableCell>
        <ActionMenu 
          appointmentId={appointment.id} 
          currentStatus={appointment.status as AppointmentStatus} 
        />
      </TableCell>
    </TableRow>
  );
};
