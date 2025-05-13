
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";
import { toast } from "sonner";

// Form schema for validating appointment settings
const appointmentSettingsSchema = z.object({
  allowSimultaneousBookings: z.boolean().default(true),
  requireManualConfirmation: z.boolean().default(false),
  blockNoShowClients: z.boolean().default(false),
  maxFutureDays: z.number().int().positive().default(30),
  sendEmailConfirmation: z.boolean().default(true),
  sendReminders: z.boolean().default(true),
  reminderTimeHours: z.number().int().positive().default(24),
  sendAfterServiceMessage: z.boolean().default(false),
  afterServiceMessageHours: z.number().int().positive().default(2),
  cancellationPolicyHours: z.number().int().nonnegative().default(24),
  noShowFee: z.number().nonnegative().default(0),
  cancellationMessage: z.string().default("O agendamento foi cancelado. Entre em contato conosco para mais informações.")
});

type AppointmentSettingsFormValues = z.infer<typeof appointmentSettingsSchema>;

export const AppointmentsTab = () => {
  const { 
    allowSimultaneousBookings,
    requireManualConfirmation,
    blockNoShowClients,
    maxFutureDays,
    sendEmailConfirmation,
    sendReminders,
    reminderTimeHours,
    sendAfterServiceMessage,
    afterServiceMessageHours,
    cancellationPolicyHours,
    noShowFee,
    cancellationMessage,
    loading,
    saving,
    saveConfig
  } = useBusinessConfig();

  const form = useForm<AppointmentSettingsFormValues>({
    resolver: zodResolver(appointmentSettingsSchema),
    defaultValues: {
      allowSimultaneousBookings: allowSimultaneousBookings || true,
      requireManualConfirmation: requireManualConfirmation || false,
      blockNoShowClients: blockNoShowClients || false,
      maxFutureDays: maxFutureDays || 30,
      sendEmailConfirmation: sendEmailConfirmation || true,
      sendReminders: sendReminders || true,
      reminderTimeHours: reminderTimeHours || 24,
      sendAfterServiceMessage: sendAfterServiceMessage || false,
      afterServiceMessageHours: afterServiceMessageHours || 2,
      cancellationPolicyHours: cancellationPolicyHours || 24,
      noShowFee: noShowFee || 0,
      cancellationMessage: cancellationMessage || "O agendamento foi cancelado. Entre em contato conosco para mais informações."
    },
  });

  // Update form values when business config is loaded
  React.useEffect(() => {
    if (!loading) {
      form.reset({
        allowSimultaneousBookings,
        requireManualConfirmation,
        blockNoShowClients,
        maxFutureDays,
        sendEmailConfirmation,
        sendReminders,
        reminderTimeHours,
        sendAfterServiceMessage,
        afterServiceMessageHours,
        cancellationPolicyHours,
        noShowFee,
        cancellationMessage
      });
    }
  }, [
    loading, 
    allowSimultaneousBookings,
    requireManualConfirmation,
    blockNoShowClients,
    maxFutureDays,
    sendEmailConfirmation,
    sendReminders,
    reminderTimeHours,
    sendAfterServiceMessage,
    afterServiceMessageHours,
    cancellationPolicyHours,
    noShowFee,
    cancellationMessage,
    form
  ]);

  const onSubmit = async (data: AppointmentSettingsFormValues) => {
    try {
      const success = await saveConfig(data);
      if (success) {
        toast.success("Configurações de agendamento salvas com sucesso");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações de agendamento:", error);
      toast.error("Erro ao salvar configurações de agendamento");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Agendamento</h3>
        <p className="text-sm text-muted-foreground">
          Configure como os agendamentos funcionarão em seu negócio.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Regras de Agendamento */}
          <Card>
            <CardHeader>
              <CardTitle>Regras de Agendamento</CardTitle>
              <CardDescription>
                Configure as regras básicas para os agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="allowSimultaneousBookings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Agendamentos Simultâneos</FormLabel>
                      <FormDescription>
                        Permitir que clientes agendem mais de um serviço ao mesmo tempo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requireManualConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Confirmação Manual</FormLabel>
                      <FormDescription>
                        Agendamentos precisam ser confirmados manualmente pela equipe
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blockNoShowClients"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bloqueio de Clientes Faltantes</FormLabel>
                      <FormDescription>
                        Bloquear automaticamente clientes que faltaram a agendamentos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxFutureDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de Dias para Agendamento Futuro</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de dias à frente que os clientes podem agendar
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Comunicação e Lembretes */}
          <Card>
            <CardHeader>
              <CardTitle>Comunicação e Lembretes</CardTitle>
              <CardDescription>
                Configure as notificações e lembretes para agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sendEmailConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Confirmação por Email</FormLabel>
                      <FormDescription>
                        Enviar email de confirmação após agendamento
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enviar Lembretes</FormLabel>
                      <FormDescription>
                        Enviar lembretes antes do horário agendado
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("sendReminders") && (
                <FormField
                  control={form.control}
                  name="reminderTimeHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Antecedência do Lembrete</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tempo de antecedência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 hora antes</SelectItem>
                          <SelectItem value="2">2 horas antes</SelectItem>
                          <SelectItem value="4">4 horas antes</SelectItem>
                          <SelectItem value="12">12 horas antes</SelectItem>
                          <SelectItem value="24">24 horas antes</SelectItem>
                          <SelectItem value="48">48 horas antes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Com quanto tempo de antecedência enviar o lembrete
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sendAfterServiceMessage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mensagem Pós-Atendimento</FormLabel>
                      <FormDescription>
                        Enviar mensagem após o serviço para solicitar feedback
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("sendAfterServiceMessage") && (
                <FormField
                  control={form.control}
                  name="afterServiceMessageHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Após Atendimento</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tempo após atendimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 hora depois</SelectItem>
                          <SelectItem value="2">2 horas depois</SelectItem>
                          <SelectItem value="4">4 horas depois</SelectItem>
                          <SelectItem value="12">12 horas depois</SelectItem>
                          <SelectItem value="24">24 horas depois</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Quanto tempo após o serviço enviar a mensagem
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Política de Cancelamento */}
          <Card>
            <CardHeader>
              <CardTitle>Política de Cancelamento</CardTitle>
              <CardDescription>
                Configure as políticas de cancelamento e taxas por não comparecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cancellationPolicyHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo para Cancelamento</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(Number(value))} 
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o prazo para cancelamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Sem restrição</SelectItem>
                        <SelectItem value="1">1 hora antes</SelectItem>
                        <SelectItem value="2">2 horas antes</SelectItem>
                        <SelectItem value="4">4 horas antes</SelectItem>
                        <SelectItem value="12">12 horas antes</SelectItem>
                        <SelectItem value="24">24 horas antes</SelectItem>
                        <SelectItem value="48">48 horas antes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Até quanto tempo antes o cliente pode cancelar o agendamento sem penalidade
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noShowFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa por Não Comparecimento (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor a ser cobrado quando o cliente não comparece (0 para não cobrar)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cancellationMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem de Cancelamento</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mensagem exibida quando um agendamento é cancelado"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Esta mensagem será exibida quando um agendamento for cancelado
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentsTab;
