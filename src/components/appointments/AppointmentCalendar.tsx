
import { useState, useEffect } from "react";
import { weekDays } from "./calendar/constants";
import { CalendarFilter } from "./calendar/CalendarFilter";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { WeekView } from "./calendar/WeekView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { CalendarViewType, AppointmentType, AppointmentStatus as ComponentAppointmentStatus } from "./types";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { AppointmentDialog } from "./dialog/AppointmentDialog";
import { CalendarProvider, useCalendarContext } from "./calendar/CalendarContext";
import { SERVICE_TYPE_NAMES } from "./types";
import { toast } from "sonner";

interface AppointmentCalendarProps {
  initialView?: CalendarViewType;
}

export const AppointmentCalendar = ({ initialView }: AppointmentCalendarProps) => {
  // Get appointments from the hook
  const { appointments, isLoading, fetchAppointments } = useAppointments();
  
  // Convert appointments to calendar format
  const calendarAppointments: AppointmentType[] = appointments.map(app => ({
    id: app.id,
    date: app.date,
    clientName: app.clientName,
    serviceName: app.serviceName,
    serviceType: app.serviceType,
    duration: app.duration || 60,
    price: app.price || 0,
    status: app.status as ComponentAppointmentStatus, // Type casting to ensure compatibility
    professionalId: app.professionalId
  }));
  
  // Refresh appointments when the component mounts and every 30 seconds
  useEffect(() => {
    console.log("Fetching appointments in AppointmentCalendar");
    fetchAppointments();
    
    // Set up a polling interval to refresh appointments
    const intervalId = setInterval(() => {
      console.log("Refreshing appointments (interval)");
      fetchAppointments();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchAppointments]);

  return (
    <CalendarProvider appointments={calendarAppointments}>
      <CalendarContent isLoading={isLoading} initialView={initialView} />
    </CalendarProvider>
  );
};

interface CalendarContentProps {
  isLoading: boolean;
  initialView?: CalendarViewType;
}

const CalendarContent = ({ isLoading, initialView }: CalendarContentProps) => {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  
  const { 
    calendarView, 
    setCalendarView,
    serviceFilter,
    setServiceFilter,
    calendarDays,
    selectedDate,
    filteredAppointments,
    dayAppointments,
    weekAppointments,
    selectedAppointment,
    setSelectedAppointment,
    handleSelectDay,
    handleSelectAppointment,
    isDragging,
  } = useCalendarContext();
  
  // Set initial view from props if provided
  useEffect(() => {
    if (initialView) {
      setCalendarView(initialView);
    }
  }, [initialView, setCalendarView]);
  
  // Get business hours from the hook
  const { getCalendarBusinessHours } = useBusinessHours();
  const businessHours = getCalendarBusinessHours();
  
  // Abrir diálogo de agendamento quando um agendamento é selecionado
  useEffect(() => {
    if (selectedAppointment) {
      setAppointmentDialogOpen(true);
    }
  }, [selectedAppointment]);
  
  // Fechar o diálogo e limpar o agendamento selecionado
  const handleDialogClose = () => {
    setAppointmentDialogOpen(false);
    setSelectedAppointment(null);
  };
  
  // Quando estamos arrastando um agendamento
  useEffect(() => {
    if (isDragging) {
      toast.info("Arraste para a nova data e hora desejada", {
        duration: 2000
      });
    }
  }, [isDragging]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-100 shadow-sm overflow-hidden bg-white">
      <div className="p-4">
        <CalendarHeader />
        
        <div className="mb-4 border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CalendarFilter 
              serviceFilter={serviceFilter}
              onFilterChange={setServiceFilter}
              serviceTypes={SERVICE_TYPE_NAMES}
            />
            
            {/* Instrução de drag-and-drop */}
            <div className="text-xs text-gray-500 italic ml-2">
              Arraste e solte os agendamentos para alterar data/hora
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
            weekAppointments={filteredAppointments}
            onSelectAppointment={handleSelectAppointment}
            businessHours={businessHours}
          />
        )}
        
        {calendarView === "day" && (
          <DayView 
            appointments={dayAppointments} 
            onBackToMonth={() => setCalendarView("month")}
          />
        )}
      </div>
      
      <CalendarFooter />
      
      {/* Diálogo de detalhes do agendamento */}
      {selectedAppointment && (
        <AppointmentDialog
          open={appointmentDialogOpen}
          onClose={handleDialogClose}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};
