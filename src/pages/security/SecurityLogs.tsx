import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function SecurityLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logs de Segurança</h1>
        <p className="text-muted-foreground">
          Visualize e analise os logs de segurança do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Logs Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Implementar tabela de logs aqui */}
          <p className="text-muted-foreground">Nenhum log disponível no momento.</p>
        </CardContent>
      </Card>
    </div>
  );
} 