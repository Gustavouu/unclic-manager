
import { useState } from "react";
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameDay 
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { CalendarFooter } from "./calendar/CalendarFooter";

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

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date);
    }
  };

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    setCalendarView("day");
  };

  // Create calendar grid with correct starting position
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
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
        <CalendarHeader 
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          calendarView={calendarView}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onSelectDate={handleSelectDate}
          onViewChange={setCalendarView}
        />
        
        {calendarView === "month" && (
          <MonthView
            calendarDays={calendarDays}
            weekDays={weekDays}
            selectedDate={selectedDate}
            appointments={SAMPLE_APPOINTMENTS}
            onSelectDay={handleSelectDay}
          />
        )}
        
        {calendarView === "day" && (
          <DayView appointments={dayAppointments} />
        )}
      </div>
      
      <CalendarFooter />
    </div>
  );
};
