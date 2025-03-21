
import { ServiceType } from "../AppointmentCalendar";
import { cn } from "@/lib/utils";
import { 
  Scissors, 
  Music2, 
  Smile, 
  Sparkles,
  Palette, 
  FilterX 
} from "lucide-react";

type CalendarFilterProps = {
  serviceFilter: ServiceType;
  onFilterChange: (type: ServiceType) => void;
  serviceTypes: Record<ServiceType, string>;
};

export const CalendarFilter = ({
  serviceFilter,
  onFilterChange,
  serviceTypes,
}: CalendarFilterProps) => {
  // Map service types to icons
  const serviceIcons: Record<ServiceType, React.ReactNode> = {
    all: <FilterX size={16} />,
    hair: <Scissors size={16} />,
    barber: <Music2 size={16} />,
    nails: <Sparkles size={16} />,
    makeup: <Palette size={16} />,
    skincare: <Smile size={16} />,
  };

  return (
    <div>
      <div className="flex items-center">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filtrar por tipo de serviço</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(serviceTypes).map(([type, label]) => (
          <button
            key={type}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap",
              serviceFilter === type
                ? "bg-blue-100 text-blue-700 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => onFilterChange(type as ServiceType)}
          >
            <span className="flex-shrink-0">
              {serviceIcons[type as ServiceType]}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
