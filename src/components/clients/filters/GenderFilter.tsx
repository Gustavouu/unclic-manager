
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type GenderFilterProps = {
  value: string | null;
  onChange: (value: string) => void;
};

export const GenderFilter = ({ value, onChange }: GenderFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Gênero</Label>
      <RadioGroup 
        defaultValue="todos"
        value={value || "todos"}
        onValueChange={onChange}
        className="flex flex-col space-y-2 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="todos" id="todos" />
          <Label htmlFor="todos" className="text-sm font-normal cursor-pointer">Todos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Masculino" id="masculino" />
          <Label htmlFor="masculino" className="text-sm font-normal cursor-pointer">Masculino</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Feminino" id="feminino" />
          <Label htmlFor="feminino" className="text-sm font-normal cursor-pointer">Feminino</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
