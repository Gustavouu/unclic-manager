
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Service {
  name: string;
  count: number;
  revenue: number;
}

interface ServicesTabProps {
  popularServices: Service[];
  totalRevenue: number;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ popularServices, totalRevenue }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Mais Populares</CardTitle>
        <CardDescription>Ranking dos serviços por demanda e receita</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">{service.count} agendamentos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {service.revenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {((service.revenue / totalRevenue) * 100).toFixed(1)}% da receita
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
