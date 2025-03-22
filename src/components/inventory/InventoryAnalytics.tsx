
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 text-xs">
          {bestSellers.map((product, index) => (
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
            <div className="space-y-2">
              {needsRestock.map((product) => (
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
            <div className="space-y-2">
              {slowMoving.map((product) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <span>{product.name}</span>
                  <Badge variant="outline" className="bg-gray-100 text-[10px]">
                    Última venda: {product.data}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
