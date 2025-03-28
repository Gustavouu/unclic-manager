
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Clock, UserCheck, AlertTriangle } from "lucide-react";
import { appointments } from "./data/appointmentsSampleData";
import { format, isToday, isTomorrow, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const AppointmentStats = () => {
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Calculate stats
  const todayAppointments = appointments.filter(app => isToday(new Date(app.date)));
  const tomorrowAppointments = appointments.filter(app => isTomorrow(new Date(app.date)));
  const upcomingAppointments = appointments.filter(app => 
    isAfter(new Date(app.date), today) && 
    app.status === "agendado"
  );
  const pendingAppointments = appointments.filter(app => app.status === "agendado");

  // Format next appointment time
  const nextAppointment = upcomingAppointments.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];
  
  const nextAppointmentTime = nextAppointment 
    ? format(new Date(nextAppointment.date), "HH:mm", { locale: ptBR })
    : "--:--";

  const nextAppointmentClient = nextAppointment 
    ? nextAppointment.clientName.split(" ")[0]
    : "Nenhum";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Hoje"
        value={todayAppointments.length.toString()}
        icon={<Scissors size={20} className="text-blue-500" />}
        description={`${format(today, "dd 'de' MMMM", { locale: ptBR })}`}
        trending={todayAppointments.length > 0 ? "up" : "neutral"}
      />
      
      <StatsCard 
        title="Amanhã"
        value={tomorrowAppointments.length.toString()}
        icon={<Clock size={20} className="text-indigo-500" />}
        description={`${format(tomorrow, "dd 'de' MMMM", { locale: ptBR })}`}
        trending="neutral"
      />
      
      <StatsCard 
        title="Próximo"
        value={nextAppointmentTime}
        icon={<UserCheck size={20} className="text-green-500" />}
        description={nextAppointmentClient}
        trending={nextAppointment ? "up" : "neutral"}
      />
      
      <StatsCard 
        title="Pendentes"
        value={pendingAppointments.length.toString()} 
        icon={<AlertTriangle size={20} className="text-amber-500" />}
        description="A confirmar"
        trending={pendingAppointments.length > 5 ? "down" : "neutral"}
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trending: "up" | "down" | "neutral";
}

const StatsCard = ({ title, value, icon, description, trending }: StatsCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
