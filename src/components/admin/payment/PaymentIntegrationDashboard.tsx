
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EfiIntegrationForm } from "./EfiIntegrationForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function PaymentIntegrationDashboard() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        // Check if any transaction has Efi Bank information in its notes
        const { data, error } = await supabase
          .from('transacoes')
          .select('notas')
          .eq('id_negocio', "1")
          .not('notas', 'is', null)
          .limit(1);

        if (error) {
          console.error("Erro ao verificar configuração da Efi Bank:", error);
        }

        // Check if any transaction has Efi Bank config in notes
        if (data && data.length > 0) {
          try {
            const notes = data[0].notas;
            if (notes && notes.includes('efi_integration')) {
              setIsConfigured(true);
            }
          } catch (parseError) {
            console.error("Error parsing notes JSON:", parseError);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar configuração:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConfiguration();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Integrações de Pagamento</h2>
        <p className="text-muted-foreground">
          Configure as integrações de pagamento para seu negócio.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Carregando configurações...</p>
        </div>
      ) : (
        <Tabs defaultValue="efi-bank" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-1">
            <TabsTrigger value="efi-bank">Efi Bank</TabsTrigger>
          </TabsList>
          <TabsContent value="efi-bank" className="mt-6">
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
          </TabsContent>
        </Tabs>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Webhook para Notificações de Pagamento</CardTitle>
          <CardDescription>
            Configure o seguinte endpoint como webhook na sua conta da Efi Bank para receber atualizações automáticas sobre o status dos pagamentos.
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
    </div>
  );
}
