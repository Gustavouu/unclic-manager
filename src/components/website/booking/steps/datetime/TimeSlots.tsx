
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Cloud, Moon } from "lucide-react";

type TimeSlot = {
  time: string;
  period: "morning" | "afternoon" | "evening";
  isAvailable?: boolean;
};

interface TimeSlotsProps {
  morningSlots: TimeSlot[];
  afternoonSlots: TimeSlot[];
  eveningSlots: TimeSlot[];
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  activePeriod: "morning" | "afternoon" | "evening" | "all";
}

export function TimeSlots({
  morningSlots,
  afternoonSlots,
  eveningSlots,
  selectedTime,
  setSelectedTime,
  activePeriod
}: TimeSlotsProps) {
  // Should we display this period's slots?
  const shouldShowPeriod = (period: "morning" | "afternoon" | "evening") => {
    return activePeriod === "all" || activePeriod === period;
  };

  // Filter slots to only show available ones
  const filterAvailableSlots = (slots: TimeSlot[]) => {
    return slots.filter(slot => slot.isAvailable !== false);
  };

  // Get available slots for each period
  const availableMorningSlots = filterAvailableSlots(morningSlots);
  const availableAfternoonSlots = filterAvailableSlots(afternoonSlots);
  const availableEveningSlots = filterAvailableSlots(eveningSlots);

  return (
    <>
      {/* Morning slots */}
      {availableMorningSlots.length > 0 && shouldShowPeriod("morning") && (
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
                disabled={slot.isAvailable === false}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Afternoon slots */}
      {availableAfternoonSlots.length > 0 && shouldShowPeriod("afternoon") && (
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
                disabled={slot.isAvailable === false}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Evening slots */}
      {availableEveningSlots.length > 0 && shouldShowPeriod("evening") && (
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
                disabled={slot.isAvailable === false}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
