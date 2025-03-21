
import { Badge } from "@/components/ui/badge";
import { ProfessionalStatus } from "@/hooks/professionals/types";

interface ProfessionalStatusBadgeProps {
  status: ProfessionalStatus;
}

export const ProfessionalStatusBadge = ({ status }: ProfessionalStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { label: "Ativo", className: "bg-green-100 text-green-800 hover:bg-green-200" };
      case "vacation":
        return { label: "De férias", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" };
      case "leave":
        return { label: "Licença", className: "bg-orange-100 text-orange-800 hover:bg-orange-200" };
      case "inactive":
        return { label: "Inativo", className: "bg-gray-100 text-gray-800 hover:bg-gray-200" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800 hover:bg-gray-200" };
    }
  };

  const { label, className } = getStatusConfig();

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};
