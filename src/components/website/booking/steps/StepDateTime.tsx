
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../types";
import { Button } from "@/components/ui/button";
import { DateTimeForm } from "./datetime/DateTimeForm";
import { TimeSlots } from "./datetime/TimeSlots";
import { PeriodFilter } from "./datetime/PeriodFilter";
import { useTimeSlots } from "./datetime/useTimeSlots";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { format } from "date-fns";
import { toast } from "sonner";
import { Appointment } from "@/components/appointments/types";

interface StepDateTimeProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepDateTime({ bookingData, updateBookingData, nextStep }: StepDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date);
  const [selectedTime, setSelectedTime] = useState<string>(bookingData.time);
  const [activePeriod, setActivePeriod] = useState<"morning" | "afternoon" | "evening" | "all">("all");
  
  const { timeSlots, morningSlots, afternoonSlots, eveningSlots, isBusinessOpen } = useTimeSlots(selectedDate);
  const { appointments } = useAppointments();
  
  // Filter out booked time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots);
  const [availableMorningSlots, setAvailableMorningSlots] = useState(morningSlots);
  const [availableAfternoonSlots, setAvailableAfternoonSlots] = useState(afternoonSlots);
  const [availableEveningSlots, setAvailableEveningSlots] = useState(eveningSlots);
  
  useEffect(() => {
    if (!selectedDate) return;
    
    const bookedTimeSlots = new Set();
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Find appointments for the selected date
    const appointmentsForDate = appointments.filter(app => {
      if (!app.date) return false;
      
      // Safely handle the date property which could be a Date object or a string
      const appDate = app.date instanceof Date 
        ? format(app.date, 'yyyy-MM-dd') 
        : typeof app.date === 'string' 
          ? app.date.split('T')[0] 
          : '';
      
      return appDate === formattedSelectedDate;
    });
    
    // Mark time slots as booked
    appointmentsForDate.forEach(app => {
      // For simplicity, we're just using the start time
      // In a real app, would need to consider duration
      const appTime = app.date instanceof Date
        ? format(app.date, 'HH:mm')
        : typeof app.date === 'string'
          ? app.date.split('T')[1]?.substring(0, 5) || ''
          : '';
      
      if (appTime) {
        bookedTimeSlots.add(appTime);
      }
    });
    
    // Filter available time slots
    const filtered = timeSlots.filter(slot => !bookedTimeSlots.has(slot.time));
    setAvailableTimeSlots(filtered);
    
    // Also filter by period
    setAvailableMorningSlots(filtered.filter(slot => slot.period === "morning"));
    setAvailableAfternoonSlots(filtered.filter(slot => slot.period === "afternoon"));
    setAvailableEveningSlots(filtered.filter(slot => slot.period === "evening"));
    
    // If selected time is now booked, clear selection
    if (selectedTime && bookedTimeSlots.has(selectedTime)) {
      setSelectedTime("");
      toast.warning("O horário selecionado não está mais disponível");
    }
  }, [selectedDate, timeSlots, appointments]);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
  };
  
  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      toast.warning("Selecione uma data e um horário");
      return;
    }
    
    updateBookingData({
      date: selectedDate,
      time: selectedTime
    });
    
    nextStep();
  };
  
  const handlePeriodClick = (period: "morning" | "afternoon" | "evening" | "all") => {
    setActivePeriod(period);
  };
  
  if (!bookingData.serviceId || !bookingData.professionalId) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Serviço ou profissional não selecionado. Por favor, volte e complete as etapas anteriores.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Escolha data e horário</CardTitle>
        <p className="text-muted-foreground">
          {bookingData.serviceName} com {bookingData.professionalName}
        </p>
      </CardHeader>
      
      <CardContent>
        {!isBusinessOpen && selectedDate && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
            Estamos fechados nesta data. Por favor, selecione outra data.
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <DateTimeForm 
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
          />
          
          <div className="md:w-1/2">
            {selectedDate && isBusinessOpen ? (
              <>
                <PeriodFilter
                  activePeriod={activePeriod}
                  handlePeriodClick={handlePeriodClick}
                  morningSlots={availableMorningSlots}
                  afternoonSlots={availableAfternoonSlots}
                  eveningSlots={availableEveningSlots}
                />
                
                {availableTimeSlots.length > 0 ? (
                  <TimeSlots
                    morningSlots={availableMorningSlots}
                    afternoonSlots={availableAfternoonSlots}
                    eveningSlots={availableEveningSlots}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    activePeriod={activePeriod}
                  />
                ) : (
                  <div className="p-4 text-center bg-muted rounded-md">
                    Não há horários disponíveis para esta data.
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center bg-muted rounded-md">
                Selecione uma data para ver os horários disponíveis.
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleContinue} 
          className="w-full"
          disabled={!selectedDate || !selectedTime || !isBusinessOpen}
        >
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
