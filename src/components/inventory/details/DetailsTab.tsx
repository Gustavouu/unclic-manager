
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/hooks/useInventoryData";

interface DetailsTabProps {
  item: InventoryItem;
  formatCurrency: (value?: number) => string;
  getFormattedDate: (dateString?: string) => string;
}

export const DetailsTab = ({ item, formatCurrency, getFormattedDate }: DetailsTabProps) => {
  return (
    <div className="space-y-4">
      {item.image && (
        <div className="flex justify-center my-4">
          <img 
            src={item.image} 
            alt={item.name} 
            className="h-32 w-32 object-cover rounded-md border"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Quantidade</h4>
            <p className="text-lg font-medium">{item.quantity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Quant. Mínima</h4>
            <p className="text-lg font-medium">{item.minimumQuantity}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
            <p>{item.description || "—"}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Preço de Custo</h4>
              <p>{formatCurrency(item.costPrice)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Preço de Venda</h4>
              <p>{formatCurrency(item.sellingPrice)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fornecedor</h4>
              <p>{item.supplier || "—"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Localização</h4>
              <p>{item.location || "—"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">SKU</h4>
              <p>{item.sku || "—"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Código de Barras</h4>
              <p>{item.barcode || "—"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data da Validade</h4>
              <p>{item.expirationDate ? getFormattedDate(item.expirationDate) : "—"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Última Reposição</h4>
              <p>{item.lastRestockDate ? getFormattedDate(item.lastRestockDate) : "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
