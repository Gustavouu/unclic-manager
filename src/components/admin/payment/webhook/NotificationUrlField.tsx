
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function NotificationUrlField() {
  // URL do webhook para notificações externas
  const notificationUrl = `${window.location.origin}/api/webhooks/payment-notification`;
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error("Erro ao copiar para a área de transferência"));
  };

  return (
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
  );
}
