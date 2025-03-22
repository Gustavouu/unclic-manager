
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AnalyticsProduct {
  id: string;
  name: string;
  data: string | number;
}

interface InventoryAnalyticsProps {
  bestSellers: AnalyticsProduct[];
  needsRestock: AnalyticsProduct[];
  slowMoving: AnalyticsProduct[];
}

export const InventoryAnalytics = ({ 
  bestSellers, 
  needsRestock, 
  slowMoving 
}: InventoryAnalyticsProps) => {
  const [openSections, setOpenSections] = useState<{
    bestSellers: boolean;
    needsRestock: boolean;
    slowMoving: boolean;
  }>({
    bestSellers: false,
    needsRestock: false,
    slowMoving: false
  });

  // Initial display limit
  const initialLimit = 2;

  return (
    <div className="w-full grid grid-cols-1 gap-3">
      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 text-xs">
          <Collapsible
            open={openSections.bestSellers}
            onOpenChange={(open) => setOpenSections(prev => ({ ...prev, bestSellers: open }))}
          >
            <div className="space-y-2">
              {bestSellers.slice(0, initialLimit).map((product, index) => (
                <div key={product.id} className="mb-2 last:mb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">{product.data} vendas</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-gray-100 rounded-full mt-1">
                    <div 
                      className="absolute h-1.5 bg-green-500 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (Number(product.data) / (bestSellers[0]?.data ? Number(bestSellers[0].data) : 1)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {bestSellers.length > initialLimit && (
              <CollapsibleContent>
                <div className="space-y-2 mt-2">
                  {bestSellers.slice(initialLimit).map((product, index) => (
                    <div key={product.id} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-muted-foreground">{product.data} vendas</span>
                      </div>
                      <div className="relative w-full h-1.5 bg-gray-100 rounded-full mt-1">
                        <div 
                          className="absolute h-1.5 bg-green-500 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (Number(product.data) / (bestSellers[0]?.data ? Number(bestSellers[0].data) : 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            )}
            
            {bestSellers.length > initialLimit && (
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {openSections.bestSellers ? (
                    <span className="flex items-center gap-1">
                      Ver menos <ChevronUp className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Ver mais {bestSellers.length - initialLimit} produtos <ChevronDown className="h-3 w-3" />
                    </span>
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </Collapsible>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Alerta de Reposição
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {needsRestock.length === 0 ? (
            <p className="text-muted-foreground text-xs">Todos os produtos estão com estoque adequado.</p>
          ) : (
            <Collapsible
              open={openSections.needsRestock}
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, needsRestock: open }))}
            >
              <div className="space-y-2">
                {needsRestock.slice(0, initialLimit).map((product) => (
                  <div key={product.id} className="border rounded-md p-2 text-xs">
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
                ))}
              </div>
              
              {needsRestock.length > initialLimit && (
                <CollapsibleContent>
                  <div className="space-y-2 mt-2">
                    {needsRestock.slice(initialLimit).map((product) => (
                      <div key={product.id} className="border rounded-md p-2 text-xs">
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
                    ))}
                  </div>
                </CollapsibleContent>
              )}
              
              {needsRestock.length > initialLimit && (
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {openSections.needsRestock ? (
                      <span className="flex items-center gap-1">
                        Ver menos <ChevronUp className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Ver mais {needsRestock.length - initialLimit} produtos <ChevronDown className="h-3 w-3" />
                      </span>
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
            </Collapsible>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Produtos com Baixa Rotatividade
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {slowMoving.length === 0 ? (
            <p className="text-muted-foreground text-xs">Nenhum produto com baixa rotatividade identificado.</p>
          ) : (
            <Collapsible
              open={openSections.slowMoving}
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, slowMoving: open }))}
            >
              <div className="space-y-2">
                {slowMoving.slice(0, initialLimit).map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-xs">
                    <span>{product.name}</span>
                    <Badge variant="outline" className="bg-gray-100 text-[10px]">
                      Última venda: {product.data}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {slowMoving.length > initialLimit && (
                <CollapsibleContent>
                  <div className="space-y-2 mt-2">
                    {slowMoving.slice(initialLimit).map((product) => (
                      <div key={product.id} className="flex items-center justify-between text-xs">
                        <span>{product.name}</span>
                        <Badge variant="outline" className="bg-gray-100 text-[10px]">
                          Última venda: {product.data}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
              
              {slowMoving.length > initialLimit && (
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {openSections.slowMoving ? (
                      <span className="flex items-center gap-1">
                        Ver menos <ChevronUp className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Ver mais {slowMoving.length - initialLimit} produtos <ChevronDown className="h-3 w-3" />
                      </span>
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
