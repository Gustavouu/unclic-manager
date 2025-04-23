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
import { useCalendarContext } from "./CalendarContext";
import { ProfessionalFilter } from "./ProfessionalFilter";

export const CalendarHeader = () => {
  const {
    currentDate,
    setCurrentDate,
    calendarView,
    setCalendarView,
    nextPeriod,
    prevPeriod,
    professionalFilter,
    setProfessionalFilter
  } = useCalendarContext();
  
  const formattedDate = format(
    currentDate,
    calendarView === "month" 
      ? "MMMM yyyy" 
      : "d' a 'dd' de 'MMMM' de 'yyyy",
    { locale: ptBR }
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-3">
      <div className="flex items-center">
        <h2 className="text-lg font-medium capitalize">
          {formattedDate}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        <ProfessionalFilter 
          selectedProfessionalId={professionalFilter}
          onSelectProfessional={setProfessionalFilter}
        />
        
        <div className="flex items-center rounded-md border border-input shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevPeriod}
            className="rounded-r-none h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="h-8 rounded-none border-x"
          >
            Hoje
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextPeriod}
            className="rounded-l-none h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center rounded-md border border-input shadow-sm">
          <Button
            variant={calendarView === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCalendarView("month")}
            className="rounded-r-none"
          >
            Mês
          </Button>
          <Button
            variant={calendarView === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCalendarView("week")}
            className="rounded-l-none border-l"
          >
            Semana
          </Button>
        </div>
      </div>
    </div>
  );
};
