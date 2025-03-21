
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
import { CalendarViewType } from "./types";

type CalendarHeaderProps = {
  currentDate: Date;
  selectedDate: Date;
  calendarView: CalendarViewType;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onSelectDate: (date: Date | undefined) => void;
  onViewChange: (view: CalendarViewType) => void;
};

export const CalendarHeader = ({
  currentDate,
  selectedDate,
  calendarView,
  onPrevPeriod,
  onNextPeriod,
  onSelectDate,
  onViewChange,
}: CalendarHeaderProps) => {
  // Formatar o título com base na visualização atual
  let headerTitle = "";
  
  if (calendarView === "month") {
    const formattedMonth = format(currentDate, "MMMM yyyy", { locale: ptBR });
    headerTitle = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);
  } else if (calendarView === "week") {
    const weekStart = format(currentDate, "d", { locale: ptBR });
    const weekStartMonth = format(currentDate, "MMMM", { locale: ptBR });
    headerTitle = `Semana de ${weekStart} de ${weekStartMonth}`;
  } else {
    headerTitle = format(selectedDate, "d 'de' MMMM", { locale: ptBR });
  }

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-medium">Calendário de Agendamentos</h2>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-sm">
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
      
      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
        <h3 className="text-base font-medium text-blue-800 flex items-center gap-2">
          <CalendarIcon size={16} className="text-blue-600" />
          {headerTitle}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrevPeriod} className="h-7 w-7 hover:bg-blue-100">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNextPeriod} className="h-7 w-7 hover:bg-blue-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
