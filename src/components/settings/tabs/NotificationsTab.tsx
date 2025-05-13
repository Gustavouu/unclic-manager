
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const NotificationsTab = () => {
  const [emailNotifications, setEmailNotifications] = React.useState({
    appointments: true,
    marketing: false,
    system: true
  });
  
  const [pushNotifications, setPushNotifications] = React.useState({
    appointments: true,
    reviews: true,
    system: true
  });
  
  const handleEmailChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key]
    });
  };
  
  const handlePushChange = (key: keyof typeof pushNotifications) => {
    setPushNotifications({
      ...pushNotifications,
      [key]: !pushNotifications[key]
    });
  };
  
  const saveChanges = () => {
    toast.success("Preferências de notificação salvas!");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferências de Notificação</h3>
        <p className="text-sm text-muted-foreground">
          Controle quais notificações você deseja receber.
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Notificações por Email</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-appointments" className="flex-1">
              Agendamentos
              <p className="text-sm text-muted-foreground">
                Receba emails sobre novos agendamentos, cancelamentos e lembretes.
              </p>
            </Label>
            <Switch 
              id="email-appointments"
              checked={emailNotifications.appointments}
              onCheckedChange={() => handleEmailChange('appointments')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-marketing" className="flex-1">
              Marketing
              <p className="text-sm text-muted-foreground">
                Receba emails sobre promoções, novidades e dicas para seu negócio.
              </p>
            </Label>
            <Switch 
              id="email-marketing"
              checked={emailNotifications.marketing}
              onCheckedChange={() => handleEmailChange('marketing')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-system" className="flex-1">
              Sistema
              <p className="text-sm text-muted-foreground">
                Receba emails sobre atualizações do sistema e informações importantes.
              </p>
            </Label>
            <Switch 
              id="email-system"
              checked={emailNotifications.system}
              onCheckedChange={() => handleEmailChange('system')}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t space-y-4">
        <h4 className="text-sm font-medium">Notificações Push</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-appointments" className="flex-1">
              Agendamentos
              <p className="text-sm text-muted-foreground">
                Receba notificações sobre novos agendamentos e alterações.
              </p>
            </Label>
            <Switch 
              id="push-appointments"
              checked={pushNotifications.appointments}
              onCheckedChange={() => handlePushChange('appointments')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-reviews" className="flex-1">
              Avaliações
              <p className="text-sm text-muted-foreground">
                Seja notificado quando receber novas avaliações de clientes.
              </p>
            </Label>
            <Switch 
              id="push-reviews"
              checked={pushNotifications.reviews}
              onCheckedChange={() => handlePushChange('reviews')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-system" className="flex-1">
              Sistema
              <p className="text-sm text-muted-foreground">
                Receba notificações sobre eventos do sistema.
              </p>
            </Label>
            <Switch 
              id="push-system"
              checked={pushNotifications.system}
              onCheckedChange={() => handlePushChange('system')}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={saveChanges}>
        Salvar Preferências
      </Button>
    </div>
  );
};

export default NotificationsTab;
