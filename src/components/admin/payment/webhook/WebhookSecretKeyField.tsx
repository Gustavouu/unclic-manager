
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WebhookSecretKeyFieldProps {
  secretKey: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

export function WebhookSecretKeyField({ secretKey, onChange, onGenerate }: WebhookSecretKeyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="secretKey">Chave Secreta</Label>
      <div className="flex gap-2">
        <Input
          id="secretKey"
          type="password"
          value={secretKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Chave secreta para assinar as requisições"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={onGenerate}
        >
          Gerar
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Uma chave secreta para verificar a autenticidade das requisições
      </p>
    </div>
  );
}
