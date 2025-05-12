
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentData } from "@/hooks/dashboard/useDashboardData";
import { formatCurrency } from "@/lib/format";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface UpcomingAppointmentsWidgetProps {
  appointments: AppointmentData[];
}

export function UpcomingAppointmentsWidget({ appointments }: UpcomingAppointmentsWidgetProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40">
            <Calendar className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
            <p className="text-muted-foreground">Nenhum agendamento próximo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/10 transition-colors"
            >
              <div className="bg-primary/10 rounded-full p-2 text-primary">
                <Clock size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">{appointment.clientName}</h4>
                  <Badge variant="outline">{appointment.status}</Badge>
                </div>

                <div className="text-sm text-muted-foreground truncate">
                  {appointment.serviceName}
                </div>

                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span>
                    {format(new Date(appointment.date), "dd 'de' MMMM', às 'HH:mm", { locale: ptBR })}
                  </span>
                  <span className="font-medium ml-auto">
                    {formatCurrency(appointment.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
