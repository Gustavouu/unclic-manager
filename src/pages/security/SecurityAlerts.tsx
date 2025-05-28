import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function SecurityAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alertas de Segurança</h1>
        <p className="text-muted-foreground">
          Monitore e gerencie alertas de segurança do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alertas Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Implementar lista de alertas aqui */}
          <p className="text-muted-foreground">Nenhum alerta ativo no momento.</p>
        </CardContent>
      </Card>
    </div>
  );
} 