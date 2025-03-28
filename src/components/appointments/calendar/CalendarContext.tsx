
import { createContext, useContext, useState } from "react";
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
  subWeeks
} from "date-fns";
import { AppointmentType, CalendarViewType, ServiceType } from "./types";

interface CalendarContextProps {
  currentDate: Date;
  selectedDate: Date;
  calendarView: CalendarViewType;
  serviceFilter: ServiceType;
  calendarDays: (Date | null)[];
  filteredAppointments: AppointmentType[];
  dayAppointments: AppointmentType[];
  weekAppointments: AppointmentType[];
  
  // Actions
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setCalendarView: (view: CalendarViewType) => void;
  setServiceFilter: (filter: ServiceType) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  handleSelectDate: (date: Date | undefined) => void;
  handleSelectDay: (day: Date) => void;
  handleSelectAppointment: (date: Date) => void;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}

interface CalendarProviderProps {
  appointments: AppointmentType[];
  children: React.ReactNode;
}

export function CalendarProvider({ appointments, children }: CalendarProviderProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  
  // Navigation functions
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
  const filteredAppointments = appointments.filter(app => 
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

  const value = {
    currentDate,
    selectedDate,
    calendarView,
    serviceFilter,
    calendarDays,
    filteredAppointments,
    dayAppointments,
    weekAppointments,
    
    setCurrentDate,
    setSelectedDate,
    setCalendarView,
    setServiceFilter,
    nextPeriod,
    prevPeriod,
    handleSelectDate,
    handleSelectDay,
    handleSelectAppointment
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
