
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";
import { cn } from "@/lib/utils";

export const AppointmentsTab = () => {
  const { 
    requireConfirmation, 
    minAdvanceTime, 
    maxFutureDays, 
    remoteQueueEnabled, 
    remoteQueueLimit,
    cancellationPolicy,
    allowSimultaneousBookings,
    requireManualConfirmation,
    blockNoShowClients,
    sendEmailConfirmation,
    sendReminders,
    reminderTimeHours,
    sendAfterServiceMessage,
    afterServiceMessageHours,
    cancellationPolicyHours,
    noShowFee,
    cancellationMessage,
    saving,
    saveConfig 
  } = useBusinessConfig();
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado local para todos os campos de configuração
  const [localRequireConfirmation, setLocalRequireConfirmation] = useState(requireConfirmation);
  const [localMinAdvanceTime, setLocalMinAdvanceTime] = useState(minAdvanceTime);
  const [localMaxFutureDays, setLocalMaxFutureDays] = useState(maxFutureDays);
  const [localRemoteQueueEnabled, setLocalRemoteQueueEnabled] = useState(remoteQueueEnabled);
  const [localRemoteQueueLimit, setLocalRemoteQueueLimit] = useState(remoteQueueLimit);
  const [localCancellationPolicy, setLocalCancellationPolicy] = useState(cancellationPolicy);

  // Estados locais para os novos campos
  const [localAllowSimultaneousBookings, setLocalAllowSimultaneousBookings] = useState(allowSimultaneousBookings);
  const [localRequireManualConfirmation, setLocalRequireManualConfirmation] = useState(requireManualConfirmation);
  const [localBlockNoShowClients, setLocalBlockNoShowClients] = useState(blockNoShowClients);
  const [localSendEmailConfirmation, setLocalSendEmailConfirmation] = useState(sendEmailConfirmation);
  const [localSendReminders, setLocalSendReminders] = useState(sendReminders);
  const [localReminderTimeHours, setLocalReminderTimeHours] = useState(reminderTimeHours);
  const [localSendAfterServiceMessage, setLocalSendAfterServiceMessage] = useState(sendAfterServiceMessage);
  const [localAfterServiceMessageHours, setLocalAfterServiceMessageHours] = useState(afterServiceMessageHours);
  const [localCancellationPolicyHours, setLocalCancellationPolicyHours] = useState(cancellationPolicyHours);
  const [localNoShowFee, setLocalNoShowFee] = useState(noShowFee);
  const [localCancellationMessage, setLocalCancellationMessage] = useState(cancellationMessage);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição, restaurar valores originais
      setLocalRequireConfirmation(requireConfirmation);
      setLocalMinAdvanceTime(minAdvanceTime);
      setLocalMaxFutureDays(maxFutureDays);
      setLocalRemoteQueueEnabled(remoteQueueEnabled);
      setLocalRemoteQueueLimit(remoteQueueLimit);
      setLocalCancellationPolicy(cancellationPolicy);
      
      // Restaurar valores dos novos campos
      setLocalAllowSimultaneousBookings(allowSimultaneousBookings);
      setLocalRequireManualConfirmation(requireManualConfirmation);
      setLocalBlockNoShowClients(blockNoShowClients);
      setLocalSendEmailConfirmation(sendEmailConfirmation);
      setLocalSendReminders(sendReminders);
      setLocalReminderTimeHours(reminderTimeHours);
      setLocalSendAfterServiceMessage(sendAfterServiceMessage);
      setLocalAfterServiceMessageHours(afterServiceMessageHours);
      setLocalCancellationPolicyHours(cancellationPolicyHours);
      setLocalNoShowFee(noShowFee);
      setLocalCancellationMessage(cancellationMessage);
    }
    setIsEditing(!isEditing);
  };
  
  const handleSaveChanges = async () => {
    try {
      const success = await saveConfig({
        requireConfirmation: localRequireConfirmation,
        minAdvanceTime: localMinAdvanceTime,
        maxFutureDays: localMaxFutureDays,
        remoteQueueEnabled: localRemoteQueueEnabled,
        remoteQueueLimit: localRemoteQueueLimit,
        cancellationPolicy: localCancellationPolicy,
        
        // Novos campos
        allowSimultaneousBookings: localAllowSimultaneousBookings,
        requireManualConfirmation: localRequireManualConfirmation,
        blockNoShowClients: localBlockNoShowClients,
        sendEmailConfirmation: localSendEmailConfirmation,
        sendReminders: localSendReminders,
        reminderTimeHours: localReminderTimeHours,
        sendAfterServiceMessage: localSendAfterServiceMessage,
        afterServiceMessageHours: localAfterServiceMessageHours,
        cancellationPolicyHours: localCancellationPolicyHours,
        noShowFee: localNoShowFee,
        cancellationMessage: localCancellationMessage
      });
      
      if (success) {
        toast.success("Configurações de agendamentos salvas com sucesso");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações de agendamentos");
    }
  };

  const SettingRow = ({
    title, 
    description, 
    children
  }: { 
    title: string, 
    description?: string, 
    children: React.ReactNode 
  }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pb-4">
      <div className="space-y-0.5">
        <h4 className="text-sm font-medium">{title}</h4>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn(
        "flex items-center space-x-2",
        description ? "sm:w-1/3" : "sm:w-1/4"
      )}>
        {children}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Configurações de Agendamentos</h2>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={handleEditToggle}
        >
          {isEditing ? "Cancelar" : "Editar Configurações"}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Regras de Agendamento</CardTitle>
          <CardDescription>
            Configure as regras básicas para agendamentos de serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <SettingRow
              title="Permitir Agendamentos Simultâneos"
              description="Permitir que o cliente agende mais de um serviço ao mesmo tempo"
            >
              <Switch 
                checked={localAllowSimultaneousBookings}
                onCheckedChange={setLocalAllowSimultaneousBookings}
                disabled={!isEditing}
              />
            </SettingRow>
            
            <SettingRow
              title="Confirmação Manual de Agendamentos"
              description="Novos agendamentos precisam ser confirmados pela equipe"
            >
              <Switch 
                checked={localRequireManualConfirmation}
                onCheckedChange={setLocalRequireManualConfirmation}
                disabled={!isEditing}
              />
            </SettingRow>
            
            <SettingRow
              title="Pagamento Antecipado Obrigatório"
              description="Se habilitado, o cliente deverá realizar o pagamento para confirmar o agendamento"
            >
              <Switch 
                checked={localRequireConfirmation}
                onCheckedChange={setLocalRequireConfirmation}
                disabled={!isEditing}
              />
            </SettingRow>
            
            <SettingRow
              title="Bloquear Clientes Faltantes"
              description="Impedir novos agendamentos de clientes que não compareceram anteriormente"
            >
              <Switch 
                checked={localBlockNoShowClients}
                onCheckedChange={setLocalBlockNoShowClients}
                disabled={!isEditing}
              />
            </SettingRow>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <SettingRow
              title="Fila Remota"
              description="Permitir que clientes entrem na fila remotamente"
            >
              <Switch 
                checked={localRemoteQueueEnabled}
                onCheckedChange={setLocalRemoteQueueEnabled}
                disabled={!isEditing}
              />
            </SettingRow>
            
            {localRemoteQueueEnabled && (
              <SettingRow
                title="Limite da Fila"
                description="Máximo de pessoas que podem entrar na fila remota"
              >
                <Input 
                  type="number" 
                  value={localRemoteQueueLimit}
                  onChange={(e) => setLocalRemoteQueueLimit(parseInt(e.target.value) || 10)}
                  min={1}
                  max={100}
                  disabled={!isEditing}
                  className="w-24"
                />
              </SettingRow>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <SettingRow
              title="Antecedência Mínima (minutos)"
              description="Tempo mínimo antes do horário para realizar um agendamento"
            >
              <Select 
                value={localMinAdvanceTime.toString()} 
                onValueChange={(value) => setLocalMinAdvanceTime(parseInt(value))}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem antecedência mínima</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="240">4 horas</SelectItem>
                  <SelectItem value="480">8 horas</SelectItem>
                  <SelectItem value="1440">1 dia</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            
            <SettingRow
              title="Máximo de Dias para Agendar"
              description="Quantos dias no futuro os clientes podem agendar"
            >
              <Input 
                type="number"
                value={localMaxFutureDays}
                onChange={(e) => setLocalMaxFutureDays(parseInt(e.target.value) || 30)}
                min={1}
                max={365}
                disabled={!isEditing}
                className="w-24"
              />
            </SettingRow>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Lembretes e Comunicação</CardTitle>
          <CardDescription>
            Configure os lembretes e mensagens para os clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <SettingRow
              title="Enviar Email de Confirmação"
              description="Enviar email automático confirmando um novo agendamento"
            >
              <Switch 
                checked={localSendEmailConfirmation}
                onCheckedChange={setLocalSendEmailConfirmation}
                disabled={!isEditing}
              />
            </SettingRow>
            
            <SettingRow
              title="Enviar Lembretes de Agendamento"
              description="Enviar lembretes automáticos antes do agendamento"
            >
              <Switch 
                checked={localSendReminders}
                onCheckedChange={setLocalSendReminders}
                disabled={!isEditing}
              />
            </SettingRow>
            
            {localSendReminders && (
              <SettingRow
                title="Tempo do Lembrete (horas)"
                description="Quantas horas antes do agendamento enviar o lembrete"
              >
                <Select 
                  value={localReminderTimeHours.toString()} 
                  onValueChange={(value) => setLocalReminderTimeHours(parseInt(value))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora antes</SelectItem>
                    <SelectItem value="2">2 horas antes</SelectItem>
                    <SelectItem value="4">4 horas antes</SelectItem>
                    <SelectItem value="12">12 horas antes</SelectItem>
                    <SelectItem value="24">24 horas antes</SelectItem>
                    <SelectItem value="48">2 dias antes</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            )}
            
            <SettingRow
              title="Enviar Mensagem Pós-Atendimento"
              description="Enviar mensagem após o serviço para coletar feedback do cliente"
            >
              <Switch 
                checked={localSendAfterServiceMessage}
                onCheckedChange={setLocalSendAfterServiceMessage}
                disabled={!isEditing}
              />
            </SettingRow>
            
            {localSendAfterServiceMessage && (
              <SettingRow
                title="Tempo da Mensagem (horas)"
                description="Quantas horas após o serviço enviar a mensagem de feedback"
              >
                <Select 
                  value={localAfterServiceMessageHours.toString()} 
                  onValueChange={(value) => setLocalAfterServiceMessageHours(parseInt(value))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora depois</SelectItem>
                    <SelectItem value="2">2 horas depois</SelectItem>
                    <SelectItem value="4">4 horas depois</SelectItem>
                    <SelectItem value="12">12 horas depois</SelectItem>
                    <SelectItem value="24">24 horas depois</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Política de Cancelamento</CardTitle>
          <CardDescription>
            Configure as regras para cancelamento de agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <SettingRow
              title="Tempo Limite para Cancelamento"
              description="Até quantas horas antes do agendamento o cliente pode cancelar"
            >
              <Select 
                value={localCancellationPolicyHours.toString()} 
                onValueChange={(value) => setLocalCancellationPolicyHours(parseInt(value))}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                  <SelectItem value="12">12 horas</SelectItem>
                  <SelectItem value="24">24 horas</SelectItem>
                  <SelectItem value="48">48 horas</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            
            <SettingRow
              title="Taxa por Não Comparecimento"
              description="Valor a ser cobrado quando o cliente não comparece (R$)"
            >
              <Input 
                type="number"
                value={localNoShowFee}
                onChange={(e) => setLocalNoShowFee(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                disabled={!isEditing}
                className="w-24"
              />
            </SettingRow>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="cancellation-policy">Política de Cancelamento</Label>
              <FormControl>
                <Textarea 
                  id="cancellation-policy"
                  value={localCancellationPolicy}
                  onChange={(e) => setLocalCancellationPolicy(e.target.value)}
                  rows={3}
                  disabled={!isEditing}
                  placeholder="Descreva sua política de cancelamento..."
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Esta política será exibida para os clientes durante o agendamento
              </p>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="cancellation-message">Mensagem de Cancelamento</Label>
              <FormControl>
                <Textarea 
                  id="cancellation-message"
                  value={localCancellationMessage}
                  onChange={(e) => setLocalCancellationMessage(e.target.value)}
                  rows={3}
                  disabled={!isEditing}
                  placeholder="Mensagem exibida quando um agendamento é cancelado..."
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Esta mensagem será exibida quando um cliente cancelar seu agendamento
              </p>
            </div>
          </div>
        </CardContent>
        
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleEditToggle}>Cancelar</Button>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
