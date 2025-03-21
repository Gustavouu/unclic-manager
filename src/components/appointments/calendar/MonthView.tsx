
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { AppointmentType } from "../AppointmentCalendar";

type MonthViewProps = {
  calendarDays: (Date | null)[];
  weekDays: string[];
  selectedDate: Date;
  appointments: AppointmentType[];
  onSelectDay: (day: Date) => void;
};

export const MonthView = ({
  calendarDays,
  weekDays,
  selectedDate,
  appointments,
  onSelectDay,
}: MonthViewProps) => {
  return (
    <>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-xs text-center font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          // Check if this day has appointments
          const hasAppointments = day 
            ? appointments.some(app => isSameDay(app.date, day)) 
            : false;
            
          // Get count of appointments for this day
          const appointmentCount = day
            ? appointments.filter(app => isSameDay(app.date, day)).length
            : 0;
            
          return (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  className={cn(
                    "w-full h-full rounded-lg flex flex-col items-center justify-center text-sm relative transition-all",
                    isSameDay(day, selectedDate) && "bg-primary text-primary-foreground font-medium",
                    isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "bg-muted font-medium",
                    !isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "hover:bg-muted/60"
                  )}
                  onClick={() => onSelectDay(day)}
                >
                  <span className="mb-1">{format(day, "d")}</span>
                  {hasAppointments && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isSameDay(day, selectedDate) 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {appointmentCount}
                    </span>
                  )}
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
