
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../WebsiteBookingFlow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, Sun, Cloud, Moon } from "lucide-react";

interface StepDateTimeProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

type TimeSlot = {
  time: string;
  period: "morning" | "afternoon" | "evening";
};

type Period = "morning" | "afternoon" | "evening" | "all";

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

  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    
    // Morning slots (9:00 - 11:30)
    for (let hour = 9; hour < 12; hour++) {
      slots.push({ time: `${hour}:00`, period: "morning" });
      slots.push({ time: `${hour}:30`, period: "morning" });
    }
    
    // Afternoon slots (12:00 - 17:30)
    for (let hour = 12; hour < 18; hour++) {
      slots.push({ time: `${hour}:00`, period: "afternoon" });
      slots.push({ time: `${hour}:30`, period: "afternoon" });
    }
    
    // Evening slots (18:00 - 20:30)
    for (let hour = 18; hour < 21; hour++) {
      slots.push({ time: `${hour}:00`, period: "evening" });
      slots.push({ time: `${hour}:30`, period: "evening" });
    }
    
    return slots;
  }, []);

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

  // Group time slots by period
  const morningSlots = timeSlots.filter(slot => slot.period === "morning");
  const afternoonSlots = timeSlots.filter(slot => slot.period === "afternoon");
  const eveningSlots = timeSlots.filter(slot => slot.period === "evening");

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

  // Should we display this period's slots?
  const shouldShowPeriod = (period: "morning" | "afternoon" | "evening") => {
    return activePeriod === "all" || activePeriod === period;
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
          <div className="md:w-1/2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              initialFocus
              locale={ptBR}
              className={cn("rounded-md border mx-auto pointer-events-auto")}
            />
          </div>

          {selectedDate && (
            <div className="md:w-1/2">
              <h3 className="font-medium mb-3">
                Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
              {/* Period filter buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={activePeriod === "all" ? "default" : "outline"}
                  className="flex items-center gap-1"
                  onClick={() => handlePeriodClick("all")}
                >
                  <Clock className="h-4 w-4" />
                  Todos
                </Button>
                <Button
                  type="button"
                  variant={activePeriod === "morning" ? "default" : "outline"}
                  className="flex items-center gap-1"
                  onClick={() => handlePeriodClick("morning")}
                  disabled={morningSlots.length === 0}
                >
                  <Sun className="h-4 w-4" />
                  Manhã
                </Button>
                <Button
                  type="button"
                  variant={activePeriod === "afternoon" ? "default" : "outline"}
                  className="flex items-center gap-1"
                  onClick={() => handlePeriodClick("afternoon")}
                  disabled={afternoonSlots.length === 0}
                >
                  <Cloud className="h-4 w-4" />
                  Tarde
                </Button>
                <Button
                  type="button"
                  variant={activePeriod === "evening" ? "default" : "outline"}
                  className="flex items-center gap-1"
                  onClick={() => handlePeriodClick("evening")}
                  disabled={eveningSlots.length === 0}
                >
                  <Moon className="h-4 w-4" />
                  Noite
                </Button>
              </div>
              
              {/* Morning slots */}
              {morningSlots.length > 0 && shouldShowPeriod("morning") && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Sun className="h-4 w-4" />
                    <span>Manhã</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    {morningSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className={cn(
                          "hover:bg-primary/5",
                          selectedTime === slot.time && "hover:bg-primary"
                        )}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Afternoon slots */}
              {afternoonSlots.length > 0 && shouldShowPeriod("afternoon") && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Cloud className="h-4 w-4" />
                    <span>Tarde</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    {afternoonSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className={cn(
                          "hover:bg-primary/5",
                          selectedTime === slot.time && "hover:bg-primary"
                        )}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Evening slots */}
              {eveningSlots.length > 0 && shouldShowPeriod("evening") && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Moon className="h-4 w-4" />
                    <span>Noite</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    {eveningSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className={cn(
                          "hover:bg-primary/5",
                          selectedTime === slot.time && "hover:bg-primary"
                        )}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Alguma informação adicional para o profissional?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-20"
          />
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
