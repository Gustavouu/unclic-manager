
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const AppointmentsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Agendamentos</CardTitle>
        <CardDescription>
          Configure as regras e políticas para agendamentos de serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Regras de Agendamento</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-multiple">Permitir agendamentos simultâneos</Label>
                  <p className="text-sm text-muted-foreground">
                    Clientes podem agendar mais de um serviço ao mesmo tempo
                  </p>
                </div>
                <Switch id="allow-multiple" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-confirmation">Confirmação manual de agendamentos</Label>
                  <p className="text-sm text-muted-foreground">
                    Agendamentos precisam ser confirmados pela equipe
                  </p>
                </div>
                <Switch id="require-confirmation" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="block-no-shows">Bloquear clientes faltantes</Label>
                  <p className="text-sm text-muted-foreground">
                    Impedir novos agendamentos de clientes que faltaram
                  </p>
                </div>
                <Switch id="block-no-shows" />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="max-future-days">Limite de dias para agendamento futuro</Label>
                <p className="text-sm text-muted-foreground">
                  Quantos dias no futuro os clientes podem agendar
                </p>
                <Select defaultValue="30">
                  <SelectTrigger id="max-future-days">
                    <SelectValue placeholder="Selecione o limite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lembretes e Confirmações</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="send-confirmation">Enviar confirmação</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar email de confirmação após agendamento
                  </p>
                </div>
                <Switch id="send-confirmation" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="send-reminder">Enviar lembretes</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes antes do agendamento
                  </p>
                </div>
                <Switch id="send-reminder" defaultChecked />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="reminder-time">Tempo do lembrete</Label>
                <p className="text-sm text-muted-foreground">
                  Quando enviar o lembrete antes do agendamento
                </p>
                <Select defaultValue="24">
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Selecione o tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora antes</SelectItem>
                    <SelectItem value="2">2 horas antes</SelectItem>
                    <SelectItem value="12">12 horas antes</SelectItem>
                    <SelectItem value="24">24 horas antes</SelectItem>
                    <SelectItem value="48">48 horas antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="follow-up">Mensagem pós-atendimento</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar mensagem após o serviço para feedback
                </p>
                <Select defaultValue="2">
                  <SelectTrigger id="follow-up">
                    <SelectValue placeholder="Selecione o tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não enviar</SelectItem>
                    <SelectItem value="1">1 hora depois</SelectItem>
                    <SelectItem value="2">2 horas depois</SelectItem>
                    <SelectItem value="24">24 horas depois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Políticas de Cancelamento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cancellation-policy">Política de cancelamento</Label>
              <Select defaultValue="24">
                <SelectTrigger id="cancellation-policy">
                  <SelectValue placeholder="Selecione a política" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Cancelamento a qualquer momento</SelectItem>
                  <SelectItem value="2">Até 2 horas antes</SelectItem>
                  <SelectItem value="12">Até 12 horas antes</SelectItem>
                  <SelectItem value="24">Até 24 horas antes</SelectItem>
                  <SelectItem value="48">Até 48 horas antes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="no-show-fee">Taxa por não comparecimento</Label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                  <Input id="no-show-fee" type="number" className="pl-8" defaultValue="0" />
                </div>
                <span className="text-sm text-muted-foreground">ou</span>
                <div className="w-20">
                  <Input type="number" className="text-right" defaultValue="0" />
                </div>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cancellation-message">Mensagem de cancelamento</Label>
            <Textarea 
              id="cancellation-message" 
              placeholder="Mensagem exibida quando um agendamento é cancelado"
              defaultValue="Lamentamos informar que seu agendamento foi cancelado. Entre em contato conosco para mais informações."
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
