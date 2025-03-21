
import { FilterItem } from "@/components/clients/filters/FilterItem";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
    <div>
      <h3 className="mb-3 font-medium">Especialidades</h3>
      <FilterItem>
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
      <Separator className="my-4" />
    </div>
  );
};
