import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Clock, MessageSquare } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotificationSettings, NotificationSettings } from "@/hooks/useNotificationSettings";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  push_enabled: z.boolean().default(true),
  email_enabled: z.boolean().default(true),
  sms_enabled: z.boolean().default(false),
  new_appointment_alert: z.boolean().default(true),
  cancel_appointment_alert: z.boolean().default(true),
  client_feedback_alert: z.boolean().default(true),
  quiet_hours_start: z.string().min(1, "Horário inicial obrigatório"),
  quiet_hours_end: z.string().min(1, "Horário final obrigatório"),
  message_template: z.string().min(10, "Modelo de mensagem deve ter pelo menos 10 caracteres"),
});

const NotificationsTab = () => {
  const { settings, loading, saving, saveSettings } = useNotificationSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      push_enabled: settings.push_enabled,
      email_enabled: settings.email_enabled,
      sms_enabled: settings.sms_enabled,
      new_appointment_alert: settings.new_appointment_alert,
      cancel_appointment_alert: settings.cancel_appointment_alert,
      client_feedback_alert: settings.client_feedback_alert,
      quiet_hours_start: settings.quiet_hours_start,
      quiet_hours_end: settings.quiet_hours_end,
      message_template: settings.message_template,
    },
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (!loading && settings) {
      form.reset({
        push_enabled: settings.push_enabled,
        email_enabled: settings.email_enabled,
        sms_enabled: settings.sms_enabled,
        new_appointment_alert: settings.new_appointment_alert,
        cancel_appointment_alert: settings.cancel_appointment_alert,
        client_feedback_alert: settings.client_feedback_alert,
        quiet_hours_start: settings.quiet_hours_start,
        quiet_hours_end: settings.quiet_hours_end,
        message_template: settings.message_template,
      });
    }
  }, [loading, settings, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData: NotificationSettings = {
        push_enabled: data.push_enabled,
        email_enabled: data.email_enabled,
        sms_enabled: data.sms_enabled,
        new_appointment_alert: data.new_appointment_alert,
        cancel_appointment_alert: data.cancel_appointment_alert,
        client_feedback_alert: data.client_feedback_alert,
        quiet_hours_start: data.quiet_hours_start,
        quiet_hours_end: data.quiet_hours_end,
        message_template: data.message_template
      };
      
      await saveSettings(formData);
      toast.success("Configurações de notificação salvas com sucesso!");
    } catch (error) {
      console.error("Error saving notification settings", error);
      toast.error("Erro ao salvar configurações de notificação");
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
        <h3 className="text-lg font-medium">Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Configure como e quando seus clientes e funcionários receberão notificações.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Notificação</CardTitle>
              <CardDescription>
                Escolha quais canais de notificação estarão ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="push_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notificações Push</FormLabel>
                      <FormDescription>
                        Envie notificações push para o navegador dos usuários
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
                name="email_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notificações por Email</FormLabel>
                      <FormDescription>
                        Envie notificações via email para clientes e funcionários
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
                name="sms_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notificações por SMS</FormLabel>
                      <FormDescription>
                        Envie notificações via SMS para clientes e funcionários
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    {field.value && (
                      <Alert variant="default" className="mt-2">
                        <AlertDescription>
                          O serviço de SMS requer configurações adicionais e pode ter custos extras.
                        </AlertDescription>
                      </Alert>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Alertas</CardTitle>
              <CardDescription>
                Configure quais tipos de eventos gerarão notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="new_appointment_alert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Novos Agendamentos</FormLabel>
                      <FormDescription>
                        Notificar quando um novo agendamento for criado
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
                name="cancel_appointment_alert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Cancelamentos</FormLabel>
                      <FormDescription>
                        Notificar quando um agendamento for cancelado
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
                name="client_feedback_alert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Feedback de Clientes</FormLabel>
                      <FormDescription>
                        Notificar quando um cliente deixar uma avaliação
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários Silenciosos</CardTitle>
              <CardDescription>
                Configure horários em que as notificações não serão enviadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quiet_hours_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início do Período Silencioso</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quiet_hours_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim do Período Silencioso</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modelo de Mensagem</CardTitle>
              <CardDescription>
                Configure o modelo de mensagem para lembretes de agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="message_template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem padrão</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o modelo de mensagem..."
                        className="resize-none min-h-[120px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Use as variáveis {"{cliente}"}, {"{negócio}"}, {"{data}"}, {"{hora}"} para personalizar a mensagem.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar configurações'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotificationsTab;
