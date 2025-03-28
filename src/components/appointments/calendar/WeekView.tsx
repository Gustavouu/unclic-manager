
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentType } from "./types";
import { cn } from "@/lib/utils";
import { useCalendarContext } from "./CalendarContext";

type WeekViewProps = {
  weekAppointments: AppointmentType[];
  onSelectAppointment: (date: Date) => void;
  businessHours?: Record<string, { isOpen: boolean; hours?: string }>;
};

export const WeekView = ({
  weekAppointments,
  onSelectAppointment,
  businessHours: propBusinessHours,
}: WeekViewProps) => {
  const { currentDate } = useCalendarContext();
  // Get business hours from the hook or from props
  const { getCalendarBusinessHours } = useBusinessHours();
  const businessHours = propBusinessHours || getCalendarBusinessHours();
  
  // Get all days of the week from the context's calendarDays
  const weekDays = Array.isArray(weekAppointments) ? 
    [...new Set(weekAppointments.map(app => format(app.date, 'yyyy-MM-dd')))]
      .map(dateStr => new Date(dateStr)) : 
    [];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
      {weekDays.map((day, index) => {
        // Get appointments for this day
        const dayAppointments = weekAppointments.filter(app => isSameDay(app.date, day));
        const hasAppointments = dayAppointments.length > 0;
        const dayOfWeek = day.getDay();
        const isOpen = businessHours[dayOfWeek]?.isOpen;
        
        return (
          <div 
            key={index} 
            className={cn(
              "border rounded-lg shadow-sm",
              isOpen ? "border-gray-200" : "border-gray-100 bg-gray-50"
            )}
          >
            <div className={cn(
              "p-2 border-b flex justify-between items-center",
              isOpen ? "bg-blue-50 border-blue-100 text-blue-800" : "bg-gray-100 border-gray-200"
            )}>
              <h3 className={cn(
                "text-sm font-medium",
                isOpen ? "text-blue-800" : "text-gray-500"
              )}>
                {format(day, "EEEE, dd/MM", { locale: ptBR })}
              </h3>
              {!isOpen && (
                <span className="text-xs font-medium bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                  Fechado
                </span>
              )}
              {isOpen && businessHours[dayOfWeek]?.hours && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {businessHours[dayOfWeek]?.hours}
                </span>
              )}
            </div>
            
            <div className={cn(
              "divide-y divide-gray-100",
              !isOpen && "opacity-50"
            )}>
              {isOpen && hasAppointments ? (
                dayAppointments
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(appointment => (
                    <div 
                      key={appointment.id}
                      className="p-3 hover:bg-blue-50/30 transition-colors cursor-pointer flex justify-between"
                      onClick={() => onSelectAppointment(appointment.date)}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{appointment.clientName}</p>
                        <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{appointment.duration} min</span>
                          <span>R$ {appointment.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
                          {format(appointment.date, "HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))
              ) : isOpen ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  Nenhum agendamento
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">
                  Estabelecimento fechado
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
