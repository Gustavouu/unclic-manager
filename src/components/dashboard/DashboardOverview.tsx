import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { formatCurrency } from "@/lib/format";
import { isToday, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export function DashboardOverview() {
  const { appointments } = useAppointments();

  // Filtra agendamentos de hoje
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return isToday(appointmentDate);
  });

  // Filtra agendamentos da semana atual
  const weekAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return isWithinInterval(appointmentDate, {
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date())
    });
  });

  // Filtra agendamentos do mês atual
  const monthAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return isWithinInterval(appointmentDate, {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    });
  });

  // Calcula a receita diária (agendamentos de hoje)
  const dailyRevenue = todayAppointments.reduce((total, appointment) => {
    const appointmentValue = appointment.service.price || 0;
    const additionalServicesValue = appointment.additionalServices?.reduce((sum, service) => {
      return sum + (service.price || 0);
    }, 0) || 0;
    return total + appointmentValue + additionalServicesValue;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayAppointments.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos na Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weekAppointments.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos no Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthAppointments.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Diária</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(dailyRevenue)}</div>
        </CardContent>
      </Card>
    </div>
  );
}