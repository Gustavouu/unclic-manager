
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { scheduleHistory } from "../data/professionalsMockData";

interface ScheduleHistoryTabProps {
  professionalId: string;
}

export const ScheduleHistoryTab = ({ professionalId }: ScheduleHistoryTabProps) => {
  // Filtra o histórico pelo ID do profissional
  const professionalHistory = scheduleHistory.filter(item => item.professionalId === professionalId);
  
  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-medium">Data</TableHead>
              <TableHead className="font-medium">Horário</TableHead>
              <TableHead className="font-medium">Cliente</TableHead>
              <TableHead className="font-medium">Serviço</TableHead>
              <TableHead className="font-medium">Valor</TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionalHistory.length > 0 ? (
              professionalHistory.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell>
                    {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.serviceName}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(appointment.value)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === 'completed' ? "default" :
                        appointment.status === 'canceled' ? "destructive" :
                        appointment.status === 'pending' ? "outline" : "secondary"
                      }
                      className={appointment.status === 'completed' ? "bg-green-100 text-green-800" : ""}
                    >
                      {appointment.status === 'completed' ? "Concluído" :
                       appointment.status === 'canceled' ? "Cancelado" :
                       appointment.status === 'pending' ? "Pendente" : "Reagendado"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento encontrado para este profissional.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
