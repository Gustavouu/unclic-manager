
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
    <div className="rounded-lg border border-border/30 p-4 bg-white shadow-sm">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-xs text-center font-semibold text-muted-foreground py-2"
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
            
          // Determine if today
          const isToday = day ? isSameDay(day, new Date()) : false;
          
          return (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  className={cn(
                    "w-full h-full rounded-lg flex flex-col items-center justify-center transition-all",
                    isSameDay(day, selectedDate) && "bg-primary text-primary-foreground font-medium shadow-md",
                    isToday && !isSameDay(day, selectedDate) && "bg-blue-50 border border-blue-200 font-medium",
                    !isToday && !isSameDay(day, selectedDate) && "hover:bg-muted/60 border border-transparent hover:border-border/40"
                  )}
                  onClick={() => onSelectDay(day)}
                >
                  <span className={cn(
                    "mb-1",
                    isToday && !isSameDay(day, selectedDate) && "text-blue-700"
                  )}>
                    {format(day, "d")}
                  </span>
                  
                  {hasAppointments && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px]",
                      isSameDay(day, selectedDate) 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : isToday
                          ? "bg-blue-200 text-blue-700"
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
    </div>
  );
};
