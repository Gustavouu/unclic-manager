
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WebhookConfig {
  webhookUrl: string;
  secretKey: string;
  isActive: boolean;
  paymentIntegration: string;
}

export function WebhookConfigurationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<WebhookConfig>({
    webhookUrl: "",
    secretKey: "",
    isActive: false,
    paymentIntegration: "padrao"
  });

  // Load existing configuration if available
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('transacoes')
          .select('notas')
          .eq('id_negocio', "1")
          .limit(1);

        if (error) {
          console.error("Erro ao buscar configuração de webhook:", error);
          return;
        }

        if (data && data.length > 0 && data[0].notas) {
          try {
            const notes = JSON.parse(data[0].notas);
            if (notes.webhook_config) {
              setConfig({
                webhookUrl: notes.webhook_config.webhook_url || "",
                secretKey: notes.webhook_config.secret_key || "",
                isActive: notes.webhook_config.is_active || false,
                paymentIntegration: notes.webhook_config.payment_integration || "padrao"
              });
            }
          } catch (parseError) {
            console.error("Erro ao analisar configuração de webhook:", parseError);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar configuração de webhook:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (field: keyof WebhookConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSecretKey = () => {
    // Gera uma chave aleatória de 32 caracteres
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    handleChange("secretKey", result);
    toast.success("Chave secreta gerada com sucesso!");
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error("Erro ao copiar para a área de transferência"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('transacoes')
        .update({ 
          notas: JSON.stringify({
            webhook_config: {
              webhook_url: config.webhookUrl,
              secret_key: config.secretKey,
              is_active: config.isActive,
              payment_integration: config.paymentIntegration,
              updated_at: new Date().toISOString()
            }
          })
        })
        .eq('id_negocio', "1")
        .limit(1);

      if (error) throw error;

      toast.success("Configurações de webhook salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações de webhook:", error);
      toast.error("Erro ao salvar configurações. Verifique os logs para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  // URL do webhook para notificações externas
  const notificationUrl = `${window.location.origin}/api/webhooks/payment-notification`;

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
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">URL do Webhook</Label>
            <Input
              id="webhookUrl"
              value={config.webhookUrl}
              onChange={(e) => handleChange("webhookUrl", e.target.value)}
              placeholder="https://seu-portal.com/api/webhook"
            />
            <p className="text-sm text-muted-foreground">
              URL para onde enviaremos requisições quando houver novos pagamentos
            </p>
          </div>

          <div className="space-y-2">
            <Label>URL para onde enviaremos notificações de pagamentos e eventos</Label>
            <div className="flex items-center gap-2">
              <Input
                value={notificationUrl}
                readOnly
                className="bg-muted"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(notificationUrl, "URL de notificação copiada!")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure esta URL no seu sistema de pagamentos para receber notificações
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey">Chave Secreta</Label>
            <div className="flex gap-2">
              <Input
                id="secretKey"
                type="password"
                value={config.secretKey}
                onChange={(e) => handleChange("secretKey", e.target.value)}
                placeholder="Chave secreta para assinar as requisições"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={generateSecretKey}
              >
                Gerar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Uma chave secreta para verificar a autenticidade das requisições
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentIntegration">Integração de Pagamento</Label>
            <Select 
              value={config.paymentIntegration} 
              onValueChange={(value) => handleChange("paymentIntegration", value)}
            >
              <SelectTrigger id="paymentIntegration">
                <SelectValue placeholder="Selecione a integração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Usar integração padrão</SelectItem>
                <SelectItem value="efi_bank">Efi Bank</SelectItem>
                <SelectItem value="custom">Personalizada</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Selecione qual integração usar para processar pagamentos via webhook
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="active"
              checked={config.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
            <Label htmlFor="active">Ativar Webhook</Label>
            <p className="text-sm text-muted-foreground ml-2">
              Ative para começar a receber notificações
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Importante</p>
              <p className="text-sm text-blue-700">
                Você precisará configurar seu sistema para receber as notificações de webhook.{" "}
                <a href="#" className="text-blue-600 underline hover:text-blue-800">
                  Ver documentação
                </a>
              </p>
            </div>
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
