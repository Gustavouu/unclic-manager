
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, CalendarDays, Download, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionFiltersProps {
  onPeriodChange?: (value: string) => void;
  onDateChange?: (date: Date | undefined) => void;
  onSearchChange?: (value: string) => void;
}

export function TransactionFilters({ 
  onPeriodChange, 
  onDateChange,
  onSearchChange
}: TransactionFiltersProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [period, setPeriod] = useState("30days");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    onPeriodChange?.(value);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setIsCalendarOpen(false);
    onDateChange?.(newDate);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar transações..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9 w-full sm:w-[200px]"
        />
      </div>
      
      <Select defaultValue={period} onValueChange={handlePeriodChange}>
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
            onSelect={handleDateSelect}
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
