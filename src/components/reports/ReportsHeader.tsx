
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportsHeaderProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export function ReportsHeader({ dateRange, onDateRangeChange }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          Visualize métricas e análises do seu negócio
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 sm:mt-0">
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="yesterday">Ontem</SelectItem>
            <SelectItem value="last7days">Últimos 7 dias</SelectItem>
            <SelectItem value="last30days">Últimos 30 dias</SelectItem>
            <SelectItem value="thisMonth">Este mês</SelectItem>
            <SelectItem value="lastMonth">Mês passado</SelectItem>
            <SelectItem value="thisYear">Este ano</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="items-center gap-1">
            <Download size={16} className="mr-1" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="sm" className="items-center gap-1">
            <Share size={16} className="mr-1" />
            <span className="hidden md:inline">Compartilhar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
