
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
  format,
  isSameWeek
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

  // Filter appointments for current week
  const weekAppointments = filteredAppointments.filter(app => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return app.date >= weekStart && app.date <= weekEnd;
  });

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
          <div className="border border-gray-200 rounded-lg">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                Agendamentos da semana {format(startOfWeek(currentDate), "dd/MM", { locale: ptBR })} - {format(endOfWeek(currentDate), "dd/MM", { locale: ptBR })}
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {weekAppointments.length > 0 ? (
                weekAppointments
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(appointment => (
                    <div 
                      key={appointment.id}
                      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDate(appointment.date);
                        setCalendarView("day");
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{appointment.clientName}</p>
                          <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{appointment.duration} min</span>
                            <span>R$ {appointment.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full mb-1">
                            {format(appointment.date, "HH:mm")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(appointment.date, "EEEE, dd/MM", { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Nenhum agendamento para esta semana
                </div>
              )}
            </div>
          </div>
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
