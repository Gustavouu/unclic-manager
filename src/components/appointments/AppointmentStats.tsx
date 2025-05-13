
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, CheckCircle, Clock, XCircle } from "lucide-react";
import { AppointmentType } from '../appointments/calendar/types';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AppointmentStatProps = {
  appointments: AppointmentType[];
  isLoading: boolean;
};

export const AppointmentStats = ({ appointments, isLoading }: AppointmentStatProps) => {
  // Calculate the statistics based on the appointments data
  const calculateStats = () => {
    if (!appointments || appointments.length === 0) {
      return {
        today: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
      };
    }

    const now = new Date();

    return {
      today: appointments.filter(app => isToday(new Date(app.date))).length,
      upcoming: appointments.filter(app => {
        const appDate = new Date(app.date);
        return (isTomorrow(appDate) || 
               (isThisWeek(appDate) && appDate > now)) && 
               app.status !== 'concluido' && 
               app.status !== 'cancelado';
      }).length,
      completed: appointments.filter(app => app.status === 'concluido').length,
      cancelled: appointments.filter(app => app.status === 'cancelado').length
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Hoje"
        value={stats.today}
        icon={<CalendarClock className="w-5 h-5 text-blue-600" />}
        description="Agendamentos para hoje"
        isLoading={isLoading}
      />
      <StatCard
        title="Próximos"
        value={stats.upcoming}
        icon={<Clock className="w-5 h-5 text-purple-600" />}
        description="Próximos agendamentos"
        isLoading={isLoading}
      />
      <StatCard
        title="Concluídos"
        value={stats.completed}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        description="Atendimentos realizados"
        isLoading={isLoading}
      />
      <StatCard
        title="Cancelados"
        value={stats.cancelled}
        icon={<XCircle className="w-5 h-5 text-red-600" />}
        description="Agendamentos cancelados"
        isLoading={isLoading}
      />
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  isLoading: boolean;
};

const StatCard = ({ title, value, icon, description, isLoading }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <div className="p-1.5 bg-gray-50 rounded-full">{icon}</div>
            </div>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
