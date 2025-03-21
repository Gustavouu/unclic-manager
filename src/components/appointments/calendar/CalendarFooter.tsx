
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

type CalendarFooterProps = {
  onNewAppointment: () => void;
};

export const CalendarFooter = ({ onNewAppointment }: CalendarFooterProps) => {
  return (
    <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
      <Button 
        onClick={onNewAppointment}
        className="gap-2"
        size="sm"
      >
        <CalendarPlus size={16} />
        Novo Agendamento
      </Button>
    </div>
  );
};
