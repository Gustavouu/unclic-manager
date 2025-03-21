
import { ServiceType, SERVICE_TYPE_NAMES } from "./types";
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
        <h3 className="text-sm text-gray-700 mb-2">Filtrar por tipo de serviço</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(serviceTypes).map(([type, label]) => (
          <button
            key={type}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all whitespace-nowrap",
              serviceFilter === type
                ? "bg-blue-600 text-white font-medium"
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
