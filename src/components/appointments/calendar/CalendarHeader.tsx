
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

type CalendarHeaderProps = {
  currentMonth: Date;
  selectedDate: Date;
  calendarView: "month" | "day";
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date | undefined) => void;
  onViewChange: (view: "month" | "day") => void;
};

export const CalendarHeader = ({
  currentMonth,
  selectedDate,
  calendarView,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onViewChange,
}: CalendarHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold">Calendário de Agendamentos</h2>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Selecionar Data</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onSelectDate(date);
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {calendarView === "month" && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {calendarView === "day" && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-1 text-lg font-medium">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </h3>
        </div>
      )}
    </>
  );
};
