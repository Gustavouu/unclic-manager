
import { useState } from "react";
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth,
  startOfWeek,
  endOfWeek, 
  eachDayOfInterval, 
  getDay, 
  isSameDay,
  setHours,
  setMinutes,
  addWeeks,
  subWeeks,
  format
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarFilter } from "./calendar/CalendarFilter";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { Button } from "@/components/ui/button";
import { Calendar, Grid3X3, ListFilter } from "lucide-react";

// Sample appointments data
const SAMPLE_APPOINTMENTS = [
  {
    id: "1",
    date: new Date(new Date().setHours(10, 0)),
    clientName: "Mariana Silva",
    serviceName: "Corte e Coloração",
    serviceType: "hair",
    duration: 90,
    price: 180
  },
  {
    id: "2",
    date: new Date(new Date().setHours(14, 30)),
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
    serviceType: "barber",
    duration: 60,
    price: 95
  },
  {
    id: "3",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), 0), 11),
    clientName: "Ana Paula Costa",
    serviceName: "Manicure",
    serviceType: "nails",
    duration: 45,
    price: 60
  },
  {
    id: "4",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), 0), 15),
    clientName: "Fernanda Lima",
    serviceName: "Maquiagem para Evento",
    serviceType: "makeup",
    duration: 60,
    price: 120
  },
  {
    id: "5",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), 0), 9),
    clientName: "Paulo Mendes",
    serviceName: "Limpeza de Pele",
    serviceType: "skincare",
    duration: 75,
    price: 150
  },
];

// Service types for filter
export type ServiceType = "all" | "hair" | "barber" | "nails" | "makeup" | "skincare";

// Map service types to display names
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  hair: "Cabelo",
  barber: "Barbearia",
  nails: "Manicure/Pedicure",
  makeup: "Maquiagem",
  skincare: "Estética Facial"
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export type AppointmentType = {
  id: string;
  date: Date;
  clientName: string;
  serviceName: string;
  serviceType: string;
  duration: number;
  price: number;
};

export const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");

  const nextPeriod = () => {
    if (calendarView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (calendarView === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentDate(date);
    }
  };

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    setCalendarView("day");
  };

  // Create calendar days based on current view
  let calendarDays: (Date | null)[] = [];
  
  if (calendarView === "month") {
    // Month view logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startWeekday = getDay(monthStart);
    
    calendarDays = Array(startWeekday).fill(null);
    monthDays.forEach(day => calendarDays.push(day));
  } else if (calendarView === "week") {
    // Week view logic
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    calendarDays = weekDays;
  }

  // Filter appointments based on service type
  const filteredAppointments = SAMPLE_APPOINTMENTS.filter(app => 
    (serviceFilter === "all" || app.serviceType === serviceFilter)
  );

  // Filter appointments for selected date
  const dayAppointments = filteredAppointments.filter(app => 
    isSameDay(app.date, selectedDate)
  );

  return (
    <div className="rounded-lg border border-border/40 shadow-sm overflow-hidden bg-white">
      <div className="p-4">
        <CalendarHeader 
          currentDate={currentDate}
          selectedDate={selectedDate}
          calendarView={calendarView}
          onPrevPeriod={prevPeriod}
          onNextPeriod={nextPeriod}
          onSelectDate={handleSelectDate}
          onViewChange={setCalendarView}
        />
        
        <div className="mb-4 border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
            <CalendarFilter 
              serviceFilter={serviceFilter}
              onFilterChange={setServiceFilter}
              serviceTypes={SERVICE_TYPE_NAMES}
            />
            
            <div className="flex items-center gap-2 self-end">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 ${calendarView === 'month' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
                onClick={() => setCalendarView('month')}
              >
                <Grid3X3 size={16} className="mr-1" />
                Mensal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`h-9 ${calendarView === 'week' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
                onClick={() => setCalendarView('week')}
              >
                <Calendar size={16} className="mr-1" />
                Semanal
              </Button>
            </div>
          </div>
        </div>
        
        {calendarView === "month" && (
          <MonthView
            calendarDays={calendarDays}
            weekDays={weekDays}
            selectedDate={selectedDate}
            appointments={filteredAppointments}
            onSelectDay={handleSelectDay}
          />
        )}
        
        {calendarView === "week" && (
          <MonthView
            calendarDays={calendarDays}
            weekDays={weekDays}
            selectedDate={selectedDate}
            appointments={filteredAppointments}
            onSelectDay={handleSelectDay}
            isWeekView={true}
          />
        )}
        
        {calendarView === "day" && (
          <DayView 
            appointments={dayAppointments} 
            selectedDate={selectedDate}
            onBackToMonth={() => setCalendarView("month")}
          />
        )}
      </div>
      
      <CalendarFooter />
    </div>
  );
};
