
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Smartphone, Mail, MessageSquare } from "lucide-react";

export const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
        <CardDescription>
          Gerencie como e quando você recebe notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificações do Sistema</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas no celular</p>
                  </div>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas por email</p>
                  </div>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas por SMS</p>
                  </div>
                </div>
                <Switch id="sms-notifications" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificações de Clientes</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-appointment">Novos Agendamentos</Label>
                  <p className="text-sm text-muted-foreground">Quando um cliente faz um novo agendamento</p>
                </div>
                <Switch id="new-appointment" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appointment-cancel">Cancelamentos</Label>
                  <p className="text-sm text-muted-foreground">Quando um cliente cancela um agendamento</p>
                </div>
                <Switch id="appointment-cancel" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="client-feedback">Avaliações</Label>
                  <p className="text-sm text-muted-foreground">Quando um cliente deixa uma avaliação</p>
                </div>
                <Switch id="client-feedback" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Horários de Notificações</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet-hours-start">Início do Horário Silencioso</Label>
              <Select defaultValue="22">
                <SelectTrigger id="quiet-hours-start">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20:00</SelectItem>
                  <SelectItem value="21">21:00</SelectItem>
                  <SelectItem value="22">22:00</SelectItem>
                  <SelectItem value="23">23:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiet-hours-end">Fim do Horário Silencioso</Label>
              <Select defaultValue="8">
                <SelectTrigger id="quiet-hours-end">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">06:00</SelectItem>
                  <SelectItem value="7">07:00</SelectItem>
                  <SelectItem value="8">08:00</SelectItem>
                  <SelectItem value="9">09:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-template">Modelo de Mensagem</Label>
            <Textarea 
              id="notification-template" 
              placeholder="Modelo padrão para notificações de SMS/Email"
              defaultValue="Olá {cliente}, lembramos do seu agendamento em {data} às {hora}. Confirme com antecedência. Atenciosamente, {negócio}."
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
};
