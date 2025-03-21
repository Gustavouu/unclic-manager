
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/hooks/inventory";

interface StatusBadgeProps {
  item: InventoryItem;
}

export const StatusBadge = ({ item }: StatusBadgeProps) => {
  if (item.quantity === 0) {
    return <Badge variant="destructive">Sem estoque</Badge>;
  } else if (item.quantity <= item.minimumQuantity) {
    return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">Estoque baixo</Badge>;
  } else {
    return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Em estoque</Badge>;
  }
};
