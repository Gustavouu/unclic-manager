
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

interface DateTimeFormProps {
  selectedDate: Date | undefined;
  handleDateSelect: (date: Date | undefined) => void;
}

export function DateTimeForm({
  selectedDate,
  handleDateSelect
}: DateTimeFormProps) {
  return (
    <div className="md:w-1/2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        disabled={(date) => date < new Date() || date.getDay() === 0}
        initialFocus
        locale={ptBR}
        className={cn("rounded-md border mx-auto pointer-events-auto")}
      />
    </div>
  );
}
