
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

const Appointments = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const { calendarView, updateUrlView } = useRouteCalendarView();

  return (
    <OnboardingProvider>
      <div className="space-y-6">
        {/* Header melhorado */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os seus agendamentos em um só lugar</p>
          </div>
          <Button 
            onClick={() => setShowNewAppointmentDialog(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            size="lg"
          >
            <CalendarPlus size={18} />
            Novo Agendamento
          </Button>
        </div>
        
        {/* Cards de estatísticas */}
        <AppointmentStats />

        {/* Conteúdo principal */}
        <Card className="border-0 shadow-lg">
          <Tabs 
            value={view}
            className="w-full"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            {/* Header das abas melhorado */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <TabsList className="bg-white shadow-sm border">
                <TabsTrigger 
                  value="calendar" 
                  className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <CalendarIcon size={16} />
                  <span className="hidden sm:inline">Calendário</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <List size={16} />
                  <span className="hidden sm:inline">Lista</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Controles de visualização do calendário */}
              {view === "calendar" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 ${calendarView === 'month' ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium' : ''}`}
                    onClick={() => updateUrlView('month')}
                  >
                    <Grid3X3 size={16} className="mr-1" />
                    <span className="hidden sm:inline">Mensal</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 ${calendarView === 'week' ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium' : ''}`}
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
