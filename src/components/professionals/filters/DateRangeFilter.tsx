
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

type DateRangeFilterProps = {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  title?: string;
};

export const DateRangeFilter = ({ value, onChange, title = "Período" }: DateRangeFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{title}</Label>
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarRange className="mr-2 h-4 w-4" />
              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, "dd/MM/yyyy")} -{" "}
                    {format(value.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(value.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Selecione um período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
