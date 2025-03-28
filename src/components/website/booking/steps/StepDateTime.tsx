
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTimeSlots, Period } from "./datetime/useTimeSlots";
import { PeriodFilter } from "./datetime/PeriodFilter";
import { TimeSlots } from "./datetime/TimeSlots";
import { DateTimeForm } from "./datetime/DateTimeForm";
import { BookingData } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";

interface StepDateTimeProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepDateTime({
  bookingData,
  updateBookingData,
  nextStep
}: StepDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date || undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingData.time || ""
  );
  
  // Add state for the active period filter
  const [activePeriod, setActivePeriod] = useState<Period>("morning");

  // Get time slots using the custom hook with the selected date
  const { morningSlots, afternoonSlots, eveningSlots, isBusinessOpen } = useTimeSlots(selectedDate);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      updateBookingData({
        date: selectedDate,
        time: selectedTime,
        notes: "" // Keep empty notes
      });
      nextStep();
    }
  };

  // Set default active period when date is selected
  const setDefaultActivePeriod = () => {
    if (morningSlots.length > 0) {
      setActivePeriod("morning");
    } else if (afternoonSlots.length > 0) {
      setActivePeriod("afternoon");
    } else if (eveningSlots.length > 0) {
      setActivePeriod("evening");
    } else {
      setActivePeriod("all");
    }
  };

  // Set default period when date changes
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      setDefaultActivePeriod();
    }
  };

  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  // Period button click handler
  const handlePeriodClick = (period: Period) => {
    setActivePeriod(period);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Escolha a Data e Hora</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione quando você deseja agendar seu serviço
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex flex-col md:flex-row gap-6">
          <DateTimeForm
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
          />

          {selectedDate && (
            <div className="md:w-1/2">
              <h3 className="font-medium mb-3">
                Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
              {isBusinessOpen ? (
                <>
                  {/* Period filter buttons */}
                  <PeriodFilter
                    activePeriod={activePeriod}
                    handlePeriodClick={handlePeriodClick}
                    morningSlots={morningSlots}
                    afternoonSlots={afternoonSlots}
                    eveningSlots={eveningSlots}
                  />
                  
                  {/* Time slots */}
                  <TimeSlots
                    morningSlots={morningSlots}
                    afternoonSlots={afternoonSlots}
                    eveningSlots={eveningSlots}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    activePeriod={activePeriod}
                  />
                </>
              ) : (
                <Alert className="mt-4">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Estabelecimento fechado</AlertTitle>
                  <AlertDescription>
                    O estabelecimento não funciona neste dia. Por favor, selecione outra data.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-0">
        <Button 
          className="w-full" 
          disabled={!selectedDate || !selectedTime || !isBusinessOpen}
          onClick={handleContinue}
        >
          Continuar para Pagamento
        </Button>
      </CardFooter>
    </Card>
  );
}
