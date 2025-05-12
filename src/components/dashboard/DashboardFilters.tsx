
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterPeriod } from "@/types/dashboard";

interface DashboardFiltersProps {
  period: FilterPeriod;
  onFilterChange: (period: FilterPeriod) => void;
}

export function DashboardFilters({ period, onFilterChange }: DashboardFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={period}
        onValueChange={(value) => onFilterChange(value as FilterPeriod)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Esta semana</SelectItem>
          <SelectItem value="month">Este mês</SelectItem>
          <SelectItem value="quarter">Este trimestre</SelectItem>
          <SelectItem value="year">Este ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
