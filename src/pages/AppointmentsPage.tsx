
import React, { useState } from "react";
import { CalendarDateRangePicker } from "@/components/appointments/calendar/CalendarDateRangePicker";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, List } from "lucide-react";
import { AppointmentDialog } from "@/components/appointments/AppointmentDialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addDays } from "date-fns";
import { AppointmentsCalendarView } from "@/components/appointments/calendar/AppointmentsCalendarView";
import { AppointmentType } from "@/components/appointments/calendar/types";
import { AppointmentStatus } from "@/hooks/appointments/types";

const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const { toast } = useToast();
  
  // For demo purposes
  const sampleAppointments: AppointmentType[] = [
    {
      id: "1",
      clientName: "João Silva",
      serviceName: "Corte de Cabelo",
      serviceType: "haircut",
      date: new Date(),
      duration: 30,
      price: 50,
      status: "agendado" as AppointmentStatus,
    },
    {
      id: "2",
      clientName: "Maria Oliveira",
      serviceName: "Hidratação",
      serviceType: "treatment",
      date: addDays(new Date(), 1),
      duration: 60,
      price: 120,
      status: "confirmado" as AppointmentStatus,
    },
  ];

  const handleNewAppointment = () => {
    setIsDialogOpen(true);
  };

  const handleAppointmentCreated = (appointmentData: any) => {
    toast({
      title: "Agendamento criado",
      description: `Agendamento para ${appointmentData.clientName} criado com sucesso.`,
    });
    setIsDialogOpen(false);
  };

  const formattedDate = date
    ? format(date, "MMMM yyyy", { locale: ptBR })
    : "";

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus agendamentos em um só lugar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "list" | "calendar")}
            className="hidden md:flex"
          >
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendário</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleNewAppointment} className="ml-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium capitalize">{formattedDate}</h2>
        <CalendarDateRangePicker date={date} setDate={setDate} />
      </div>

      <div className="bg-white rounded-md shadow">
        {viewMode === "list" ? (
          <AppointmentsList 
            appointments={sampleAppointments}
            isLoading={false}
          />
        ) : (
          <AppointmentsCalendarView 
            appointments={sampleAppointments}
            date={date || new Date()}
            onDateChange={setDate}
          />
        )}
      </div>

      <AppointmentDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </div>
  );
};

export default AppointmentsPage;
