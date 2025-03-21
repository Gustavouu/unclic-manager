
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type StatusFilterProps = {
  statuses: string[];
  selectedStatuses: string[];
  onToggle: (status: string) => void;
};

export const StatusFilter = ({ 
  statuses, 
  selectedStatuses, 
  onToggle 
}: StatusFilterProps) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'vacation': return 'Em férias';
      default: return status;
    }
  };

  const getStatusColor = (status: string, isSelected: boolean) => {
    if (!isSelected) return "";
    
    switch(status) {
      case 'active':
        return "bg-green-500 hover:bg-green-600";
      case 'inactive':
        return "bg-red-500 hover:bg-red-600";
      case 'vacation':
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Status</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {statuses.map((status) => {
          const isSelected = selectedStatuses.includes(status);
          const badgeVariant = isSelected ? "default" : "outline";
          const badgeColor = getStatusColor(status, isSelected);
          
          return (
            <Badge 
              key={status}
              variant={badgeVariant}
              className={`cursor-pointer transition-colors ${badgeColor}`}
              onClick={() => onToggle(status)}
            >
              {getStatusLabel(status)}
              {isSelected && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
