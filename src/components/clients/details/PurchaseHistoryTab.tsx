
import { PurchaseHistoryItem } from "@/hooks/useClientHistory";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package } from "lucide-react";

type PurchaseHistoryTabProps = {
  purchaseHistory: PurchaseHistoryItem[];
};

export const PurchaseHistoryTab = ({ purchaseHistory }: PurchaseHistoryTabProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <div>
      {purchaseHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum histórico de compra disponível
        </div>
      ) : (
        <div className="space-y-4">
          {purchaseHistory.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{purchase.productName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(purchase.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm">Quantidade: {purchase.quantity}</div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm">{formatCurrency(purchase.price)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
