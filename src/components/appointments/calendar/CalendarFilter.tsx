
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceType } from "../AppointmentCalendar";
import { Filter } from "lucide-react";

type CalendarFilterProps = {
  serviceFilter: ServiceType;
  onFilterChange: (value: ServiceType) => void;
  serviceTypes: Record<ServiceType, string>;
};

export const CalendarFilter = ({ 
  serviceFilter, 
  onFilterChange,
  serviceTypes 
}: CalendarFilterProps) => {
  return (
    <div className="mb-6 flex items-center gap-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <Filter className="h-4 w-4 mr-2" />
        <span>Filtrar por:</span>
      </div>
      <Select
        value={serviceFilter}
        onValueChange={(value) => onFilterChange(value as ServiceType)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(serviceTypes).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
