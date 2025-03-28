
import { useState, useEffect } from "react";
import { weekDays } from "./calendar/constants";
import { CalendarFilter } from "./calendar/CalendarFilter";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { WeekView } from "./calendar/WeekView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { AppointmentType, CalendarViewType } from "./calendar/types";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { CalendarProvider, useCalendarContext } from "./calendar/CalendarContext";
import { SERVICE_TYPE_NAMES } from "./types";

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
    duration: app.duration,
    price: app.price,
    status: app.status
  }));
  
  // Refresh appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    handleSelectDay,
    handleSelectAppointment
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
            weekAppointments={weekAppointments}
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
    </div>
  );
};
