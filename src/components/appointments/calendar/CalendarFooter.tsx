
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { NewAppointmentDialog } from "../NewAppointmentDialog";

export const CalendarFooter = () => {
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  return (
    <div className="p-4 bg-muted/40 flex justify-end">
      <Button 
        className="gap-2" 
        size="sm"
        onClick={() => setShowNewAppointmentDialog(true)}
      >
        <CalendarPlus size={16} />
        Novo Agendamento
      </Button>

      <NewAppointmentDialog 
        open={showNewAppointmentDialog}
        onOpenChange={setShowNewAppointmentDialog}
      />
    </div>
  );
};
