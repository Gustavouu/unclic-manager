
import { FilterItem } from "@/components/clients/filters/FilterItem";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const ActiveProfessionalFilter = () => {
  return (
    <FilterItem title="Status">
      <RadioGroup defaultValue="all" className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="font-normal">Todos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="active" id="active" />
          <Label htmlFor="active" className="font-normal">Ativos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="inactive" id="inactive" />
          <Label htmlFor="inactive" className="font-normal">Inativos</Label>
        </div>
      </RadioGroup>
    </FilterItem>
  );
};
