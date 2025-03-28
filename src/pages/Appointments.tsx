
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, List, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";

const Appointments = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  return (
    <OnboardingProvider>
      <div className="space-y-4">
        <h1 className="text-xl font-display font-medium mb-4">Gerenciamento de Agendamentos</h1>

        <Card className="border shadow-sm overflow-hidden">
          <Tabs 
            defaultValue="calendar" 
            className="w-full"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            <div className="flex justify-between items-center p-3 border-b bg-white">
              <TabsList className="bg-blue-50">
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
                className="gap-2 bg-blue-600 hover:bg-blue-700"
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
