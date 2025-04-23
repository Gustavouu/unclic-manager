
import React from 'react';

interface PopularService {
  name: string;
  count: number;
  percentage: number;
}

interface PopularServicesProps {
  services: PopularService[];
}

export function PopularServices({ services }: PopularServicesProps) {
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service.name} className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{service.name}</span>
            <span className="text-sm text-muted-foreground">{service.count} agendamentos</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${service.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
