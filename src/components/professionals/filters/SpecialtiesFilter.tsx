
import { FilterItem } from "@/components/clients/filters/FilterItem";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const specialties = [
  { id: "cabelo", label: "Cabelo" },
  { id: "barba", label: "Barba" },
  { id: "manicure", label: "Manicure" },
  { id: "pedicure", label: "Pedicure" },
  { id: "maquiagem", label: "Maquiagem" },
  { id: "estetica", label: "Estética" },
];

export const SpecialtiesFilter = () => {
  return (
    <FilterItem title="Especialidades">
      <div className="space-y-3">
        {specialties.map((specialty) => (
          <div key={specialty.id} className="flex items-center space-x-2">
            <Checkbox id={specialty.id} />
            <Label htmlFor={specialty.id} className="font-normal">
              {specialty.label}
            </Label>
          </div>
        ))}
      </div>
    </FilterItem>
  );
};
