
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentCalendarProps {
  businessId: string | null;
}

export function AppointmentCalendar({ businessId }: AppointmentCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
          {businessId ? (
            <p>Calendário de agendamentos em construção</p>
          ) : (
            <p>Configure seu negócio para ver o calendário de agendamentos</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
