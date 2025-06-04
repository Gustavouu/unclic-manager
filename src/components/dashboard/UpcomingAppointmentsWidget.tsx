
import React from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UpcomingAppointmentsWidgetProps {
  appointments: any[];
}

export function UpcomingAppointmentsWidget({ appointments }: UpcomingAppointmentsWidgetProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 text-center p-4">
          <Calendar className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
          <h3 className="font-medium">Sem agendamentos</h3>
          <p className="text-sm text-muted-foreground">
            Não existem agendamentos para os próximos dias
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Próximos Agendamentos</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver todos
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {appointments.slice(0, 3).map((appointment) => (
            <div 
              key={appointment.id} 
              className="flex items-start gap-3 p-3 hover:bg-accent/10 transition-colors"
            >
              <div className="bg-primary/10 rounded-full p-2 text-primary">
                {appointment.status === "concluido" ? (
                  <Users size={18} />
                ) : (
                  <Calendar size={18} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">{appointment.clientName}</h4>
                  <Badge 
                    variant={appointment.status === "concluido" ? "default" : "outline"} 
                    className={`ml-2 whitespace-nowrap ${
                      appointment.status === "concluido" ? "bg-green-100 text-green-800 border-green-200" : ""
                    }`}
                  >
                    {appointment.status === "concluido" ? "Concluído" : "Agendado"}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground truncate">
                  {appointment.serviceName}
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>
                    {format(new Date(appointment.date), "dd 'de' MMM', às 'HH:mm", { locale: ptBR })}
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
