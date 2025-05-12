
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PopularService } from "@/hooks/dashboard/useDashboardData";

interface PopularServicesWidgetProps {
  services: PopularService[];
}

export function PopularServicesWidget({ services }: PopularServicesWidgetProps) {
  if (!services || services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Populares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center">
              <div className="mr-4 h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{service.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span>{service.count} agend.</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                  {service.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
