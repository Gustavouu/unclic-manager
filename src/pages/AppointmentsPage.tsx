
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, List, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { AppointmentStats } from "@/components/appointments/AppointmentStats";
import { Calendar, Grid3X3 } from "lucide-react";
import { useRouteCalendarView } from "@/hooks/useRouteCalendarView";
import { CalendarViewType } from "@/components/appointments/calendar/types";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Appointment } from "@/hooks/appointments/types";
import { toast } from "sonner";

const AppointmentsPage = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const { calendarView, updateUrlView } = useRouteCalendarView();
  
  // Use the appointments hook to get data from the database
  const { 
    appointments, 
    isLoading, 
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useAppointments();

  useEffect(() => {
    // Load appointments when the component mounts
    fetchAppointments();
  }, [fetchAppointments]);

  // Handle error state
  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar agendamentos", {
        description: error.message
      });
    }
  }, [error]);

  const handleAppointmentCreated = () => {
    // Refresh the appointments list
    fetchAppointments();
    setShowNewAppointmentDialog(false);
    toast.success("Agendamento criado com sucesso!");
  };

  const handleAppointmentUpdated = () => {
    // Refresh the appointments list
    fetchAppointments();
    toast.success("Agendamento atualizado com sucesso!");
  };

  const handleAppointmentDeleted = async (id: string) => {
    try {
      await deleteAppointment(id);
      toast.success("Agendamento excluído com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao excluir agendamento", {
        description: error.message
      });
    }
  };

  return (
    <OnboardingProvider>
      <div className="space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold">Gerenciamento de Agendamentos</h1>
          <Button 
            onClick={() => setShowNewAppointmentDialog(true)}
            className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <CalendarPlus size={16} />
            Novo Agendamento
          </Button>
        </div>
        
        {/* Stats cards row */}
        <AppointmentStats appointments={appointments} isLoading={isLoading} />

        <Card className="border shadow-sm overflow-hidden">
          <Tabs 
            defaultValue="calendar" 
            className="w-full"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            <div className="flex justify-between items-center p-3 border-b bg-white">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <CalendarIcon size={16} />
                  <span>Calendário</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <List size={16} />
                  <span>Lista</span>
                </TabsTrigger>
              </TabsList>
              
              {view === "calendar" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 ${calendarView === 'month' ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium' : ''}`}
                    onClick={() => updateUrlView('month')}
                  >
                    <Grid3X3 size={16} className="mr-1" />
                    Mensal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 ${calendarView === 'week' ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium' : ''}`}
                    onClick={() => updateUrlView('week')}
                  >
                    <Calendar size={16} className="mr-1" />
                    Semanal
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="calendar" className="mt-0 p-0">
              <AppointmentCalendar 
                initialView={calendarView} 
                appointments={appointments}
                isLoading={isLoading}
                onAppointmentUpdate={handleAppointmentUpdated}
                onAppointmentDelete={handleAppointmentDeleted}
              />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0 p-4 bg-white">
              <AppointmentsList 
                appointments={appointments}
                isLoading={isLoading}
                onAppointmentUpdate={handleAppointmentUpdated}
                onAppointmentDelete={handleAppointmentDeleted}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <NewAppointmentDialog 
          open={showNewAppointmentDialog}
          onOpenChange={setShowNewAppointmentDialog}
          onAppointmentCreated={handleAppointmentCreated}
          createAppointment={createAppointment}
        />
      </div>
    </OnboardingProvider>
  );
};

export default AppointmentsPage;
