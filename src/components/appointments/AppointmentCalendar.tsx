
import { useState, useEffect } from "react";
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
  addWeeks,
  subWeeks,
  format,
  parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarFilter } from "./calendar/CalendarFilter";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { WeekView } from "./calendar/WeekView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { AppointmentType, CalendarViewType, ServiceType } from "./calendar/types";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { useAppointments } from "@/hooks/appointments/useAppointments";

// Map service types to display names for barbershop
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  haircut: "Corte de Cabelo",
  barber: "Barba",
  combo: "Corte e Barba",
  treatment: "Tratamentos"
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  
  // Get business hours from the hook
  const { getCalendarBusinessHours } = useBusinessHours();
  const businessHours = getCalendarBusinessHours();
  
  // Get appointments from the hook
  const { appointments, isLoading, fetchAppointments } = useAppointments();
  
  // Convert appointments to calendar format
  const calendarAppointments: AppointmentType[] = appointments.map(app => ({
    id: app.id,
    date: app.date,
    clientName: app.clientName,
    serviceName: app.serviceName,
    serviceType: app.serviceType,
    duration: app.duration,
    price: app.price,
    status: app.status
  }));
  
  // Refresh appointments when the component mounts or calendar view changes
  useEffect(() => {
    fetchAppointments();
    // Refreshing data when calendar view changes is a good practice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarView]);

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

  const handleSelectAppointment = (date: Date) => {
    setSelectedDate(date);
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
  const filteredAppointments = calendarAppointments.filter(app => 
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
    <div className="rounded-lg border border-blue-100 shadow-sm overflow-hidden bg-white">
      {isLoading ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Carregando agendamentos...</p>
        </div>
      ) : (
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CalendarFilter 
                serviceFilter={serviceFilter}
                onFilterChange={setServiceFilter}
                serviceTypes={SERVICE_TYPE_NAMES}
              />
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
            <WeekView
              currentDate={currentDate}
              weekAppointments={weekAppointments}
              onSelectAppointment={handleSelectAppointment}
              businessHours={businessHours}
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
      )}
      
      <CalendarFooter />
    </div>
  );
};
