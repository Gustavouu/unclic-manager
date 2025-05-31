
import React from 'react';
import { CalendarViewType } from '@/types/calendar';

export interface AppointmentCalendarProps {
  initialView?: CalendarViewType;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  initialView = 'month' 
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendário de Agendamentos</h2>
      <p>Vista atual: {initialView}</p>
      {/* Calendar implementation would go here */}
    </div>
  );
};
