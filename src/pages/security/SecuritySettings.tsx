import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações de Segurança</h1>
        <p className="text-muted-foreground">
          Configure as políticas e parâmetros de segurança do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            Políticas de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Implementar formulário de configurações aqui */}
          <p className="text-muted-foreground">Configurações em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
} 