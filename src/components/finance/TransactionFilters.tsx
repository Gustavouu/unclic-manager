
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, CalendarDays, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface TransactionFiltersProps {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  dateRange?: [Date | null, Date | null];
  setDateRange?: (value: [Date | null, Date | null]) => void;
  statusFilter?: string[];
  setStatusFilter?: (value: string[]) => void;
  typeFilter?: string[];
  setTypeFilter?: (value: string[]) => void;
}

export function TransactionFilters({
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter
}: TransactionFiltersProps = {}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select defaultValue="30days">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Últimos 7 dias</SelectItem>
          <SelectItem value="30days">Últimos 30 dias</SelectItem>
          <SelectItem value="90days">Últimos 90 dias</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="font-normal flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              setIsCalendarOpen(false);
            }}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
        <span className="sr-only">Filtrar</span>
      </Button>
      
      <Button variant="outline" className="gap-2 ml-auto">
        <Download className="h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
}
