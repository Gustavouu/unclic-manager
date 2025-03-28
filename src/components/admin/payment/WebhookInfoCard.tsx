
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export function WebhookInfoCard() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Webhook para Notificações de Pagamento</CardTitle>
        <CardDescription>
          Configure o seguinte endpoint como webhook na sua conta para receber atualizações automáticas sobre o status dos pagamentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md">
          <code className="text-sm">{window.location.origin}/api/webhooks/efi-bank</code>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Este endpoint receberá notificações quando o status de um pagamento mudar, permitindo que você atualize automaticamente o status dos agendamentos.
        </p>
      </CardContent>
    </Card>
  );
}
