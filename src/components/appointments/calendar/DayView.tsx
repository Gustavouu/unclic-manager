
import { useState } from "react";
import { format, addHours, setHours, setMinutes, isWithinInterval, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, ChevronLeft, User, Tag } from "lucide-react";
import { AppointmentType } from "../AppointmentCalendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DayViewProps = {
  appointments: AppointmentType[];
  selectedDate?: Date;
  onBackToMonth: () => void;
};

export const DayView = ({ 
  appointments, 
  selectedDate = new Date(),
  onBackToMonth
}: DayViewProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  
  // Create time slots from 8am to 8pm (business hours)
  const businessStart = 8; // 8 AM
  const businessEnd = 20; // 8 PM
  
  const createTimeSlots = () => {
    const slots = [];
    const baseDate = setMinutes(setHours(selectedDate, businessStart), 0);
    
    for (let hour = businessStart; hour < businessEnd; hour++) {
      // Create slots at hourly intervals
      const slotTime = setHours(baseDate, hour);
      slots.push(slotTime);
      
      // Create 30-minute interval slot
      slots.push(addHours(slotTime, 0.5));
    }
    
    return slots;
  };
  
  const timeSlots = createTimeSlots();
  
  // Check if a time slot has an appointment
  const getAppointmentsForSlot = (slotTime: Date) => {
    return appointments.filter(appointment => 
      isWithinInterval(slotTime, {
        start: appointment.date,
        end: addHours(appointment.date, appointment.duration / 60) // Convert duration in minutes to hours
      })
    );
  };
  
  // Format for displaying the time (e.g., "10:00" or "10:30")
  const formatSlotTime = (date: Date) => {
    return format(date, "HH:mm");
  };
  
  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBackToMonth}
        className="mb-4 text-muted-foreground flex items-center gap-1 pl-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para visualização mensal
      </Button>
      
      <div className="text-sm font-medium text-muted-foreground mb-4 flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        <span>Horários para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>
      </div>
      
      {appointments.length === 0 ? (
        <div className="py-8 text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
          <p className="text-muted-foreground">Nenhum agendamento para este dia</p>
          <p className="text-sm text-muted-foreground/75">Clique em + para adicionar um novo agendamento</p>
        </div>
      ) : (
        <div className="space-y-1 pr-2 max-h-[500px] overflow-y-auto">
          {timeSlots.map((slot, index) => {
            const slotAppointments = getAppointmentsForSlot(slot);
            const hasAppointment = slotAppointments.length > 0;
            const timeLabel = formatSlotTime(slot);
            const isHalfHour = index % 2 !== 0;
            
            return (
              <div 
                key={index}
                className={cn(
                  "flex items-stretch border-l-2 pl-3 py-2 transition-all",
                  hasAppointment ? "border-l-primary" : "border-l-border/30",
                  hoveredSlot === timeLabel ? "bg-accent/10 rounded-lg" : "",
                  isHalfHour ? "border-l-dashed" : ""
                )}
                onMouseEnter={() => setHoveredSlot(timeLabel)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                <div className="w-16 flex-shrink-0 flex items-center">
                  <span className={cn(
                    "text-sm font-medium",
                    hasAppointment ? "text-primary" : "text-muted-foreground"
                  )}>
                    {timeLabel}
                  </span>
                </div>
                
                <div className="flex-1">
                  {hasAppointment ? (
                    <div className="ml-2 space-y-2">
                      {slotAppointments.map(appointment => {
                        // Calculate height based on appointment duration
                        const durationInMinutes = appointment.duration;
                        const heightClass = durationInMinutes >= 90 
                          ? "min-h-[90px]" 
                          : durationInMinutes >= 60 
                            ? "min-h-[70px]" 
                            : "min-h-[50px]";
                            
                        return (
                          <div 
                            key={appointment.id}
                            className={cn(
                              "p-3 rounded-lg border border-border/40 bg-white hover:shadow-md transition-all cursor-pointer",
                              "hover:border-border/80",
                              heightClass
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{appointment.clientName}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{appointment.serviceName}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{appointment.duration} min</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Tag className="h-3 w-3" />
                                    <span>R$ {appointment.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {format(appointment.date, "HH:mm")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="ml-2 h-full flex items-center">
                      <div className="text-sm text-muted-foreground/60 italic">
                        Disponível
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper component for the calendar icon
const CalendarIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
