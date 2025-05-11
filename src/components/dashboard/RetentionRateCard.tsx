
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, RefreshCw } from 'lucide-react';

export interface RetentionRateCardProps {
  retentionRate: number;
  newClients: number;
  returningClients: number;
}

export function RetentionRateCard({ retentionRate, newClients, returningClients }: RetentionRateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-primary" />
          Taxa de Retenção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Taxa de retenção</span>
          <span className="font-medium">{retentionRate}%</span>
        </div>
        <Progress value={retentionRate} className="h-2 mb-6" />

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center">
              <UserPlus className="h-3 w-3 mr-1 text-primary" /> 
              Novos clientes
            </span>
            <span className="font-medium">{newClients}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center">
              <Users className="h-3 w-3 mr-1 text-primary" /> 
              Clientes retornando
            </span>
            <span className="font-medium">{returningClients}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
