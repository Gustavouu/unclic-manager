
import { CalendarDays, CircleDollarSign } from "lucide-react";

interface ClientStatsProps {
  lastVisit: string | null;
  totalSpent: number;
}

export const ClientStats = ({ lastVisit, totalSpent }: ClientStatsProps) => {
  // Format date to display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca visitou";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
        <CalendarDays className="h-5 w-5 text-muted-foreground mb-1" />
        <span className="text-xs text-muted-foreground">Última visita</span>
        <span className="font-medium mt-1">
          {formatDate(lastVisit)}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
        <CircleDollarSign className="h-5 w-5 text-primary mb-1" />
        <span className="text-xs text-muted-foreground">Total gasto</span>
        <span className="font-medium mt-1">
          {formatCurrency(totalSpent)}
        </span>
      </div>
    </div>
  );
};
