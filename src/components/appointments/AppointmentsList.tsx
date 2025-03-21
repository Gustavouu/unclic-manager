
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
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
import { Input } from "@/components/ui/input";
import { 
  Check, 
  Clock, 
  MoreVertical, 
  Pencil, 
  Search, 
  Trash2, 
  X
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Sample data
const appointments = [
  {
    id: "1",
    clientName: "Maria Silva",
    serviceName: "Corte e Coloração",
    date: new Date(2024, 6, 12, 10, 0),
    status: "agendado",
    price: 180
  },
  {
    id: "2",
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
    date: new Date(2024, 6, 12, 14, 30),
    status: "concluído",
    price: 95
  },
  {
    id: "3",
    clientName: "Ana Costa",
    serviceName: "Manicure",
    date: new Date(2024, 6, 15, 11, 0),
    status: "cancelado",
    price: 60
  },
  {
    id: "4",
    clientName: "Fernanda Lima",
    serviceName: "Maquiagem para Evento",
    date: new Date(2024, 6, 16, 15, 0),
    status: "agendado",
    price: 120
  },
  {
    id: "5",
    clientName: "Paulo Mendes",
    serviceName: "Limpeza de Pele",
    date: new Date(2024, 6, 17, 9, 0),
    status: "agendado",
    price: 150
  },
];

type AppointmentStatus = "agendado" | "concluído" | "cancelado";

const getStatusBadge = (status: AppointmentStatus) => {
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

export const AppointmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAppointments = appointments.filter(appointment => 
    appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar por cliente ou serviço..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
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
            ))}
            
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
