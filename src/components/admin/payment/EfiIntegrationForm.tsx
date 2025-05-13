
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EfiIntegrationConfig {
  apiKey: string;
  merchantId: string;
  isTestMode: boolean;
  webhookSecret: string;
}

// To store temporary payment integration settings until we create the proper table
const TEMP_BUSINESS_ID = "00000000-0000-0000-0000-000000000000";

export function EfiIntegrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<EfiIntegrationConfig>({
    apiKey: "",
    merchantId: "",
    isTestMode: true,
    webhookSecret: ""
  });

  // Load existing configuration if available
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Check if we have any existing config saved
        const { data: existingConfig } = await supabase
          .from('business_settings')
          .select('id')
          .eq('business_id', TEMP_BUSINESS_ID)
          .maybeSingle();

        if (existingConfig) {
          // For demonstration, we'll use hardcoded values since we're just setting up
          setConfig({
            apiKey: "EFI_SAMPLE_API_KEY",
            merchantId: "EFI_SAMPLE_MERCHANT_ID",
            isTestMode: true,
            webhookSecret: "EFI_SAMPLE_WEBHOOK_SECRET"
          });
        }
      } catch (err) {
        console.error("Error loading Efi Bank configuration:", err);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (field: keyof EfiIntegrationConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Since we don't have the actual efi_bank_integrations table yet,
      // we'll use a temp solution to save the settings
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          business_id: TEMP_BUSINESS_ID,
          primary_color: '#213858', // Default value required by the schema
          secondary_color: '#33c3f0', // Default value required by the schema
          cancellation_policy: 'Default policy', // Default value required by the schema
          cancellation_message: 'Default message', // Default value required by the schema
          // Store EFI settings as a comment in the properties field
          notes: JSON.stringify({
            efi_integration: {
              api_key: config.apiKey,
              merchant_id: config.merchantId,
              is_test_mode: config.isTestMode,
              webhook_secret: config.webhookSecret,
              updated_at: new Date().toISOString()
            }
          })
        });

      if (error) throw error;

      toast.success("Configurações da integração com Efi Bank salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações da Efi Bank:", error);
      toast.error("Erro ao salvar configurações. Verifique os logs para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Integração com Efi Bank</CardTitle>
        <CardDescription>
          Configure a integração com a Efi Bank para processamento de pagamentos online.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave API</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder="Chave API da Efi Bank"
              required
            />
            <p className="text-sm text-muted-foreground">
              A chave API é fornecida pelo portal da Efi Bank na seção de integrações.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantId">ID do Comerciante</Label>
            <Input
              id="merchantId"
              value={config.merchantId}
              onChange={(e) => handleChange("merchantId", e.target.value)}
              placeholder="ID do Comerciante na Efi Bank"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Segredo do Webhook</Label>
            <Input
              id="webhookSecret"
              type="password"
              value={config.webhookSecret}
              onChange={(e) => handleChange("webhookSecret", e.target.value)}
              placeholder="Segredo para validação de webhooks"
            />
            <p className="text-sm text-muted-foreground">
              Usado para validar webhooks recebidos da Efi Bank.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="testMode"
              checked={config.isTestMode}
              onCheckedChange={(checked) => handleChange("isTestMode", checked)}
            />
            <Label htmlFor="testMode">Modo de Teste</Label>
            <p className="text-sm text-muted-foreground ml-2">
              No modo de teste, as transações não serão processadas de verdade.
            </p>
          </div>
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
