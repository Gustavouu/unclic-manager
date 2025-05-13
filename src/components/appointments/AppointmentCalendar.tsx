
import { useState, useEffect } from "react";
import { weekDays } from "./calendar/constants";
import { CalendarFilter } from "./calendar/CalendarFilter";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { WeekView } from "./calendar/WeekView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { CalendarViewType } from "./types";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { AppointmentDialog } from "./dialog/AppointmentDialog";
import { CalendarProvider, useCalendarContext } from "./calendar/CalendarContext";
import { SERVICE_TYPE_NAMES } from "./types";
import { toast } from "sonner";
import { Appointment } from "@/hooks/appointments/types";

interface AppointmentCalendarProps {
  initialView?: CalendarViewType;
  appointments?: Appointment[];
  isLoading?: boolean;
  onAppointmentUpdate?: () => void;
  onAppointmentDelete?: (id: string) => Promise<void>;
}

export const AppointmentCalendar = ({ 
  initialView,
  appointments = [],
  isLoading = false,
  onAppointmentUpdate,
  onAppointmentDelete
}: AppointmentCalendarProps) => {
  // Convert appointments to calendar format if needed
  return (
    <CalendarProvider appointments={appointments}>
      <CalendarContent 
        isLoading={isLoading} 
        initialView={initialView} 
        onAppointmentUpdate={onAppointmentUpdate}
        onAppointmentDelete={onAppointmentDelete}
      />
    </CalendarProvider>
  );
};

interface CalendarContentProps {
  isLoading: boolean;
  initialView?: CalendarViewType;
  onAppointmentUpdate?: () => void;
  onAppointmentDelete?: (id: string) => Promise<void>;
}

const CalendarContent = ({ 
  isLoading, 
  initialView,
  onAppointmentUpdate,
  onAppointmentDelete 
}: CalendarContentProps) => {
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
    if (onAppointmentUpdate) {
      onAppointmentUpdate();
    }
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
          onDelete={onAppointmentDelete}
        />
      )}
    </div>
  );
};
