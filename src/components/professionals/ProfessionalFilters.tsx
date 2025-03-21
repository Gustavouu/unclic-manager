
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProfessionalStatus } from "@/hooks/professionals/types";

interface ProfessionalFiltersProps {
  specialties: string[];
}

export const ProfessionalFilters = ({ specialties }: ProfessionalFiltersProps) => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ProfessionalStatus[]>([]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty) 
        : [...prev, specialty]
    );
  };

  const toggleStatus = (status: ProfessionalStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
    setSelectedStatuses([]);
  };
  
  const statuses: { value: ProfessionalStatus; label: string }[] = [
    { value: "active", label: "Ativo" },
    { value: "vacation", label: "De férias" },
    { value: "leave", label: "Licença" },
    { value: "inactive", label: "Inativo" },
  ];

  return (
    <Card className="border">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filtros</h3>
          {(selectedSpecialties.length > 0 || selectedStatuses.length > 0) && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters}>
              <X size={14} className="mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Especializações</Label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedSpecialties.includes(specialty) 
                      ? "bg-blue-500 hover:bg-blue-600" 
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(({ value, label }) => (
                <Badge
                  key={value}
                  variant={selectedStatuses.includes(value) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedStatuses.includes(value) 
                      ? "bg-blue-500 hover:bg-blue-600" 
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => toggleStatus(value)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
