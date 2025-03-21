
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, Clock } from "lucide-react";

interface ProfessionalScheduleTabProps {
  professionalId: string;
}

export const ProfessionalScheduleTab = ({ professionalId }: ProfessionalScheduleTabProps) => {
  const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  
  // Dados mockados para exemplo
  const availability = [
    { day: 1, start: "09:00", end: "18:00", break: "12:00-13:00" },
    { day: 2, start: "09:00", end: "18:00", break: "12:00-13:00" },
    { day: 3, start: "09:00", end: "18:00", break: "12:00-13:00" },
    { day: 4, start: "09:00", end: "18:00", break: "12:00-13:00" },
    { day: 5, start: "09:00", end: "18:00", break: "12:00-13:00" },
    { day: 6, start: "09:00", end: "14:00", break: null },
  ];

  const upcomingAppointments = [
    { id: 1, client: "Maria Silva", service: "Corte de Cabelo", date: "2023-05-15", time: "10:00" },
    { id: 2, client: "João Pereira", service: "Barba", date: "2023-05-15", time: "11:30" },
    { id: 3, client: "Ana Oliveira", service: "Coloração", date: "2023-05-16", time: "14:00" },
    { id: 4, client: "Carlos Santos", service: "Corte e Barba", date: "2023-05-17", time: "09:30" },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="availability">
        <TabsList className="w-full max-w-md mb-4">
          <TabsTrigger value="availability" className="flex-1">
            Disponibilidade
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex-1">
            Próximos Agendamentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                Horários de Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekDays.map((day, index) => {
                  const dayAvailability = availability.find(a => a.day === index);
                  
                  return (
                    <div key={index} className="flex items-center py-2 border-b last:border-0">
                      <div className="w-28 font-medium">{day}</div>
                      {dayAvailability ? (
                        <div className="flex-1">
                          <span className="text-sm">
                            {dayAvailability.start} - {dayAvailability.end}
                          </span>
                          {dayAvailability.break && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (Intervalo: {dayAvailability.break})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 text-sm text-muted-foreground">
                          Não trabalha neste dia
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays size={18} className="text-blue-600" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center py-2 border-b last:border-0">
                      <div className="w-28 font-medium">
                        {new Date(appointment.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{appointment.client}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.service} - {appointment.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento próximo encontrado.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
