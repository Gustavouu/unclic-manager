
import { useWebhookConfig } from "./useWebhookConfig";
import { WebhookUrlField } from "./WebhookUrlField";
import { NotificationUrlField } from "./NotificationUrlField";
import { WebhookSecretKeyField } from "./WebhookSecretKeyField";
import { WebhookIntegrationSelect } from "./WebhookIntegrationSelect";
import { WebhookActiveToggle } from "./WebhookActiveToggle";
import { WebhookInfoAlert } from "./WebhookInfoAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function WebhookForm() {
  const { config, isLoading, handleChange, generateSecretKey, saveWebhookConfig } = useWebhookConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookConfig();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações de Webhook</CardTitle>
        <CardDescription>
          Configure webhooks para integrar seu portal de cliente com nossa plataforma de pagamentos
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <WebhookUrlField 
            webhookUrl={config.webhookUrl} 
            onChange={(value) => handleChange("webhookUrl", value)} 
          />

          <NotificationUrlField />

          <WebhookSecretKeyField 
            secretKey={config.secretKey} 
            onChange={(value) => handleChange("secretKey", value)}
            onGenerate={generateSecretKey}
          />

          <WebhookIntegrationSelect 
            value={config.paymentIntegration} 
            onChange={(value) => handleChange("paymentIntegration", value)} 
          />

          <WebhookActiveToggle 
            isActive={config.isActive} 
            onChange={(checked) => handleChange("isActive", checked)} 
          />

          <WebhookInfoAlert />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
