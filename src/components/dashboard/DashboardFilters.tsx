
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterPeriod } from '@/types/dashboard';

export interface DashboardFiltersProps {
  period: FilterPeriod;
  onFilterChange: (period: FilterPeriod) => void;
}

export function DashboardFilters({ period, onFilterChange }: DashboardFiltersProps) {
  const handleChange = (value: string) => {
    onFilterChange(value as FilterPeriod);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={period} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Última semana</SelectItem>
          <SelectItem value="month">Último mês</SelectItem>
          <SelectItem value="quarter">Último trimestre</SelectItem>
          <SelectItem value="year">Último ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
