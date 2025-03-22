
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from '@/hooks/inventory/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';

interface InventoryAnalyticsProps {
  bestSellers: Product[];
  needsRestock: Product[];
  slowMoving: Product[];
}

export const InventoryAnalytics = ({ bestSellers, needsRestock, slowMoving }: InventoryAnalyticsProps) => {
  // Find the highest sales count to normalize progress bars
  const maxSales = bestSellers.length > 0 
    ? Math.max(...bestSellers.map(p => p.salesCount || 0)) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Bestselling Products */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bestSellers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Nenhum dado de vendas disponível</p>
          ) : (
            <div className="space-y-4">
              {bestSellers.map(product => (
                <div key={product.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.salesCount} vendas</span>
                  </div>
                  <Progress value={((product.salesCount || 0) / maxSales) * 100} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restock Alerts */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Alerta de Reposição
          </CardTitle>
        </CardHeader>
        <CardContent>
          {needsRestock.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Todos os produtos têm estoque suficiente</p>
          ) : (
            <div className="space-y-2">
              {needsRestock.map(product => (
                <Alert key={product.id} className="py-3 bg-orange-50">
                  <AlertTitle className="text-sm font-medium">{product.name}</AlertTitle>
                  <AlertDescription className="text-xs">
                    Estoque atual: <Badge variant="outline" className="ml-1 bg-orange-100">{product.quantity}</Badge> 
                    <span className="mx-1">|</span> 
                    Mínimo: <Badge variant="outline" className="ml-1">{product.minQuantity}</Badge>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slow Moving Products */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Produtos com Baixa Rotatividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slowMoving.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Todos os produtos têm boa rotatividade</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Última Venda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slowMoving.slice(0, 5).map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="py-2">{product.name}</TableCell>
                    <TableCell className="py-2 text-muted-foreground">
                      {product.lastSoldAt 
                        ? new Date(product.lastSoldAt).toLocaleDateString('pt-BR')
                        : 'Nunca vendido'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
