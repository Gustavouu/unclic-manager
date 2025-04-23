
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

interface AppointmentCalendarProps {
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
        
        // Buscar agendamentos do mês
        const { data, error } = await supabase
          .from('agendamentos')
          .select(`
            id,
            data,
            hora_inicio,
            id_cliente(id, nome),
            id_servico(id, nome, id_categoria)
          `)
          .eq('id_negocio', businessId)
          .gte('data', startDate)
          .lte('data', endDate);
          
        if (error) {
          throw error;
        }
        
        // Converter dados para o formato de AppointmentType
        if (data) {
          const formattedAppointments: AppointmentType[] = data.map((appointment: any) => {
            // Criar data combinando data e hora
            const [hours, minutes] = appointment.hora_inicio.split(':');
            const appointmentDate = parseISO(appointment.data);
            appointmentDate.setHours(parseInt(hours));
            appointmentDate.setMinutes(parseInt(minutes));
            
            // Handle cliente nome correctly
            let clientName = "Cliente não identificado";
            if (appointment.id_cliente) {
              clientName = typeof appointment.id_cliente === 'object' ? 
                appointment.id_cliente.nome : 
                "Cliente não identificado";
            }
            
            // Handle servico nome correctly
            let serviceName = "Serviço não identificado";
            if (appointment.id_servico) {
              serviceName = typeof appointment.id_servico === 'object' ? 
                appointment.id_servico.nome : 
                "Serviço não identificado";
            }
            
            return {
              id: appointment.id,
              date: appointmentDate,
              clientName: clientName,
              serviceName: serviceName,
              serviceType: 'all' // Mapear categoria quando disponível
            };
          });
          
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border/40 animate-fade-in overflow-hidden">
      <CalendarProvider appointments={appointments}>
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
              appointments={appointments}
              onSelectDay={handleSelectDay}
            />
          )}
          
          {calendarView === "day" && (
            <DayView 
              appointments={[]} 
              selectedDate={selectedDate}
            />
          )}
        </div>
        
        <CalendarFooter />
      </CalendarProvider>
    </div>
  );
};
