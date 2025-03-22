
import { Badge } from "@/components/ui/badge";

type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "processing";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const PaymentStatusBadge = ({ status, className = "" }: PaymentStatusBadgeProps) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "approved":
        return { 
          label: "Aprovado", 
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "rejected":
        return { 
          label: "Recusado", 
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 border-red-200"
        };
      case "cancelled":
        return { 
          label: "Cancelado", 
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
      case "processing":
        return { 
          label: "Processando", 
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "pending":
      default:
        return { 
          label: "Pendente", 
          variant: "outline" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};
