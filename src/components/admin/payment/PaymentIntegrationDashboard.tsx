
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { usePaymentConfig } from "./hooks/usePaymentConfig";
import { LoadingState } from "./LoadingState";
import { EfiBankTab } from "./tabs/EfiBankTab";
import { WebhooksTab } from "./tabs/WebhooksTab";
import { WebhookInfoCard } from "./WebhookInfoCard";

interface PaymentIntegrationDashboardProps {
  initialTab?: string;
}

export function PaymentIntegrationDashboard({ initialTab = "efi-bank" }: PaymentIntegrationDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isConfigured, isWebhookConfigured, isLoading } = usePaymentConfig();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Integrações de Pagamento</h2>
        <p className="text-muted-foreground">
          Configure as integrações de pagamento para seu negócio.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="efi-bank">Efi Bank</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          <TabsContent value="efi-bank" className="mt-6">
            <EfiBankTab isConfigured={isConfigured} />
          </TabsContent>
          <TabsContent value="webhooks" className="mt-6">
            <WebhooksTab isWebhookConfigured={isWebhookConfigured} />
          </TabsContent>
        </Tabs>
      )}

      <WebhookInfoCard />
    </div>
  );
}
