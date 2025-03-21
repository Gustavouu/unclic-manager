
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
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-xs font-medium text-center text-gray-600 p-2 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-100">
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
            <div key={index} className="bg-white">
              {day ? (
                <button
                  className={cn(
                    "w-full h-16 sm:h-24 flex flex-col items-center justify-start p-1 transition-all",
                    isSameDay(day, selectedDate) && "bg-blue-50",
                    isToday && !isSameDay(day, selectedDate) && "bg-blue-50/50",
                    !isToday && !isSameDay(day, selectedDate) && "hover:bg-gray-50"
                  )}
                  onClick={() => onSelectDay(day)}
                >
                  <span className={cn(
                    "h-7 w-7 flex items-center justify-center text-sm rounded-full mb-1",
                    isToday && "bg-blue-600 text-white",
                    isSameDay(day, selectedDate) && !isToday && "bg-blue-100 text-blue-800 font-medium",
                    !isToday && !isSameDay(day, selectedDate) && "text-gray-700"
                  )}>
                    {format(day, "d")}
                  </span>
                  
                  {hasAppointments && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isSameDay(day, selectedDate) 
                        ? "bg-blue-200 text-blue-800" 
                        : "bg-gray-200 text-gray-800"
                    )}>
                      {appointmentCount}
                    </span>
                  )}
                </button>
              ) : (
                <div className="w-full h-16 sm:h-24 bg-gray-50/50" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
