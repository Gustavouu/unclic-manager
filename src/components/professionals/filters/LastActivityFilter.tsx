
import { FilterItem } from "@/components/clients/filters/FilterItem";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const LastActivityFilter = () => {
  return (
    <div>
      <h3 className="mb-3 font-medium">Última Atividade</h3>
      <FilterItem showSeparator={false}>
        <RadioGroup defaultValue="all" className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="last-all" />
            <Label htmlFor="last-all" className="font-normal">Qualquer data</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="7days" id="last-7days" />
            <Label htmlFor="last-7days" className="font-normal">Últimos 7 dias</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30days" id="last-30days" />
            <Label htmlFor="last-30days" className="font-normal">Últimos 30 dias</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="90days" id="last-90days" />
            <Label htmlFor="last-90days" className="font-normal">Últimos 90 dias</Label>
          </div>
        </RadioGroup>
      </FilterItem>
    </div>
  );
};
