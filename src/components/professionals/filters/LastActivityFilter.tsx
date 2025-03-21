
import { FilterItem } from "@/components/clients/filters/FilterItem";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const LastActivityFilter = () => {
  return (
    <div>
      <h3 className="mb-3 font-medium">Última Atividade</h3>
      <FilterItem>
        <RadioGroup defaultValue="all" className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all-time" />
            <Label htmlFor="all-time" className="font-normal">Qualquer data</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="today" id="today" />
            <Label htmlFor="today" className="font-normal">Hoje</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="this-week" id="this-week" />
            <Label htmlFor="this-week" className="font-normal">Esta semana</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="this-month" id="this-month" />
            <Label htmlFor="this-month" className="font-normal">Este mês</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="last-month" id="last-month" />
            <Label htmlFor="last-month" className="font-normal">Mês passado</Label>
          </div>
        </RadioGroup>
      </FilterItem>
      <Separator className="my-4" />
    </div>
  );
};
