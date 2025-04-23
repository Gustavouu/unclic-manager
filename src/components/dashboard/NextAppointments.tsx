
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

interface NextAppointmentsProps {
  appointments: any[];
  isLoading: boolean;
}

export function NextAppointments({ appointments, isLoading }: NextAppointmentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-4">
        <Calendar className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
        <h3 className="font-medium">Sem agendamentos</h3>
        <p className="text-sm text-muted-foreground">
          Não existem agendamentos para os próximos dias
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div 
          key={appointment.id} 
          className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/10 transition-colors"
        >
          <div className="bg-primary/10 rounded-full p-2 text-primary">
            {appointment.status === "concluido" ? (
              <Users size={20} />
            ) : (
              <Calendar size={20} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <h4 className="font-medium truncate">{appointment.clientName}</h4>
              <Badge variant={appointment.status === "concluido" ? "success" : "outline"}>
                {appointment.status === "concluido" ? "Concluído" : "Agendado"}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground truncate">
              {appointment.serviceName}
            </div>
            
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Clock size={14} />
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
  );
}
