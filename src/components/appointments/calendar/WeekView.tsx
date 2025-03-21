
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentType } from "./types";

type WeekViewProps = {
  currentDate: Date;
  weekAppointments: AppointmentType[];
  onSelectAppointment: (date: Date) => void;
};

export const WeekView = ({
  currentDate,
  weekAppointments,
  onSelectAppointment
}: WeekViewProps) => {
  // Get all days of the week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {weekDays.map((day, index) => {
        // Get appointments for this day
        const dayAppointments = weekAppointments.filter(app => isSameDay(app.date, day));
        const hasAppointments = dayAppointments.length > 0;
        
        return (
          <div key={index} className="border border-gray-200 rounded-lg">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                {format(day, "EEEE, dd/MM", { locale: ptBR })}
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {hasAppointments ? (
                dayAppointments
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(appointment => (
                    <div 
                      key={appointment.id}
                      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onSelectAppointment(appointment.date)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{appointment.clientName}</p>
                          <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{appointment.duration} min</span>
                            <span>R$ {appointment.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full mb-1">
                            {format(appointment.date, "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum agendamento
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
