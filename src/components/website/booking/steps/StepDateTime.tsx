
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BookingData } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StepDateTimeProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepDateTime({ bookingData, updateBookingData, nextStep }: StepDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date);
  const [selectedTime, setSelectedTime] = useState<string>(bookingData.time || "");

  // Mock available time slots
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", 
    "11:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateBookingData({ date });
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateBookingData({ time });
  };
  
  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      nextStep();
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Escolha a data e horário</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione uma data e horário para o serviço
          {bookingData.serviceName && (
            <span className="font-medium"> "{bookingData.serviceName}"</span>
          )}
          {bookingData.professionalName && (
            <span> com <span className="font-medium">{bookingData.professionalName}</span></span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Data</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={ptBR}
            className="rounded-md border"
            disabled={{ before: new Date() }}
          />
        </div>
        
        {selectedDate && (
          <div>
            <h3 className="text-sm font-medium mb-2">
              Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableTimeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedDate || !selectedTime}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
