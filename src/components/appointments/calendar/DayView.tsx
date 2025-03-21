
import { useState } from "react";
import { format, addHours, setHours, setMinutes, isWithinInterval, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, ChevronLeft, User, Tag } from "lucide-react";
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
    <div className="rounded-lg border border-border/30 p-4 bg-white shadow-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBackToMonth}
        className="mb-4 text-muted-foreground flex items-center gap-1 pl-1 hover:bg-blue-50 hover:text-blue-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para visualização mensal
      </Button>
      
      <div className="text-sm font-medium text-muted-foreground mb-6 flex items-center">
        <Clock className="mr-2 h-4 w-4 text-blue-600" />
        <span className="font-semibold text-base text-foreground">
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </span>
      </div>
      
      {appointments.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-border/40 rounded-lg bg-muted/20">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
          <p className="text-muted-foreground font-medium">Nenhum agendamento para este dia</p>
          <p className="text-sm text-muted-foreground/75 mt-1">Clique em + para adicionar um novo agendamento</p>
        </div>
      ) : (
        <div className="space-y-1 pr-2 max-h-[500px] overflow-y-auto rounded-lg">
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
                  hasAppointment ? "border-l-blue-600" : "border-l-border/30",
                  hoveredSlot === timeLabel ? "bg-blue-50 rounded-lg" : "",
                  isHalfHour ? "border-l-dashed" : ""
                )}
                onMouseEnter={() => setHoveredSlot(timeLabel)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                <div className="w-16 flex-shrink-0 flex items-center">
                  <span className={cn(
                    "text-sm font-medium",
                    hasAppointment ? "text-blue-700" : "text-muted-foreground"
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
                              "p-3 rounded-lg border border-blue-100 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer",
                              "hover:border-blue-300",
                              heightClass
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-slate-800">{appointment.clientName}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span className="text-blue-700">{appointment.serviceName}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3 text-blue-600" />
                                    <span>{appointment.duration} min</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Tag className="h-3 w-3 text-blue-600" />
                                    <span>R$ {appointment.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
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
