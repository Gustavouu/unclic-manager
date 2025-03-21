
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/hooks/useInventoryData";

interface StatsTabProps {
  item: InventoryItem;
  formatCurrency: (value?: number) => string;
  getFormattedDate: (dateString?: string) => string;
}

export const StatsTab = ({ item, formatCurrency, getFormattedDate }: StatsTabProps) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor em Estoque</h4>
          <p className="text-lg font-medium">
            {formatCurrency(item.quantity * (item.costPrice || 0))}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Margem de Lucro</h4>
          <p className="text-lg font-medium">
            {item.costPrice && item.sellingPrice 
              ? `${(((item.sellingPrice - item.costPrice) / item.costPrice) * 100).toFixed(2)}%` 
              : "—"}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Criado em</h4>
          <p>{getFormattedDate(item.createdAt)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Última atualização</h4>
          <p>{getFormattedDate(item.updatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
