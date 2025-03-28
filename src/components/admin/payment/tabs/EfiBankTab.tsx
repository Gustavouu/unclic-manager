
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { EfiIntegrationForm } from "../EfiIntegrationForm";

interface EfiBankTabProps {
  isConfigured: boolean;
}

export function EfiBankTab({ isConfigured }: EfiBankTabProps) {
  return (
    <>
      {isConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-green-500 mr-2"></div>
              Integração Configurada
            </CardTitle>
            <CardDescription>
              A integração com a Efi Bank está ativa. Você pode editar as configurações abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EfiIntegrationForm />
          </CardContent>
        </Card>
      ) : (
        <EfiIntegrationForm />
      )}
    </>
  );
}
