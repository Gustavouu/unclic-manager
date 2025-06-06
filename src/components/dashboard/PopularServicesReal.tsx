
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, TrendingUp } from 'lucide-react';
import { PopularServiceReal } from '@/hooks/dashboard/useDashboardMetricsReal';

interface PopularServicesRealProps {
  services: PopularServiceReal[];
  isLoading?: boolean;
}

export const PopularServicesReal: React.FC<PopularServicesRealProps> = ({ 
  services, 
  isLoading = false 
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Serviços Populares
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Serviços Populares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.length > 0 ? (
          services.map((service, index) => (
            <div key={service.id} className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-primary'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(service.revenue)}
                    </p>
                    {service.revenue > 0 && (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs mb-1">
                  {service.count} agendamentos
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {service.percentage.toFixed(1)}% do total
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Scissors className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Nenhum serviço encontrado</p>
            <p className="text-xs">Comece criando agendamentos para ver estatísticas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
