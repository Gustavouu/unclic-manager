
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BookingData } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAvailableTimeSlots } from "@/hooks/useAvailableTimeSlots";
import { Loader2 } from "lucide-react";

interface StepDateTimeProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepDateTime({ bookingData, updateBookingData, nextStep }: StepDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date);
  const [selectedTime, setSelectedTime] = useState<string>(bookingData.time || "");
  
  const { availableSlots, isLoading } = useAvailableTimeSlots(
    selectedDate,
    bookingData.professionalId, 
    bookingData.serviceDuration
  );
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
    updateBookingData({ date, time: "" });
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
            
            {isLoading ? (
              <div className="flex justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {availableSlots.map((time) => (
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
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground">
                  Não há horários disponíveis nesta data. Por favor, selecione outra data.
                </p>
              </div>
            )}
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
