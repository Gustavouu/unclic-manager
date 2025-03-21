
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type ActiveClientFilterProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const ActiveClientFilter = ({ checked, onCheckedChange }: ActiveClientFilterProps) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="activeClient" className="text-sm font-medium cursor-pointer">Cliente ativo</Label>
        <Checkbox 
          id="activeClient"
          checked={checked}
          onCheckedChange={(checked) => 
            onCheckedChange(checked as boolean)
          }
        />
      </div>
    </div>
  );
};
