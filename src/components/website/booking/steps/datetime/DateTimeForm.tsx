
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

interface DateTimeFormProps {
  selectedDate: Date | undefined;
  handleDateSelect: (date: Date | undefined) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function DateTimeForm({
  selectedDate,
  handleDateSelect,
  notes,
  setNotes
}: DateTimeFormProps) {
  return (
    <>
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

      <div className="space-y-2 mt-6">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Alguma informação adicional para o profissional?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-20"
        />
      </div>
    </>
  );
}
