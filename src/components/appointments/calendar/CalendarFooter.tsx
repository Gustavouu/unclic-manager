
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

type CalendarFooterProps = {
  onNewAppointment: () => void;
};

export const CalendarFooter = ({ onNewAppointment }: CalendarFooterProps) => {
  return (
    <div className="p-4 bg-muted/40 flex justify-end">
      <Button 
        className="gap-2" 
        size="sm"
        onClick={onNewAppointment}
      >
        <CalendarPlus className="h-4 w-4" />
        Novo Agendamento
      </Button>
    </div>
  );
};
