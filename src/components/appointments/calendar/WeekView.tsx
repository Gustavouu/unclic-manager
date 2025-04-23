import React from "react";
import { format, isSameDay, addHours, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentType } from "./types";
import { cn } from "@/lib/utils";
import { useCalendarContext } from "./CalendarContext";
import { useBusinessHours } from "@/hooks/useBusinessHours";

type WeekViewProps = {
  weekAppointments: AppointmentType[];
  onSelectAppointment: (appointment: AppointmentType) => void;
  businessHours?: Record<string, { isOpen: boolean; hours?: string }>;
};

export const WeekView = ({
  weekAppointments,
  onSelectAppointment,
  businessHours: propBusinessHours,
}: WeekViewProps) => {
  const { 
    currentDate, 
    handleDragStart, 
    handleDragEnd, 
    isDragging, 
    selectedAppointment 
  } = useCalendarContext();
  
  // Get business hours from the hook or from props
  const { getCalendarBusinessHours } = useBusinessHours();
  const businessHours = propBusinessHours || getCalendarBusinessHours();
  
  // Get all days of the week from the current date
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start with Sunday
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });
  
  // Mapeia os blocos de tempo para o dia (8:00, 9:00, 10:00, etc)
  const timeBlocks = Array.from({ length: 12 }, (_, i) => {
    return {
      hour: 8 + i, // Começando às 8h até 19h
      label: `${8 + i}:00`
    };
  });
  
  const handleDragStartAppointment = (appointment: AppointmentType) => {
    handleDragStart(appointment.id);
  };
  
  const handleDropOnTimeSlot = async (day: Date, hour: number) => {
    if (!selectedAppointment || !isDragging) return;
    
    // Criar uma nova data com o dia e a hora alvo
    const newDate = new Date(day);
    newDate.setHours(hour, 0, 0, 0);
    
    // Tentar atualizar o agendamento
    const success = await handleDragEnd(newDate);
    
    // Opcional: Fazer algo caso a atualização seja bem-sucedida
    if (success) {
      // Por exemplo, você poderia querer recarregar os dados
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 mt-2">
      {/* Cabeçalho dos dias da semana */}
      {weekDays.map((day, index) => {
        const dayOfWeek = day.getDay();
        const isOpen = businessHours[dayOfWeek]?.isOpen;
        
        return (
          <div key={`header-${index}`} className={cn(
            "border-b pb-2 text-center",
            isOpen ? "border-blue-100" : "border-gray-200 opacity-60"
          )}>
            <div className="font-medium text-sm">
              {format(day, "EEEE", { locale: ptBR })}
            </div>
            <div className={cn(
              "text-xs rounded-full px-2 py-0.5 inline-block mt-1",
              isOpen ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
            )}>
              {format(day, "dd/MM")}
            </div>
          </div>
        );
      })}
      
      {/* Blocos de horário para cada dia */}
      {timeBlocks.map((timeBlock) => (
        <React.Fragment key={`time-${timeBlock.hour}`}>
          {/* Bloco de hora na primeira coluna */}
          <div className="border-r border-gray-100 pr-2 text-right text-xs text-gray-500 pt-2">
            {timeBlock.label}
          </div>
          
          {/* Células de horário para cada dia */}
          {weekDays.map((day, dayIndex) => {
            const dayOfWeek = day.getDay();
            const isOpen = businessHours[dayOfWeek]?.isOpen;
            
            // Encontrar agendamentos para esta hora neste dia
            const hourAppointments = weekAppointments.filter(app => 
              isSameDay(app.date, day) && app.date.getHours() === timeBlock.hour
            );
            
            return (
              <div 
                key={`cell-${dayIndex}-${timeBlock.hour}`}
                className={cn(
                  "border border-gray-100 rounded-sm min-h-[60px] relative",
                  isOpen ? "bg-white" : "bg-gray-50",
                  isDragging && "bg-blue-50/30"
                )}
                onDragOver={(e) => {
                  if (isDragging) {
                    e.preventDefault(); // Necessário para permitir o drop
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (isDragging) {
                    handleDropOnTimeSlot(day, timeBlock.hour);
                  }
                }}
              >
                {hourAppointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    draggable={true}
                    onDragStart={() => handleDragStartAppointment(appointment)}
                    onClick={() => onSelectAppointment(appointment)}
                    className={cn(
                      "absolute left-0 right-0 p-1 rounded text-xs cursor-pointer transition-all",
                      "border-l-2 hover:shadow-md",
                      isDragging && selectedAppointment?.id === appointment.id 
                        ? "opacity-50" 
                        : "opacity-100",
                      appointment.status === "concluído" 
                        ? "bg-green-50 border-green-500" 
                        : appointment.status === "cancelado"
                        ? "bg-red-50 border-red-500"
                        : "bg-blue-50 border-blue-500"
                    )}
                    style={{
                      top: `${(appointment.date.getMinutes() / 60) * 100}%`,
                      height: `${Math.max(20, (appointment.duration / 60) * 100)}%`
                    }}
                  >
                    <div className="font-medium truncate">
                      {appointment.clientName}
                    </div>
                    <div className="truncate text-[10px] text-gray-600">
                      {appointment.serviceName}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] bg-white/50 rounded px-1">
                        {format(appointment.date, "HH:mm")}
                      </span>
                      <span className="text-[10px] bg-white/50 rounded px-1">
                        {appointment.duration}min
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Área de drop quando está arrastando */}
                {isDragging && (
                  <div 
                    className="absolute inset-0 border-2 border-dashed border-blue-300 bg-blue-50/20 rounded-sm z-10"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOnTimeSlot(day, timeBlock.hour);
                    }}
                  />
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
