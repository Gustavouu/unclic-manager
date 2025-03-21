
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, ShoppingBag } from "lucide-react";
import { ServiceHistoryItem, ServiceHistoryItemCard } from "./ServiceHistoryItem";
import { PurchaseHistoryItem, PurchaseHistoryItemCard } from "./PurchaseHistoryItem";

interface ClientHistoryTabsProps {
  serviceHistory: ServiceHistoryItem[];
  purchaseHistory: PurchaseHistoryItem[];
}

export const ClientHistoryTabs = ({ serviceHistory, purchaseHistory }: ClientHistoryTabsProps) => {
  return (
    <Tabs defaultValue="services" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-2">
        <TabsTrigger value="services" className="flex items-center gap-1">
          <Scissors className="h-3.5 w-3.5" />
          <span>Serviços</span>
        </TabsTrigger>
        <TabsTrigger value="purchases" className="flex items-center gap-1">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Compras</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="services" className="space-y-4">
        {serviceHistory.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhum serviço encontrado</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {serviceHistory.map((service) => (
              <ServiceHistoryItemCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="purchases" className="space-y-4">
        {purchaseHistory.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhuma compra encontrada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {purchaseHistory.map((purchase) => (
              <PurchaseHistoryItemCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
