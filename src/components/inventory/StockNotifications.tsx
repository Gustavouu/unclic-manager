
import React, { useState } from 'react';
import { useStockNotifications } from '@/hooks/inventory/useStockNotifications';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StockNotifications = () => {
  const { lowStockItems, hasUnreadNotifications, markNotificationsAsRead } = useStockNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && hasUnreadNotifications) {
      markNotificationsAsRead();
    }
  };
  
  const goToInventory = () => {
    navigate('/inventory');
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Notificações de Estoque</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToInventory} 
              className="text-xs"
            >
              Ver Estoque
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-auto">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-muted/50 p-2 rounded text-xs space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-red-500">
                      {item.currentQuantity} / {item.minQuantity} {item.unit}
                    </span>
                  </div>
                  <p className="text-muted-foreground">Estoque baixo, necessita reposição</p>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Nenhum produto com estoque baixo
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
