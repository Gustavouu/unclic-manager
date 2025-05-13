
import { Badge } from "@/components/ui/badge";
import { ProfessionalStatus, STATUS_MAPPING } from "@/hooks/professionals/types";

interface ProfessionalStatusBadgeProps {
  status: ProfessionalStatus | string;
  showLabel?: boolean;
}

export const ProfessionalStatusBadge = ({ status, showLabel = true }: ProfessionalStatusBadgeProps) => {
  // Map legacy status to new format if needed
  const normalizedStatus = (status in STATUS_MAPPING) 
    ? STATUS_MAPPING[status as keyof typeof STATUS_MAPPING] as ProfessionalStatus
    : status as ProfessionalStatus;

  const getStatusColor = () => {
    switch (normalizedStatus) {
      case 'ACTIVE':
        return "bg-green-100 text-green-800";
      case 'ON_LEAVE':
        return "bg-amber-100 text-amber-800";
      case 'INACTIVE':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = () => {
    switch (normalizedStatus) {
      case 'ACTIVE':
        return "Ativo";
      case 'ON_LEAVE':
        return "Ausente";
      case 'INACTIVE':
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Badge className={`${getStatusColor()} rounded-full font-medium`}>
      {showLabel ? getStatusLabel() : ""}
    </Badge>
  );
};
