
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WebhookIntegrationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function WebhookIntegrationSelect({ value, onChange }: WebhookIntegrationSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="paymentIntegration">Integração de Pagamento</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
  );
}
