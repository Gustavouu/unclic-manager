
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type CitiesFilterProps = {
  cities: string[];
  selectedCities: string[];
  onToggle: (city: string) => void;
};

export const CitiesFilter = ({ 
  cities, 
  selectedCities, 
  onToggle 
}: CitiesFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Cidades</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {cities.map((city) => (
          <Badge 
            key={city}
            variant={selectedCities.includes(city) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggle(city)}
          >
            {city}
            {selectedCities.includes(city) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};
