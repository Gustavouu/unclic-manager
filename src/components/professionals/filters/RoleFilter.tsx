
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type RoleFilterProps = {
  roles: string[];
  selectedRoles: string[];
  onToggle: (role: string) => void;
};

export const RoleFilter = ({ 
  roles, 
  selectedRoles, 
  onToggle 
}: RoleFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Função</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {roles.map((role) => (
          <Badge 
            key={role}
            variant={selectedRoles.includes(role) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggle(role)}
          >
            {role}
            {selectedRoles.includes(role) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};
