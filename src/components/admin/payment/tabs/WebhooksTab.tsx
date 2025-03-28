
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { WebhookForm } from "../webhook/WebhookForm";

interface WebhooksTabProps {
  isWebhookConfigured: boolean;
}

export function WebhooksTab({ isWebhookConfigured }: WebhooksTabProps) {
  return (
    <>
      {isWebhookConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-green-500 mr-2"></div>
              Webhook Configurado
            </CardTitle>
            <CardDescription>
              A configuração de webhook está ativa. Você pode editar as configurações abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WebhookForm />
          </CardContent>
        </Card>
      ) : (
        <WebhookForm />
      )}
    </>
  );
}
