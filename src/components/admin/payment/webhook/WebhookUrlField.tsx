
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WebhookUrlFieldProps {
  webhookUrl: string;
  onChange: (value: string) => void;
}

export function WebhookUrlField({ webhookUrl, onChange }: WebhookUrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="webhookUrl">URL do Webhook</Label>
      <Input
        id="webhookUrl"
        value={webhookUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://seu-portal.com/api/webhook"
      />
      <p className="text-sm text-muted-foreground">
        URL para onde enviaremos requisições quando houver novos pagamentos
      </p>
    </div>
  );
}
