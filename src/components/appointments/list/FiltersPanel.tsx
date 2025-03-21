
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./StatusFilter";
import { ServiceTypeFilter } from "./ServiceTypeFilter";
import { DateFilterComponent } from "./DateFilter";
import { AppointmentStatus, ServiceType, DateFilter } from "../types";
import { DateRange } from "react-day-picker";

interface FiltersPanelProps {
  statusFilter: AppointmentStatus | "all";
  setStatusFilter: (value: AppointmentStatus | "all") => void;
  serviceFilter: ServiceType;
  setServiceFilter: (value: ServiceType) => void;
  dateFilter: DateFilter;
  setDateFilter: (value: DateFilter) => void;
  customDateRange: DateRange | undefined;
  setCustomDateRange: (value: DateRange | undefined) => void;
  handleResetFilters: () => void;
}

export const FiltersPanel = ({
  statusFilter,
  setStatusFilter,
  serviceFilter,
  setServiceFilter,
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
  handleResetFilters
}: FiltersPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md border border-border/60">
      <StatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      
      <ServiceTypeFilter 
        serviceFilter={serviceFilter} 
        setServiceFilter={setServiceFilter} 
      />
      
      <DateFilterComponent 
        dateFilter={dateFilter} 
        setDateFilter={setDateFilter} 
        customDateRange={customDateRange} 
        setCustomDateRange={setCustomDateRange} 
      />
      
      <div className="md:col-span-3 flex justify-end border-t pt-2 mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={14} className="mr-1" />
          Limpar filtros
        </Button>
      </div>
    </div>
  );
};
