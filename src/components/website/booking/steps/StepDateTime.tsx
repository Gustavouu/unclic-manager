
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
import { Clock } from "lucide-react";

interface StepDateTimeProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

type TimeSlot = {
  time: string;
  period: "morning" | "afternoon" | "evening";
};

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
              onSelect={setSelectedDate}
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
              
              {/* Morning slots */}
              {morningSlots.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
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
              {afternoonSlots.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
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
              {eveningSlots.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
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
