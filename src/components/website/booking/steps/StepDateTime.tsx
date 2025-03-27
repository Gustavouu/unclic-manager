
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../WebsiteBookingFlow";
import { addDays, format, nextMonday, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  // Generate available time slots (simplified for demo)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Escolha a Data e Hora</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione quando você deseja agendar seu serviço
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
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
          <div>
            <h3 className="font-medium mb-3">Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "hover:bg-primary/5",
                    selectedTime === time && "hover:bg-primary"
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
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
      <CardFooter>
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
