
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
import { WeekView } from "./calendar/WeekView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { Button } from "@/components/ui/button";
import { Calendar, Grid3X3 } from "lucide-react";
import { AppointmentType, CalendarViewType, ServiceType, SERVICE_TYPE_NAMES } from "./calendar/types";
import { SAMPLE_APPOINTMENTS } from "./calendar/sampleData";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
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
          <WeekView
            currentDate={currentDate}
            weekAppointments={weekAppointments}
            onSelectAppointment={handleSelectAppointment}
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
