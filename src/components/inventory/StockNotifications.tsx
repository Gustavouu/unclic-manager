
import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStockNotifications } from "@/hooks/inventory/useStockNotifications";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function StockNotifications() {
  const [open, setOpen] = useState(false);
  const { 
    lowStockItems, 
    isLoading, 
    hasUnreadNotifications, 
    markNotificationsAsRead 
  } = useStockNotifications();
  
  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && hasUnreadNotifications) {
      markNotificationsAsRead();
    }
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]" 
              variant="destructive"
            >
              {lowStockItems.length > 9 ? '9+' : lowStockItems.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h4 className="font-medium">Notificações de Estoque</h4>
          <Badge variant="outline" className="font-normal">
            {lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'itens'}
          </Badge>
        </div>
        <div className="max-h-80 overflow-auto">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhum produto com estoque baixo.
            </div>
          ) : (
            <div className="divide-y">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 hover:bg-slate-50">
                  <h5 className="font-medium">{item.name}</h5>
                  <p className="text-sm text-red-600">
                    Estoque: {item.currentQuantity} {item.unit} 
                    (Mínimo: {item.minQuantity})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            asChild
          >
            <a href="/inventory">Gerenciar Estoque</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
