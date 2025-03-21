
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppointmentStatus, ServiceType, DateFilter } from "../types";

interface FiltersButtonProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  statusFilter: AppointmentStatus | "all";
  serviceFilter: ServiceType;
  dateFilter: DateFilter;
}

export const FiltersButton = ({ 
  showFilters, 
  setShowFilters,
  statusFilter,
  serviceFilter,
  dateFilter
}: FiltersButtonProps) => {
  const activeFiltersCount = 
    (statusFilter !== "all" ? 1 : 0) + 
    (serviceFilter !== "all" ? 1 : 0) + 
    (dateFilter !== "all" ? 1 : 0);

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      onClick={() => setShowFilters(!showFilters)}
    >
      <Filter size={16} />
      Filtros
      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );
};
