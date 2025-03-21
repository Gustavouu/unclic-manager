
import { CalendarDays, Package2 } from "lucide-react";

export type PurchaseHistoryItem = {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  price: number;
};

interface PurchaseHistoryItemProps {
  purchase: PurchaseHistoryItem;
}

export const PurchaseHistoryItemCard = ({ purchase }: PurchaseHistoryItemProps) => {
  // Format date to display
  const formatDate = (dateString: string) => {
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
    <div className="p-3 bg-muted/20 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{purchase.productName}</h4>
        <span className="text-sm font-medium text-primary">
          {formatCurrency(purchase.price)}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          <span>{formatDate(purchase.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Package2 className="h-3 w-3" />
          <span>Qtd: {purchase.quantity}</span>
        </div>
      </div>
    </div>
  );
};
