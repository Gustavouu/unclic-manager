
import { Package, AlertTriangle, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/hooks/inventory";

interface InventorySummaryCardsProps {
  inventory: InventoryItem[];
}

export const InventorySummaryCards = ({ inventory }: InventorySummaryCardsProps) => {
  // Calculate total inventory count
  const totalItems = inventory.length;
  
  // Calculate items with low stock
  const lowStockItems = inventory.filter(item => 
    item.quantity > 0 && item.quantity <= item.minimumQuantity
  ).length;
  
  // Calculate total inventory value
  const totalValue = inventory.reduce((sum, item) => {
    const itemValue = (item.sellingPrice || 0) * item.quantity;
    return sum + itemValue;
  }, 0);
  
  // Calculate out of stock items
  const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <SummaryCard 
        title="Total em Estoque"
        value={`${totalItems} itens`}
        icon={<Package className="h-5 w-5 text-blue-600" />}
        iconClass="bg-blue-100"
      />
      
      <SummaryCard 
        title="Produtos em Baixa"
        value={`${lowStockItems} itens`}
        icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
        iconClass="bg-amber-100"
      />
      
      <SummaryCard 
        title="Valor Total"
        value={`R$ ${totalValue.toFixed(2).replace('.', ',')}`}
        icon={<DollarSign className="h-5 w-5 text-green-600" />}
        iconClass="bg-green-100"
      />
      
      <SummaryCard 
        title="Produtos Parados"
        value={`${outOfStockItems} itens`}
        icon={<Clock className="h-5 w-5 text-orange-600" />}
        iconClass="bg-orange-100"
      />
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}

const SummaryCard = ({ title, value, icon, iconClass }: SummaryCardProps) => {
  return (
    <Card className="border shadow-sm hover:shadow transition-shadow duration-200">
      <CardContent className="p-5 md:p-6 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${iconClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-xl md:text-2xl font-semibold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};
