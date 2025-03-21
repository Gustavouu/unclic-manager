
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
  const formattedMonth = format(currentMonth, "MMMM yyyy", { locale: ptBR });
  const capitalizedMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold">Calendário de Agendamentos</h2>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
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
        <div className="flex items-center justify-between mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 flex items-center gap-2">
            <CalendarIcon size={18} className="text-blue-600" />
            {capitalizedMonth}
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8 hover:bg-blue-100 hover:text-blue-700">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8 hover:bg-blue-100 hover:text-blue-700">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {calendarView === "day" && (
        <div className="flex items-center justify-between mb-0">
          <h3 className="flex items-center gap-1 text-lg font-medium text-blue-800">
            {format(selectedDate, "d", { locale: ptBR })} de {capitalizedMonth}
          </h3>
        </div>
      )}
    </>
  );
};
