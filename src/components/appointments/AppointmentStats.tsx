import { StatsCard } from "@/components/common/StatsCard";
import { Scissors, Clock, UserCheck, AlertTriangle } from "lucide-react";
import { format, isToday, isTomorrow, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";

export const AppointmentStats = () => {
  const { appointments, isLoading } = useAppointments();
  
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Calculate stats using real appointment data
  const todayAppointments = appointments.filter(app => isToday(app.date));
  const tomorrowAppointments = appointments.filter(app => isTomorrow(app.date));
  const upcomingAppointments = appointments.filter(app => 
    isAfter(app.date, today) && 
    app.status === "agendado"
  );
  const pendingAppointments = appointments.filter(app => app.status === "agendado");

  // Format next appointment time
  const nextAppointment = upcomingAppointments.sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  )[0];
  
  const nextAppointmentTime = nextAppointment 
    ? format(nextAppointment.date, "HH:mm", { locale: ptBR })
    : "--:--";

  const nextAppointmentClient = nextAppointment 
    ? nextAppointment.clientName.split(" ")[0]
    : "Nenhum";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Hoje"
        value={todayAppointments.length.toString()}
        icon={<Scissors size={20} />}
        description={`${format(today, "dd 'de' MMMM", { locale: ptBR })}`}
        iconColor="bg-blue-50 text-blue-500"
        borderColor="border-l-blue-600"
      />
      
      <StatsCard 
        title="Amanhã"
        value={tomorrowAppointments.length.toString()}
        icon={<Clock size={20} />}
        description={`${format(tomorrow, "dd 'de' MMMM", { locale: ptBR })}`}
        iconColor="bg-indigo-50 text-indigo-500"
        borderColor="border-l-indigo-600"
      />
      
      <StatsCard 
        title="Próximo"
        value={nextAppointmentTime}
        icon={<UserCheck size={20} />}
        description={nextAppointmentClient}
        iconColor="bg-green-50 text-green-500"
        borderColor="border-l-green-600"
      />
      
      <StatsCard 
        title="Pendentes"
        value={pendingAppointments.length.toString()} 
        icon={<AlertTriangle size={20} />}
        description="A confirmar"
        iconColor="bg-amber-50 text-amber-500"
        borderColor="border-l-amber-600"
      />
    </div>
  );
};
