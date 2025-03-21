
import { useState } from "react";
import { format, addHours, setHours, setMinutes, isWithinInterval } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { AppointmentType } from "../Calendar";
import { cn } from "@/lib/utils";

type DayViewProps = {
  appointments: AppointmentType[];
  selectedDate?: Date;
};

export const DayView = ({ appointments, selectedDate = new Date() }: DayViewProps) => {
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
        end: addHours(appointment.date, 1) // Assuming appointments last 1 hour
      })
    );
  };
  
  // Format for displaying the time (e.g., "10:00" or "10:30")
  const formatSlotTime = (date: Date) => {
    return format(date, "HH:mm");
  };
  
  if (appointments.length === 0) {
    return (
      <div className="py-8 text-center">
        <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
        <p className="text-muted-foreground">Nenhum agendamento para este dia</p>
        <p className="text-sm text-muted-foreground/75">Clique em + para adicionar um novo agendamento</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        <span>Horários para {format(selectedDate, "dd 'de' MMMM")}</span>
      </div>
      
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
              hoveredSlot === timeLabel ? "bg-accent/20" : "",
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
                  {slotAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="p-3 rounded-lg border border-border/40 bg-white shadow-sm hover:border-border/80 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{appointment.clientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                        </div>
                        <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {format(appointment.date, "HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))}
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
  );
};
