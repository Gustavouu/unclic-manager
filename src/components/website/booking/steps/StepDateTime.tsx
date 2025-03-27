
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../WebsiteBookingFlow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTimeSlots, Period } from "./datetime/useTimeSlots";
import { PeriodFilter } from "./datetime/PeriodFilter";
import { TimeSlots } from "./datetime/TimeSlots";
import { DateTimeForm } from "./datetime/DateTimeForm";

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
  const [notes, setNotes] = useState<string>(
    bookingData.notes || ""
  );
  
  // Add state for the active period filter
  const [activePeriod, setActivePeriod] = useState<Period>("morning");

  // Get time slots using the custom hook
  const { morningSlots, afternoonSlots, eveningSlots } = useTimeSlots();

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      updateBookingData({
        date: selectedDate,
        time: selectedTime,
        notes: notes
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
    if (date) {
      setDefaultActivePeriod();
    }
  };

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
            notes={notes}
            setNotes={setNotes}
          />

          {selectedDate && (
            <div className="md:w-1/2">
              <h3 className="font-medium mb-3">
                Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
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
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-0">
        <Button 
          className="w-full" 
          disabled={!selectedDate || !selectedTime}
          onClick={handleContinue}
        >
          Continuar para Pagamento
        </Button>
      </CardFooter>
    </Card>
  );
}
