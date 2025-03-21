
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type SpentRangeFilterProps = {
  value: [number, number];
  onChange: (values: number[]) => void;
};

export const SpentRangeFilter = ({ value, onChange }: SpentRangeFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Total gasto</Label>
      <Slider 
        defaultValue={[0, 1000]}
        value={[value[0], value[1]]}
        max={1000}
        step={50}
        onValueChange={onChange}
        className="mt-4"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1 font-medium">
        <span>R$ {value[0]}</span>
        <span>R$ {value[1]}</span>
      </div>
    </div>
  );
};
