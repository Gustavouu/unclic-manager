
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  clientName: string;
  service?: string;
}

interface DayViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointments: Appointment[];
  onAppointmentClick?: (appointmentId: string) => void;
}

export const DayView = ({
  selectedDate,
  onDateChange,
  appointments,
  onAppointmentClick
}: DayViewProps) => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  // Generate time slots from 8 AM to 8 PM in 15-minute intervals
  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    setTimeSlots(slots);
  }, []);

  // Navigate to previous/next day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  // Format date for display
  const formattedDate = format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-semibold capitalize">{formattedDate}</h3>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {timeSlots.map((time) => {
          const appointmentsAtTime = appointments.filter(
            (app) => app.startTime === time
          );

          return (
            <div key={time} className="flex">
              <div className="w-16 text-sm text-muted-foreground py-1">{time}</div>
              <div className="flex-grow grid grid-cols-1 gap-2 pl-2">
                {appointmentsAtTime.length > 0 ? (
                  appointmentsAtTime.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className={cn(
                        "p-2 text-xs cursor-pointer transition-shadow hover:shadow-md",
                        appointment.status === "agendado" || appointment.status === "scheduled" 
                          ? "bg-blue-50" 
                          : appointment.status === "concluido" || appointment.status === "completed" 
                          ? "bg-green-50" 
                          : "bg-red-50"
                      )}
                      onClick={() => onAppointmentClick && onAppointmentClick(appointment.id)}
                    >
                      <p className="font-semibold">{appointment.clientName}</p>
                      <p>{appointment.service || "Serviço não especificado"}</p>
                      <span className="text-[10px] bg-primary/10 px-1 rounded">
                        {appointment.status}
                      </span>
                    </Card>
                  ))
                ) : (
                  <div className="h-8 border border-dashed border-gray-200 rounded-md"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
