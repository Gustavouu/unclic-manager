
import { useState, useEffect } from "react";
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameDay,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { MonthView } from "./calendar/MonthView";
import { DayView } from "./calendar/DayView";
import { CalendarFooter } from "./calendar/CalendarFooter";
import { ServiceFilter } from "./calendar/ServiceFilter";
import { supabase } from "@/integrations/supabase/client";
import { CalendarProvider } from "../appointments/calendar/CalendarContext";
import { AppointmentType as CalendarAppointmentType } from "../appointments/calendar/types";

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

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export type AppointmentType = {
  id: string;
  date: Date;
  clientName: string;
  serviceName: string;
  serviceType: string;
};

export interface AppointmentCalendarProps {
  businessId: string | null;
}

export const AppointmentCalendar = ({ businessId }: AppointmentCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "day">("month");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar agendamentos do Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        
        // Configurar datas para o mês atual
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        
        const startDate = monthStart.toISOString().split('T')[0];
        const endDate = monthEnd.toISOString().split('T')[0];
        
        // First try bookings table (new schema)
        let data: any[] = [];
        let error = null;

        try {
          const response = await supabase
            .from('bookings')
            .select(`
              id,
              booking_date,
              start_time,
              client:client_id (id, name),
              service:service_id (id, name, type)
            `)
            .eq('business_id', businessId)
            .gte('booking_date', startDate)
            .lte('booking_date', endDate);
          
          if (!response.error && response.data && response.data.length > 0) {
            data = response.data;
          } else {
            error = response.error;
          }
        } catch (err) {
          console.error('Error fetching from bookings:', err);
          error = err;
        }

        if (error || data.length === 0) {
          // Fallback to legacy table
          try {
            console.log('Falling back to legacy appointments table');
            const legacyResponse = await supabase
              .from('appointments')
              .select(`
                id,
                data,
                hora_inicio,
                client:client_id (id, name),
                service:service_id (id, name)
              `)
              .eq('business_id', businessId)
              .gte('data', startDate)
              .lte('data', endDate);

            if (!legacyResponse.error) {
              data = legacyResponse.data || [];
            }
          } catch (legacyErr) {
            console.error('Error fetching from legacy appointments:', legacyErr);
          }
        }
        
        // Converter dados para o formato de AppointmentType
        const formattedAppointments: AppointmentType[] = data.map((appointment: any) => {
          // Get date and time fields (handling both schemas)
          const dateField = appointment.booking_date || appointment.data;
          const timeField = appointment.start_time || appointment.hora_inicio;
          
          // Create date combining date and time
          const [hours, minutes] = (timeField || '00:00').split(':');
          const appointmentDate = parseISO(dateField);
          appointmentDate.setHours(parseInt(hours));
          appointmentDate.setMinutes(parseInt(minutes));
          
          // Handle client name correctly
          let clientName = "Cliente não identificado";
          if (appointment.client) {
            clientName = typeof appointment.client === 'object' ? 
              appointment.client.name || appointment.client.nome || "Cliente não identificado" : 
              "Cliente não identificado";
          }
          
          // Handle service name correctly
          let serviceName = "Serviço não identificado";
          let serviceType = "all";
          if (appointment.service) {
            if (typeof appointment.service === 'object') {
              serviceName = appointment.service.name || appointment.service.nome || "Serviço não identificado";
              serviceType = appointment.service.type || "all";
            }
          }
          
          return {
            id: appointment.id,
            date: appointmentDate,
            clientName,
            serviceName,
            serviceType
          };
        });
        
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchAppointments();
    }
  }, [businessId, currentMonth]);

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

  // Transform appointments to match the CalendarAppointmentType
  const calendarAppointments: CalendarAppointmentType[] = appointments.map(app => ({
    id: app.id,
    date: app.date,
    clientName: app.clientName,
    serviceName: app.serviceName,
    serviceType: app.serviceType,
    // Add required properties from CalendarAppointmentType
    duration: 60, // Default duration of 60 minutes
    price: 0,     // Default price of 0
    professionalId: "default", // Default professional ID
    status: "agendado" // Default status
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border/40 animate-fade-in overflow-hidden">
      <CalendarProvider appointments={calendarAppointments}>
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
          
          <ServiceFilter 
            serviceFilter={serviceFilter}
            onFilterChange={setServiceFilter}
            serviceTypes={SERVICE_TYPE_NAMES}
          />
          
          {calendarView === "month" && (
            <MonthView
              calendarDays={[]}
              weekDays={weekDays}
              selectedDate={selectedDate}
              appointments={calendarAppointments}
              onSelectDay={handleSelectDay}
            />
          )}
          
          {calendarView === "day" && (
            <DayView 
              appointments={calendarAppointments.filter(app => isSameDay(app.date, selectedDate))} 
              selectedDate={selectedDate}
            />
          )}
        </div>
        
        <CalendarFooter />
      </CalendarProvider>
    </div>
  );
};
