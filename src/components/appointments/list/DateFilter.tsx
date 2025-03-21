
import { useState } from "react";
import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { DateFilter as DateFilterType } from "../types";

interface DateFilterProps {
  dateFilter: DateFilterType;
  setDateFilter: (value: DateFilterType) => void;
  customDateRange: DateRange | undefined;
  setCustomDateRange: (value: DateRange | undefined) => void;
}

export const DateFilterComponent = ({ 
  dateFilter, 
  setDateFilter,
  customDateRange,
  setCustomDateRange
}: DateFilterProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <CalendarRange size={16} className="text-muted-foreground" />
        Data
      </div>
      <div className="flex gap-2">
        <Select
          value={dateFilter}
          onValueChange={(value) => setDateFilter(value as DateFilterType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as datas</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="tomorrow">Amanhã</SelectItem>
            <SelectItem value="thisWeek">Esta semana</SelectItem>
            <SelectItem value="custom">Período personalizado</SelectItem>
          </SelectContent>
        </Select>
        
        {dateFilter === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <CalendarRange size={16} />
                {customDateRange?.from ? (
                  customDateRange.to ? (
                    <>
                      {format(customDateRange.from, "dd/MM")} - {format(customDateRange.to, "dd/MM")}
                    </>
                  ) : (
                    format(customDateRange.from, "dd/MM")
                  )
                ) : (
                  "Selecionar"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={customDateRange}
                onSelect={setCustomDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
