
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AnalyticsProduct {
  id: string;
  name: string;
  data: string | number;
}

interface InventoryAnalyticsProps {
  title: string;
  icon: string;
  iconColor?: string;
  products: AnalyticsProduct[];
  valueLabel?: string;
  valuePrefix?: string;
  showProgress?: boolean;
  showMinThreshold?: boolean;
}

export const InventoryAnalytics = ({ 
  title,
  icon,
  iconColor = "text-primary",
  products,
  valueLabel = "",
  valuePrefix = "",
  showProgress = false,
  showMinThreshold = false
}: InventoryAnalyticsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Limite inicial de itens para exibir
  const initialLimit = 2;
  const hasMoreItems = products.length > initialLimit;

  // Renderiza o ícone correto com base no nome do ícone
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "trending-up":
        return <TrendingUp className={cn("h-4 w-4", iconColor)} />;
      case "alert-triangle":
        return <AlertTriangle className={cn("h-4 w-4", iconColor)} />;
      case "clock":
        return <Clock className={cn("h-4 w-4", iconColor)} />;
      default:
        return <TrendingUp className={cn("h-4 w-4", iconColor)} />;
    }
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {renderIcon(icon)}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 text-xs">
        {products.length === 0 ? (
          <p className="text-muted-foreground">Nenhum dado disponível.</p>
        ) : (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <div className="space-y-2">
              {products.slice(0, initialLimit).map((product) => (
                <div key={product.id} className="mb-2 last:mb-0">
                  {showProgress ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-muted-foreground">{product.data} {valueLabel}</span>
                      </div>
                      <div className="relative w-full h-1.5 bg-gray-100 rounded-full mt-1">
                        <div 
                          className="absolute h-1.5 bg-green-500 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (Number(product.data) / (products[0]?.data ? Number(products[0].data) : 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </>
                  ) : showMinThreshold ? (
                    <div className="border rounded-md p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 text-[10px]">
                          {product.data}
                        </Badge>
                      </div>
                      <Separator className="my-1.5" />
                      <div className="text-muted-foreground text-[10px]">
                        Estoque mínimo recomendado: 10
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{product.name}</span>
                      <Badge variant="outline" className="bg-gray-100 text-[10px]">
                        {valuePrefix} {product.data}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {hasMoreItems && (
              <CollapsibleContent>
                <div className="space-y-2 mt-2">
                  {products.slice(initialLimit).map((product) => (
                    <div key={product.id} className="mb-2 last:mb-0">
                      {showProgress ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-muted-foreground">{product.data} {valueLabel}</span>
                          </div>
                          <div className="relative w-full h-1.5 bg-gray-100 rounded-full mt-1">
                            <div 
                              className="absolute h-1.5 bg-green-500 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (Number(product.data) / (products[0]?.data ? Number(products[0].data) : 1)) * 100)}%` 
                              }}
                            />
                          </div>
                        </>
                      ) : showMinThreshold ? (
                        <div className="border rounded-md p-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{product.name}</span>
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 text-[10px]">
                              {product.data}
                            </Badge>
                          </div>
                          <Separator className="my-1.5" />
                          <div className="text-muted-foreground text-[10px]">
                            Estoque mínimo recomendado: 10
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{product.name}</span>
                          <Badge variant="outline" className="bg-gray-100 text-[10px]">
                            {valuePrefix} {product.data}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            )}
            
            {hasMoreItems && (
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {isOpen ? (
                    <span className="flex items-center gap-1">
                      Ver menos <ChevronUp className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Ver mais {products.length - initialLimit} produtos <ChevronDown className="h-3 w-3" />
                    </span>
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};
