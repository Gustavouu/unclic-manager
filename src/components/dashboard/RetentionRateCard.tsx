
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RetentionRateCardProps {
  retentionRate: number;
  newClients: number;
  returningClients: number;
}

export function RetentionRateCard({
  retentionRate,
  newClients,
  returningClients,
}: RetentionRateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Taxa de Retenção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center my-2">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="text-primary stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${retentionRate * 2.51} ${251 - retentionRate * 2.51}`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{retentionRate}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Novos Clientes</p>
            <p className="text-xl font-bold">{newClients}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Clientes Recorrentes</p>
            <p className="text-xl font-bold">{returningClients}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
