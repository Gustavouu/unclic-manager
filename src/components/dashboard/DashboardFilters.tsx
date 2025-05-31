
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterPeriod } from '@/types/dashboard';

interface DashboardFiltersProps {
  period: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ period, onPeriodChange }) => {
  return (
    <div className="flex items-center gap-4">
      <Select value={period} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Esta Semana</SelectItem>
          <SelectItem value="month">Este Mês</SelectItem>
          <SelectItem value="quarter">Este Trimestre</SelectItem>
          <SelectItem value="year">Este Ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
