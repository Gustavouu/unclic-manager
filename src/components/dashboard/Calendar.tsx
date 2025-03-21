
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

// Sample appointments data for demonstration
const SAMPLE_APPOINTMENTS = [
  {
    id: "1",
    date: new Date(2024, 6, 12, 10, 0),
    clientName: "Mariana Silva",
    serviceName: "Corte e Coloração",
  },
  {
    id: "2",
    date: new Date(2024, 6, 12, 14, 30),
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
  },
  {
    id: "3",
    date: new Date(2024, 6, 15, 11, 0),
    clientName: "Ana Paula Costa",
    serviceName: "Manicure",
  },
];

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export const AppointmentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "day">("month");

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create calendar grid with correct starting position
  const startWeekday = getDay(monthStart);
  const calendarDays = Array(startWeekday).fill(null);
  monthDays.forEach(day => calendarDays.push(day));

  // Filter appointments for selected date
  const dayAppointments = SAMPLE_APPOINTMENTS.filter(app => 
    isSameDay(app.date, selectedDate)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border/40 animate-fade-in overflow-hidden">
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">Calendário de Agendamentos</h2>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Hoje</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setCurrentMonth(date);
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
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </h3>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={prevMonth} 
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={nextMonth} 
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className="text-xs text-center font-medium text-muted-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                // Check if this day has appointments
                const hasAppointments = day 
                  ? SAMPLE_APPOINTMENTS.some(app => isSameDay(app.date, day)) 
                  : false;
                  
                return (
                  <div key={index} className="aspect-square">
                    {day ? (
                      <button
                        className={cn(
                          "w-full h-full rounded-lg flex flex-col items-center justify-center text-sm relative transition-all",
                          isSameDay(day, selectedDate) && "bg-primary text-primary-foreground font-medium",
                          isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "bg-muted font-medium",
                          !isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "hover:bg-muted/60"
                        )}
                        onClick={() => {
                          setSelectedDate(day);
                          setCalendarView("day");
                        }}
                      >
                        {format(day, "d")}
                        {hasAppointments && (
                          <span className={cn(
                            "w-1 h-1 rounded-full absolute bottom-1",
                            isSameDay(day, selectedDate) ? "bg-primary-foreground" : "bg-primary"
                          )} />
                        )}
                      </button>
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {calendarView === "day" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-1">
                <button 
                  onClick={() => setCalendarView("month")} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-medium">
                  {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </span>
              </h3>
            </div>
            
            {dayAppointments.length > 0 ? (
              <div className="space-y-3">
                {dayAppointments.map(appointment => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center gap-4 p-3 rounded-lg border border-border/40 hover:border-border/80 transition-all bg-white"
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {format(appointment.date, "HH:mm")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{appointment.clientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
                <p className="text-muted-foreground">Nenhum agendamento para este dia</p>
                <p className="text-sm text-muted-foreground/75">Clique em + para adicionar um novo agendamento</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="p-4 bg-muted/40 flex justify-end">
        <Button className="gap-2" size="sm">
          + Novo Agendamento
        </Button>
      </div>
    </div>
  );
};
