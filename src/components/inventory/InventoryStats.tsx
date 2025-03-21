
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryItem } from "@/hooks/inventory";
import { Package } from "lucide-react";

interface InventoryStatsProps {
  inventory: InventoryItem[];
  title: string;
  emptyMessage: string;
  type: "recent" | "stopped";
}

export const InventoryStats = ({ inventory, title, emptyMessage, type }: InventoryStatsProps) => {
  // For demonstration purposes, we'll filter items
  // In a real app, this would be based on actual movement data
  let filteredItems: InventoryItem[] = [];
  
  if (type === "recent") {
    // Get 5 most recently updated items as "most moved"
    filteredItems = [...inventory]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  } else if (type === "stopped") {
    // Get items with zero quantity as "stopped"
    filteredItems = inventory
      .filter(item => item.quantity === 0)
      .slice(0, 5);
  }
  
  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredItems.map(item => (
              <li key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-10 w-10 rounded object-cover border border-muted"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-grow">
                  <p className="font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">em estoque</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
