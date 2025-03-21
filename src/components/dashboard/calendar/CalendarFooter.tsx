
import { Button } from "@/components/ui/button";

export const CalendarFooter = () => {
  return (
    <div className="p-4 bg-muted/40 flex justify-end">
      <Button className="gap-2" size="sm">
        + Novo Agendamento
      </Button>
    </div>
  );
};
