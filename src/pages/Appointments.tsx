
import { useState } from "react";
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
import { PageHeader } from "@/components/ui/page-header";

const Appointments = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const { calendarView, updateUrlView } = useRouteCalendarView();

  return (
    <OnboardingProvider>
      <div className="space-y-6">
        {/* Header padronizado */}
        <PageHeader
          title="Agendamentos"
          description="Gerencie todos os seus agendamentos em um só lugar"
          actions={
            <Button 
              onClick={() => setShowNewAppointmentDialog(true)}
              className="gap-2"
              size="default"
            >
              <CalendarPlus size={18} />
              Novo Agendamento
            </Button>
          }
        />
        
        {/* Cards de estatísticas */}
        <AppointmentStats />

        {/* Conteúdo principal */}
        <Card>
          <Tabs 
            value={view}
            className="w-full"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            {/* Header das abas padronizado */}
            <div className="flex justify-between items-center p-6 border-b">
              <TabsList>
                <TabsTrigger 
                  value="calendar" 
                  className="gap-2"
                >
                  <CalendarIcon size={16} />
                  <span className="hidden sm:inline">Calendário</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  className="gap-2"
                >
                  <List size={16} />
                  <span className="hidden sm:inline">Lista</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Controles de visualização do calendário */}
              {view === "calendar" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={calendarView === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateUrlView('month')}
                  >
                    <Grid3X3 size={16} className="mr-1" />
                    <span className="hidden sm:inline">Mensal</span>
                  </Button>
                  <Button
                    variant={calendarView === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateUrlView('week')}
                  >
                    <Calendar size={16} className="mr-1" />
                    <span className="hidden sm:inline">Semanal</span>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Conteúdo das abas */}
            <TabsContent value="calendar" className="mt-0 p-0">
              <div className="p-6">
                <AppointmentCalendar initialView={calendarView} />
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0 p-0">
              <div className="p-6">
                <AppointmentsList />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Dialog de novo agendamento */}
        <NewAppointmentDialog 
          open={showNewAppointmentDialog}
          onOpenChange={setShowNewAppointmentDialog}
        />
      </div>
    </OnboardingProvider>
  );
};

export default Appointments;
