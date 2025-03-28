
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface WebhookActiveToggleProps {
  isActive: boolean;
  onChange: (checked: boolean) => void;
}

export function WebhookActiveToggle({ isActive, onChange }: WebhookActiveToggleProps) {
  return (
    <div className="flex items-center space-x-2 pt-2">
      <Switch
        id="active"
        checked={isActive}
        onCheckedChange={onChange}
      />
      <Label htmlFor="active">Ativar Webhook</Label>
      <p className="text-sm text-muted-foreground ml-2">
        Ative para começar a receber notificações
      </p>
    </div>
  );
}
