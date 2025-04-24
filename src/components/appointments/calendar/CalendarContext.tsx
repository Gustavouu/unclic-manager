import React, { createContext, useContext, useState } from 'react';
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
import { toast } from "sonner";
import { useAppointmentUpdate } from "@/hooks/appointments/useAppointmentUpdate";
import { useAppointmentConflicts } from "@/hooks/appointments/useAppointmentConflicts";
import { Appointment, AppointmentStatus } from "../types";

interface ConflictCheckParams {
  date: Date;
  duration: number;
  professionalId?: string;
  appointmentId?: string;
}

interface CalendarContextType {
  currentDate: Date;
  selectedDate: Date;
  calendarView: CalendarViewType;
  serviceFilter: ServiceType;
  professionalFilter: string | null;
  calendarDays: (Date | null)[];
  filteredAppointments: AppointmentType[];
  dayAppointments: AppointmentType[];
  weekAppointments: AppointmentType[];
  selectedAppointment: AppointmentType | null;
  isDragging: boolean;
  
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setCalendarView: (view: CalendarViewType) => void;
  setServiceFilter: (filter: ServiceType) => void;
  setProfessionalFilter: (professionalId: string | null) => void;
  setSelectedAppointment: (appointment: AppointmentType | null) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  handleSelectDate: (date: Date | undefined) => void;
  handleSelectDay: (day: Date) => void;
  handleSelectAppointment: (appointment: AppointmentType) => void;
  handleDragStart: (appointmentId: string) => void;
  handleDragEnd: (newDate: Date) => Promise<boolean>;
}

// Define the props interface for the CalendarProvider
interface CalendarProviderProps {
  children: React.ReactNode;
  appointments: AppointmentType[];
}

const CalendarContext = createContext<CalendarContextType>({} as CalendarContextType);

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children, appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  const [professionalFilter, setProfessionalFilter] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localAppointments, setLocalAppointments] = useState<AppointmentType[]>(appointments);
  
  const { updateAppointment } = useAppointmentUpdate(setLocalAppointments);
  
  const appointmentsForConflict: Appointment[] = appointments.map(app => ({
    id: app.id,
    clientName: app.clientName,
    serviceName: app.serviceName,
    date: app.date,
    status: (app.status as AppointmentStatus) || "agendado",
    price: app.price,
    serviceType: app.serviceType,
    duration: app.duration,
    clientId: "default-client-id",
    professionalId: app.professionalId
  }));
  
  const { validateAppointmentTime } = useAppointmentConflicts(appointmentsForConflict);
  
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

  const handleSelectAppointment = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
  };
  
  const handleDragStart = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsDragging(true);
    }
  };
  
  const handleDragEnd = async (newDate: Date): Promise<boolean> => {
    setIsDragging(false);
    
    if (!selectedAppointment) {
      return false;
    }
    
    try {
      const params: ConflictCheckParams = {
        date: newDate,
        duration: selectedAppointment.duration,
        professionalId: selectedAppointment.professionalId,
        appointmentId: selectedAppointment.id
      };
      
      const validationResult = validateAppointmentTime(params);
      
      if (!validationResult.valid) {
        toast.error(`Não foi possível mover o agendamento: ${validationResult.reason}`);
        return false;
      }
      
      await updateAppointment(selectedAppointment.id, {
        date: newDate
      });
      
      toast.success(`Agendamento movido para ${newDate.toLocaleString()}`);
      setSelectedAppointment(null);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      toast.error("Erro ao mover agendamento");
      return false;
    }
  };

  let calendarDays: (Date | null)[] = [];
  
  if (calendarView === "month") {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startWeekday = getDay(monthStart);
    
    calendarDays = Array(startWeekday).fill(null);
    monthDays.forEach(day => calendarDays.push(day));
  } else if (calendarView === "week") {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    calendarDays = weekDays;
  }

  const filteredAppointments = appointments.filter(app => {
    if (serviceFilter !== "all" && app.serviceType !== serviceFilter) {
      return false;
    }
    
    if (professionalFilter && app.professionalId !== professionalFilter) {
      return false;
    }
    
    return true;
  });

  const dayAppointments = filteredAppointments.filter(app => 
    isSameDay(app.date, selectedDate)
  );

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
    professionalFilter,
    calendarDays,
    filteredAppointments,
    dayAppointments,
    weekAppointments,
    selectedAppointment,
    isDragging,
    
    setCurrentDate,
    setSelectedDate,
    setCalendarView,
    setServiceFilter,
    setProfessionalFilter,
    setSelectedAppointment,
    nextPeriod,
    prevPeriod,
    handleSelectDate,
    handleSelectDay,
    handleSelectAppointment,
    handleDragStart,
    handleDragEnd
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendarContext must be used within CalendarProvider');
  return context;
};
