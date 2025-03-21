
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  MoreVertical, 
  Pencil, 
  Check, 
  Clock, 
  X, 
  Trash2 
} from "lucide-react";
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentStatus } from "../types";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Marcar como concluído
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Remarcar
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <X className="h-4 w-4" />
              Cancelar
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
