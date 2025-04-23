
// Fix the import and remove dummy implementation
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
  subWeeks,
  addMinutes
} from "date-fns";
import { AppointmentType, CalendarViewType, ServiceType } from "./types";
import { toast } from "sonner";
import { useAppointmentUpdate } from "@/hooks/appointments/useAppointmentUpdate";
import { useAppointmentConflicts } from "@/hooks/appointments/useAppointmentConflicts";
import { Appointment, AppointmentStatus } from "../types";

// Define the parameters type for validateAppointmentTime
interface ConflictCheckParams {
  date: Date;
  duration: number;
  professionalId?: string;
  appointmentId?: string;
}

interface CalendarContextProps {
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
  
  // Actions
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
  // Drag and drop
  handleDragStart: (appointmentId: string) => void;
  handleDragEnd: (newDate: Date) => Promise<boolean>;
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
  const [professionalFilter, setProfessionalFilter] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Hooks for appointment updates
  const { updateAppointment } = useAppointmentUpdate();
  
  // Convert AppointmentType[] to Appointment[] for the useAppointmentConflicts hook
  const appointmentsForConflict: Appointment[] = appointments.map(app => ({
    id: app.id,
    clientName: app.clientName,
    serviceName: app.serviceName,
    date: app.date,
    status: (app.status as AppointmentStatus) || "agendado",
    price: app.price,
    serviceType: app.serviceType,
    duration: app.duration,
    professionalId: app.professionalId
  }));
  
  // Use the hook with the converted appointments
  const { validateAppointmentTime } = useAppointmentConflicts(appointmentsForConflict);
  
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

  const handleSelectAppointment = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
  };
  
  // Drag & Drop handlers
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
      // Check if the new date and time is valid
      const params: ConflictCheckParams = {
        date: newDate,
        duration: selectedAppointment.duration,
        appointmentId: selectedAppointment.id
      };
      
      if (selectedAppointment.professionalId) {
        params.professionalId = selectedAppointment.professionalId;
      }
      
      const validationResult = validateAppointmentTime(params);
      
      if (!validationResult.valid) {
        toast.error(`Não foi possível mover o agendamento: ${validationResult.reason}`);
        return false;
      }
      
      // Update the appointment with the new date
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

  // Filtrar agendamentos com base nos filtros selecionados
  const filteredAppointments = appointments.filter(app => {
    // Filtro por tipo de serviço
    if (serviceFilter !== "all" && app.serviceType !== serviceFilter) {
      return false;
    }
    
    // Filtro por profissional
    if (professionalFilter && (app as any).professionalId !== professionalFilter) {
      return false;
    }
    
    return true;
  });

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

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
