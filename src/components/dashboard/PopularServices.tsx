
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
  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-4">
        <div className="h-12 w-12 text-muted-foreground mb-2 opacity-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
            <line x1="16" y1="8" x2="2" y2="22"></line>
            <line x1="17.5" y1="15" x2="9" y2="15"></line>
          </svg>
        </div>
        <h3 className="font-medium">Sem dados de serviços</h3>
        <p className="text-sm text-muted-foreground">
          Nenhum serviço com dados de popularidade disponível
        </p>
      </div>
    );
  }

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
