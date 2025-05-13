
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Scissors } from "lucide-react";

interface PopularServicesProps {
  services: Array<{id: string, name: string, count: number, percentage: number}>;
  loading?: boolean;
}

export function PopularServices({ services, loading = false }: PopularServicesProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-100 rounded animate-pulse w-36"></div>
                <div className="h-2 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : services?.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Scissors className="h-3 w-3 mr-1" />
                    <span>{service.count} agendamentos</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={service.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{service.percentage.toFixed(1)}% dos serviços</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Scissors className="h-12 w-12 mb-2 opacity-20" />
            <p>Nenhum serviço agendado no período</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
