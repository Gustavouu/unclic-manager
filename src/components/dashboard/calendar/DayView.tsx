
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { AppointmentType } from "../Calendar";

type DayViewProps = {
  appointments: AppointmentType[];
};

export const DayView = ({ appointments }: DayViewProps) => {
  return (
    <>
      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map(appointment => (
            <div 
              key={appointment.id} 
              className="flex items-center gap-4 p-3 rounded-lg border border-border/40 hover:border-border/80 transition-all bg-white"
            >
              <div className="text-center">
                <p className="text-sm font-medium">
                  {format(appointment.date, "HH:mm")}
                </p>
              </div>
              <div className="flex-1">
                <p className="font-medium">{appointment.clientName}</p>
                <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
          <p className="text-muted-foreground">Nenhum agendamento para este dia</p>
          <p className="text-sm text-muted-foreground/75">Clique em + para adicionar um novo agendamento</p>
        </div>
      )}
    </>
  );
};
