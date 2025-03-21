
import { useState } from "react";
import { format, addHours, setHours, setMinutes, isWithinInterval, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, ChevronLeft, User, Tag } from "lucide-react";
import { AppointmentType } from "./types";
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
    <div className="border border-gray-200 rounded-lg bg-white">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBackToMonth}
        className="mb-2 text-gray-600 flex items-center gap-1 pl-2 m-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para visualização mensal
      </Button>
      
      <div className="text-sm font-medium text-gray-600 mb-4 flex items-center px-4">
        <Clock className="mr-2 h-4 w-4 text-blue-600" />
        <span className="font-semibold text-base text-gray-800">
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </span>
      </div>
      
      {appointments.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-gray-200 rounded-lg mx-4 mb-4 bg-gray-50">
          <CalendarIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Nenhum agendamento para este dia</p>
          <p className="text-sm text-gray-500 mt-1">Clique em + para adicionar um novo agendamento</p>
        </div>
      ) : (
        <div className="space-y-px pr-2 pl-2 max-h-[400px] overflow-y-auto">
          {timeSlots.map((slot, index) => {
            const slotAppointments = getAppointmentsForSlot(slot);
            const hasAppointment = slotAppointments.length > 0;
            const timeLabel = formatSlotTime(slot);
            const isHalfHour = index % 2 !== 0;
            
            return (
              <div 
                key={index}
                className={cn(
                  "flex items-stretch border-l-2 pl-3 py-2 mx-2",
                  hasAppointment ? "border-l-blue-600" : "border-l-gray-200",
                  hoveredSlot === timeLabel ? "bg-gray-50 rounded" : "",
                  isHalfHour ? "border-l-dashed" : ""
                )}
                onMouseEnter={() => setHoveredSlot(timeLabel)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                <div className="w-12 flex-shrink-0 flex items-center">
                  <span className={cn(
                    "text-sm font-medium",
                    hasAppointment ? "text-blue-700" : "text-gray-500"
                  )}>
                    {timeLabel}
                  </span>
                </div>
                
                <div className="flex-1">
                  {hasAppointment ? (
                    <div className="ml-2 space-y-2">
                      {slotAppointments.map(appointment => {
                        // Calculate height based on appointment duration
                        const heightClass = appointment.duration >= 90 
                          ? "min-h-[80px]" 
                          : appointment.duration >= 60 
                            ? "min-h-[65px]" 
                            : "min-h-[50px]";
                            
                        return (
                          <div 
                            key={appointment.id}
                            className={cn(
                              "p-3 rounded-lg border border-blue-100 bg-white shadow-sm hover:shadow-md cursor-pointer",
                              "hover:border-blue-300",
                              heightClass
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">{appointment.clientName}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <span className="text-blue-700">{appointment.serviceName}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="h-3 w-3 text-blue-600" />
                                    <span>{appointment.duration} min</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-500">
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
                      <div className="text-sm text-gray-400 italic">
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
