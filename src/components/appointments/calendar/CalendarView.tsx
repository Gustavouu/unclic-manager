
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarGrid } from './CalendarGrid';
import { Appointment } from '@/hooks/appointments/types';

interface CalendarViewProps {
  appointments: Appointment[];
  onNewAppointment: () => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

export function CalendarView({ appointments, onNewAppointment, onSelectAppointment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Gerar dias do calendário
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startWeekday = getDay(monthStart);
  
  const calendarDays: (Date | null)[] = Array(startWeekday).fill(null);
  monthDays.forEach(day => calendarDays.push(day));

  // Estatísticas do mês
  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= monthStart && aptDate <= monthEnd;
  });

  const stats = {
    total: monthAppointments.length,
    concluidos: monthAppointments.filter(apt => apt.status === 'concluido').length,
    agendados: monthAppointments.filter(apt => apt.status === 'agendado').length,
    cancelados: monthAppointments.filter(apt => apt.status === 'cancelado').length,
  };

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
  };

  return (
    <div className="space-y-4">
      {/* Header do calendário */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <Button onClick={onNewAppointment} className="gap-2">
            <Plus size={16} />
            Novo Agendamento
          </Button>
        </div>

        {/* Estatísticas rápidas */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar size={12} />
            {stats.total} total
          </Badge>
          <Badge variant="default" className="bg-green-500">
            {stats.concluidos} concluídos
          </Badge>
          <Badge variant="outline">
            {stats.agendados} agendados
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {stats.cancelados} cancelados
          </Badge>
        </div>
      </div>

      {/* Grid do calendário */}
      <CalendarGrid
        calendarDays={calendarDays}
        appointments={appointments}
        selectedDate={selectedDate}
        onSelectDay={handleSelectDay}
        onSelectAppointment={onSelectAppointment}
      />

      {/* Legenda */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Confirmado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span>Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Cancelado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span>Faltou</span>
        </div>
      </div>
    </div>
  );
}
