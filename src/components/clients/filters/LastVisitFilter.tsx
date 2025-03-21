
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type LastVisitFilterProps = {
  value: [string | null, string | null];
  onChange: (value: [string | null, string | null]) => void;
};

export const LastVisitFilter = ({ value, onChange }: LastVisitFilterProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    value[0] ? new Date(value[0]) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    value[1] ? new Date(value[1]) : undefined
  );

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onChange([
      date ? date.toISOString().split('T')[0] : null,
      value[1],
    ]);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onChange([
      value[0],
      date ? date.toISOString().split('T')[0] : null,
    ]);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Data da última visita</Label>
      <div className="flex flex-col gap-3 mt-2">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Data inicial</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Data final</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
