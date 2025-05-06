
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Smartphone, Mail, MessageSquare, AlertCircle } from "lucide-react";
import { useNotificationSettings, NotificationSettings } from "@/hooks/useNotificationSettings";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  newAppointmentAlert: z.boolean(),
  cancelAppointmentAlert: z.boolean(),
  clientFeedbackAlert: z.boolean(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
  messageTemplate: z.string().min(10, "O modelo de mensagem deve ter pelo menos 10 caracteres")
});

export const NotificationsTab = () => {
  const { settings, loading, saving, saveSettings } = useNotificationSettings();
  
  const form = useForm<NotificationSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
    values: settings,
  });

  const onSubmit = async (data: NotificationSettings) => {
    await saveSettings(data);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Carregando configurações...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Notificações</CardTitle>
            <CardDescription>
              Gerencie como e quando você recebe notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!settings.emailEnabled && !settings.smsEnabled && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  Você desativou as notificações por email e SMS. Seus clientes não receberão lembretes automáticos.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações do Sistema</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pushEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-primary" />
                          <div>
                            <FormLabel>Notificações Push</FormLabel>
                            <FormDescription>Receber alertas no celular</FormDescription>
                          </div>
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
                    name="emailEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <FormLabel>Notificações por Email</FormLabel>
                            <FormDescription>Receber alertas por email</FormDescription>
                          </div>
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
                    name="smsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <div>
                            <FormLabel>Notificações por SMS</FormLabel>
                            <FormDescription>Receber alertas por SMS</FormDescription>
                          </div>
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
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações de Clientes</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newAppointmentAlert"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Novos Agendamentos</FormLabel>
                          <FormDescription>Quando um cliente faz um novo agendamento</FormDescription>
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
                    name="cancelAppointmentAlert"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Cancelamentos</FormLabel>
                          <FormDescription>Quando um cliente cancela um agendamento</FormDescription>
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
                    name="clientFeedbackAlert"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Avaliações</FormLabel>
                          <FormDescription>Quando um cliente deixa uma avaliação</FormDescription>
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
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Horários de Notificações</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quietHoursStart"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Início do Horário Silencioso</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="20">20:00</SelectItem>
                          <SelectItem value="21">21:00</SelectItem>
                          <SelectItem value="22">22:00</SelectItem>
                          <SelectItem value="23">23:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quietHoursEnd"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Fim do Horário Silencioso</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6">06:00</SelectItem>
                          <SelectItem value="7">07:00</SelectItem>
                          <SelectItem value="8">08:00</SelectItem>
                          <SelectItem value="9">09:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="messageTemplate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Modelo de Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Modelo padrão para notificações de SMS/Email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use {`{cliente}`}, {`{data}`}, {`{hora}`}, e {`{negócio}`} como variáveis para personalizar a mensagem.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => form.reset()}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
