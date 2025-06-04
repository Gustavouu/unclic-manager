
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, TrendingUp } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

interface PopularServicesProps {
  services?: Service[];
}

export const PopularServices: React.FC<PopularServicesProps> = ({ 
  services = [
    { id: '1', name: 'Corte de Cabelo', count: 45, percentage: 40 },
    { id: '2', name: 'Barba', count: 28, percentage: 25 },
    { id: '3', name: 'Sobrancelha', count: 22, percentage: 20 },
    { id: '4', name: 'Tratamento', count: 17, percentage: 15 },
  ]
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Serviços Populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.count} agendamentos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {service.percentage.toFixed(1)}%
                </Badge>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de serviços</span>
            <span className="font-medium">{services.reduce((sum, service) => sum + service.count, 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
