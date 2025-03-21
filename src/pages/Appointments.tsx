
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, List, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";

const Appointments = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Agendamentos</h1>
        <Button 
          onClick={() => setShowNewAppointmentDialog(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <CalendarPlus size={16} />
          Novo Agendamento
        </Button>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-0">
          <Tabs 
            defaultValue="calendar" 
            className="w-full"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-blue-50/50">
              <TabsList className="bg-blue-100">
                <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <CalendarIcon size={16} />
                  <span>Calendário</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <List size={16} />
                  <span>Lista</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="mt-0">
              <AppointmentCalendar />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <AppointmentsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <NewAppointmentDialog 
        open={showNewAppointmentDialog}
        onOpenChange={setShowNewAppointmentDialog}
      />
    </div>
  );
};

export default Appointments;
