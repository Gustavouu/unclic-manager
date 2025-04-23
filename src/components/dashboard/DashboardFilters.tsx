
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterPeriod } from "@/pages/Dashboard";

interface DashboardFiltersProps {
  currentPeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
}

export function DashboardFilters({ currentPeriod, onPeriodChange }: DashboardFiltersProps) {
  const periods = [
    { value: "today", label: "Hoje" },
    { value: "week", label: "Esta Semana" },
    { value: "month", label: "Este Mês" },
    { value: "quarter", label: "Este Trimestre" },
    { value: "year", label: "Este Ano" }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={currentPeriod}
        onValueChange={(value) => onPeriodChange(value as FilterPeriod)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
