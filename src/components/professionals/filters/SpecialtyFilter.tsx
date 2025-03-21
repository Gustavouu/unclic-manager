
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type SpecialtyFilterProps = {
  specialties: string[];
  selectedSpecialties: string[];
  onToggle: (specialty: string) => void;
};

export const SpecialtyFilter = ({ 
  specialties, 
  selectedSpecialties, 
  onToggle 
}: SpecialtyFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Especialidade</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {specialties.map((specialty) => (
          <Badge 
            key={specialty}
            variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggle(specialty)}
          >
            {specialty}
            {selectedSpecialties.includes(specialty) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};
