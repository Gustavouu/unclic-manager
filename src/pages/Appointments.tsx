
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, List, CalendarPlus, Scissors, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { AppointmentStats } from "@/components/appointments/AppointmentStats";

const Appointments = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  return (
    <OnboardingProvider>
      <div className="space-y-4">
        <h1 className="text-xl font-display font-medium mb-2">Gerenciamento de Agendamentos</h1>
        
        {/* Stats cards row */}
        <AppointmentStats />

        <Card className="border shadow-sm overflow-hidden">
          <Tabs 
            defaultValue="calendar" 
            className="w-full"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-3 border-b bg-white gap-3">
              <TabsList className="bg-slate-100 w-full md:w-auto">
                <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <CalendarIcon size={16} />
                  <span>Calendário</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <List size={16} />
                  <span>Lista</span>
                </TabsTrigger>
              </TabsList>
              
              <Button 
                onClick={() => setShowNewAppointmentDialog(true)}
                className="gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
              >
                <CalendarPlus size={16} />
                Novo Agendamento
              </Button>
            </div>
            
            <TabsContent value="calendar" className="mt-0 p-0">
              <AppointmentCalendar />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0 p-4 bg-white">
              <AppointmentsList />
            </TabsContent>
          </Tabs>
        </Card>

        <NewAppointmentDialog 
          open={showNewAppointmentDialog}
          onOpenChange={setShowNewAppointmentDialog}
        />
      </div>
    </OnboardingProvider>
  );
};

export default Appointments;
