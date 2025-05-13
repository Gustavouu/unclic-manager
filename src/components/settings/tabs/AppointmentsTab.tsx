
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";

export const AppointmentsTab = () => {
  const { 
    requireConfirmation, 
    minAdvanceTime, 
    maxFutureDays, 
    remoteQueueEnabled, 
    remoteQueueLimit,
    cancellationPolicy,
    saving,
    saveConfig 
  } = useBusinessConfig();
  
  const [isEditing, setIsEditing] = useState(false);
  const [localRequireConfirmation, setLocalRequireConfirmation] = useState(requireConfirmation);
  const [localMinAdvanceTime, setLocalMinAdvanceTime] = useState(minAdvanceTime);
  const [localMaxFutureDays, setLocalMaxFutureDays] = useState(maxFutureDays);
  const [localRemoteQueueEnabled, setLocalRemoteQueueEnabled] = useState(remoteQueueEnabled);
  const [localRemoteQueueLimit, setLocalRemoteQueueLimit] = useState(remoteQueueLimit);
  const [localCancellationPolicy, setLocalCancellationPolicy] = useState(cancellationPolicy);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição, restaurar valores originais
      setLocalRequireConfirmation(requireConfirmation);
      setLocalMinAdvanceTime(minAdvanceTime);
      setLocalMaxFutureDays(maxFutureDays);
      setLocalRemoteQueueEnabled(remoteQueueEnabled);
      setLocalRemoteQueueLimit(remoteQueueLimit);
      setLocalCancellationPolicy(cancellationPolicy);
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
        cancellationPolicy: localCancellationPolicy
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
            Configure as regras para agendamentos de serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="require-confirmation">Pagamento Antecipado Obrigatório</Label>
                <Switch 
                  id="require-confirmation" 
                  checked={localRequireConfirmation}
                  onCheckedChange={setLocalRequireConfirmation}
                  disabled={!isEditing}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Se habilitado, o cliente deverá realizar o pagamento para confirmar o agendamento
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="remote-queue">Permitir Fila Remota</Label>
                <Switch 
                  id="remote-queue" 
                  checked={localRemoteQueueEnabled}
                  onCheckedChange={setLocalRemoteQueueEnabled}
                  disabled={!isEditing}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Se habilitado, clientes podem entrar na fila remotamente
              </p>
              
              {localRemoteQueueEnabled && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="queue-limit">Limite da Fila</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="queue-limit"
                      min={1}
                      max={50}
                      step={1}
                      value={[localRemoteQueueLimit]}
                      onValueChange={(value) => setLocalRemoteQueueLimit(value[0])}
                      disabled={!isEditing}
                      className="flex-grow"
                    />
                    <div className="w-12 text-center">{localRemoteQueueLimit}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min-advance-time">Antecedência Mínima (minutos)</Label>
              <Select 
                value={localMinAdvanceTime.toString()} 
                onValueChange={(value) => setLocalMinAdvanceTime(parseInt(value))}
                disabled={!isEditing}
              >
                <SelectTrigger>
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
              <p className="text-sm text-muted-foreground">
                Tempo mínimo antes do horário para realizar um agendamento
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-future-days">Máximo de Dias para Agendar</Label>
              <Input 
                type="number"
                id="max-future-days"
                value={localMaxFutureDays}
                onChange={(e) => setLocalMaxFutureDays(parseInt(e.target.value) || 30)}
                min={1}
                max={365}
                disabled={!isEditing}
              />
              <p className="text-sm text-muted-foreground">
                Quantos dias no futuro os clientes podem agendar
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="cancellation-policy">Política de Cancelamento</Label>
            <FormControl>
              <Textarea 
                id="cancellation-policy"
                value={localCancellationPolicy}
                onChange={(e) => setLocalCancellationPolicy(e.target.value)}
                rows={4}
                disabled={!isEditing}
                placeholder="Descreva sua política de cancelamento..."
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              Esta política será exibida para os clientes durante o agendamento
            </p>
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
