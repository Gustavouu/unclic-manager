import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { appointmentFormSchema, AppointmentFormValues } from "../schemas/appointmentFormSchema";
import type { AppointmentFormValues as AppointmentFormValuesType } from "../schemas/appointmentFormSchema";
import { ClientSelect } from "./ClientSelect";
import { ServiceSelect } from "./ServiceSelect";
import { ProfessionalSelect } from "./ProfessionalSelect";
import { DateTimeSelect } from "./DateTimeSelect";
import { NotesField } from "./NotesField";
import { StatusSelect } from "./StatusSelect";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { NotificationsOptions } from "./NotificationsOptions";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { useAppointmentConflicts } from "@/hooks/appointments/useAppointmentConflicts";
import { useAuth } from "@/hooks/useAuth";
import { useUserPermissions } from "@/hooks/auth/useUserPermissions";
import { format, addMinutes, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { NewClientDialog } from "@/components/clients/NewClientDialog";
import { NewServiceDialog } from "@/components/services/NewServiceDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentStatus } from "../types";
import { CreateAppointmentData } from "@/hooks/appointments/types";

type AppointmentStepperFormProps = {
  onClose: () => void;
};

// Define etapas do formulário
const STEPS = [
  { id: 0, label: "Cliente" },
  { id: 1, label: "Serviço e Profissional" },
  { id: 2, label: "Data e Hora" },
  { id: 3, label: "Confirmação" },
];

interface NotificationsData {
  sendConfirmation: boolean;
  sendReminder: boolean;
}

interface ServiceData {
  serviceId: string;
  duration: number;
  price: number;
}

interface AdditionalServiceData {
  serviceId: string;
  duration: number;
  price: number;
}

interface ConflictCheckParams {
  date: Date;
  duration: number;
}

export const AppointmentStepperForm = ({ onClose }: AppointmentStepperFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { user } = useAuth();
  const { canCreateService, isAdmin, isProfessional } = useUserPermissions();
  const { appointments, createAppointment, fetchAppointments } = useAppointments();
  const { validateAppointmentTime } = useAppointmentConflicts(appointments);
  const { 
    businessHours,
    bufferTime,
    minAdvanceTime,
    maxFutureDays,
    requireConfirmation 
  } = useBusinessConfig();

  // Detecta o tamanho da tela para otimizar a experiência em dispositivos móveis
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verifica o tamanho da tela inicialmente
    checkScreenSize();
    
    // Adiciona um listener para mudanças no tamanho da tela
    window.addEventListener('resize', checkScreenSize);
    
    // Limpa o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
      status: "pendente" as AppointmentStatus,
      paymentMethod: "local",
      notifications: {
        sendConfirmation: true,
        sendReminder: true,
      },
      isEmergency: false,
      additionalServices: [],
    },
    mode: "onChange",
  });
  
  const watchedFields = form.watch();
  
  // Observa mudanças nos campos de data e hora
  const dateTime = useWatch({
    control: form.control,
    name: ["date", "time"],
  });

  // Verifica se o horário está dentro do horário de funcionamento
  const isWithinBusinessHours = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE', { locale: ptBR }).toLowerCase();
    const hours = businessHours[dayOfWeek];
    
    if (!hours || !hours.enabled) return false;
    
    const timeStr = format(date, 'HH:mm');
    return isWithinInterval(date, {
      start: new Date(`${format(date, 'yyyy-MM-dd')}T${hours.start}`),
      end: new Date(`${format(date, 'yyyy-MM-dd')}T${hours.end}`)
    });
  };
  
  // Verifica conflitos quando seleciona data e hora
  const checkTimeConflicts = useCallback(() => {
    try {
      const { date, time, professionalId, serviceId } = form.getValues();
      
      if (!date || !time || !professionalId || !serviceId) {
        return false;
      }
      
      const appointmentDate = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      if (!isWithinBusinessHours(appointmentDate)) {
        setValidationError("O horário selecionado está fora do horário de funcionamento");
        return false;
      }
      
      const now = new Date();
      const minTime = addMinutes(now, minAdvanceTime);
      if (!isEmergency && appointmentDate < minTime) {
        setValidationError(`Agendamentos devem ter no mínimo ${minAdvanceTime} minutos de antecedência.`);
        return false;
      }
      
      // Passa os parâmetros corretos para validateAppointmentTime
      const hasConflict = validateAppointmentTime({
        date: appointmentDate,
        duration: selectedServices[0]?.duration || 30
      });
      
      if (hasConflict) {
        setValidationError("Existe um conflito de horário com outro agendamento");
        return false;
      }
      
      setValidationError(null);
      return true;
    } catch (error) {
      console.error("Erro ao verificar conflitos:", error);
      setValidationError("Erro ao verificar disponibilidade do horário");
      return false;
    }
  }, [form, isEmergency, minAdvanceTime, validateAppointmentTime, isWithinBusinessHours, selectedServices]);

  // Busca detalhes do serviço selecionado
  const fetchServiceDetails = useCallback(async () => {
    try {
      const serviceId = form.getValues("serviceId");
      if (!serviceId) {
        console.log('Nenhum serviço selecionado');
        return;
      }
      
      console.log('Buscando detalhes do serviço:', serviceId);
      
      const { data: service, error } = await supabase
        .from('servicos')
        .select('id, nome, duracao, preco')
        .eq('id', serviceId)
        .single();
        
      if (error) {
        console.error("Erro ao buscar serviço:", error);
        toast.error("Erro ao carregar detalhes do serviço");
        return;
      }
        
      if (service) {
        console.log('Serviço encontrado:', service);
        setSelectedServices([{
          id: service.id,
          name: service.nome,
          duration: service.duracao,
          price: service.preco
        }]);
      } else {
        console.log('Serviço não encontrado');
        toast.error("Serviço não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do serviço:", error);
      toast.error("Erro ao carregar detalhes do serviço");
    }
  }, [form]);

  // Verifica se a etapa atual está válida
  const isCurrentStepValid = useCallback(() => {
    try {
      const values = form.getValues();
      
      switch(currentStep) {
        case 0: // Cliente
          if (!values.clientId) {
            toast.error("Por favor, selecione um cliente");
            return false;
          }
          return true;
          
        case 1: // Serviço e Profissional
          if (!values.serviceId) {
            toast.error("Por favor, selecione um serviço");
            return false;
          }
          if (!values.professionalId) {
            toast.error("Por favor, selecione um profissional");
            return false;
          }
          return true;
          
        case 2: // Data e Hora
          if (!values.date) {
            toast.error("Por favor, selecione uma data");
            return false;
          }
          if (!values.time) {
            toast.error("Por favor, selecione um horário");
            return false;
          }
          return checkTimeConflicts();
          
        case 3: // Confirmação
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.error("Erro ao validar etapa:", error);
      toast.error("Erro ao validar os dados");
      return false;
    }
  }, [currentStep, form, checkTimeConflicts]);

  // Avança para a próxima etapa
  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      console.log('Tentando avançar para próxima etapa:', currentStep + 1);
      
      if (isCurrentStepValid()) {
        console.log('Etapa atual é válida');
        
        // Limpar erros ao avançar
        setValidationError(null);
        
        // Se estamos indo para a etapa de data/hora
        if (currentStep === 1) {
          console.log('Indo para etapa de data/hora');
          
          // Buscar detalhes do serviço antes de resetar os campos
          fetchServiceDetails().then(() => {
            console.log('Detalhes do serviço atualizados');
            
            // Resetar campos de data e hora
            form.setValue('date', null);
            form.setValue('time', '');
            
            // Avançar para próxima etapa
            setCurrentStep(prev => prev + 1);
          }).catch(error => {
            console.error('Erro ao buscar detalhes do serviço:', error);
            toast.error("Erro ao carregar detalhes do serviço");
          });
        } else {
          setCurrentStep(prev => prev + 1);
        }
      } else {
        console.log('Etapa atual é inválida');
      }
    }
  }, [currentStep, isCurrentStepValid, form, fetchServiceDetails]);
  
  // Volta para a etapa anterior
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      // Limpar erros ao voltar
      setValidationError(null);
      
      // Se estamos voltando da etapa de data/hora
      if (currentStep === 2) {
        // Resetar campos de data e hora
        form.setValue('date', null);
        form.setValue('time', '');
      }
      
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, form]);
  
  // Vai para uma etapa específica
  const goToStep = (step: number) => {
    if (step < currentStep) {
      setValidationError(null);
      
      // Se estamos saindo da etapa de data/hora
      if (currentStep === 2) {
        // Resetar campos de data e hora
        form.setValue('date', null);
        form.setValue('time', '');
      }
      
      setCurrentStep(step);
    }
  };
  
  // Monitora mudanças na data e hora
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'date' || name === 'time') {
        checkTimeConflicts();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, checkTimeConflicts]);
  
  // Adiciona serviço adicional
  const handleAddService = (service: typeof selectedServices[0]) => {
    setSelectedServices(prev => [...prev, service]);
    form.setValue('additionalServices', [
      ...(form.getValues('additionalServices') || []),
      {
        serviceId: service.id,
        duration: service.duration,
        price: service.price
      }
    ]);
  };
  
  // Remove serviço adicional
  const handleRemoveService = (index: number) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
    form.setValue('additionalServices', 
      form.getValues('additionalServices')?.filter((_, i) => i !== index) || []
    );
  };
  
  // Submete o formulário
  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Verifica permissões
      if (isProfessional && values.professionalId !== user?.id) {
        toast.error("Você só pode criar agendamentos para você mesmo.");
        return;
      }
      
      // Verifica conflitos novamente
      if (!checkTimeConflicts()) {
        setIsSubmitting(false);
        return;
      }
      
      // Busca dados do cliente e serviço
      let clientName = "";
      let serviceName = "";
      
      try {
        if (values.clientId) {
          const { data: client } = await supabase
            .from('clientes')
            .select('nome')
            .eq('id', values.clientId)
            .single();
          clientName = client?.nome || "";
        }
        
        if (values.serviceId) {
          const { data: service } = await supabase
            .from('servicos')
            .select('nome')
            .eq('id', values.serviceId)
            .single();
          serviceName = service?.nome || "";
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      }
      
      const appointmentData: CreateAppointmentData = {
        clientId: values.clientId,
        serviceId: values.serviceId,
        professionalId: values.professionalId,
        date: new Date(values.date),
        status: values.status,
        price: selectedServices.reduce((total, service) => total + (service.price || 0), 0),
        duration: selectedServices[0]?.duration || 30,
        notes: values.notes,
        paymentMethod: values.paymentMethod || 'local',
        serviceType: selectedServices[0]?.name || "",
        clientName,
        serviceName,
        notifications: {
          sendConfirmation: values.notifications?.sendConfirmation ?? true,
          sendReminder: values.notifications?.sendReminder ?? true
        },
        additionalServices: selectedServices.slice(1).map(service => ({
          serviceId: service.id,
          duration: service.duration || 0,
          price: service.price || 0
        })),
        isEmergency: values.isEmergency || false,
        emergencyReason: values.emergencyReason
      };
      
      await createAppointment(appointmentData);
      
      // Atualiza a lista de agendamentos
      await fetchAppointments();
      
      // Fecha o diálogo e reseta o formulário
      toast.success("Agendamento criado com sucesso!", {
        description: `Data: ${format(appointmentData.date, "d 'de' MMMM", { locale: ptBR })} às ${values.time}`,
      });
      
      form.reset();
      onClose();
      
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Atualiza serviços quando seleciona o serviço principal
  useEffect(() => {
    const serviceId = form.getValues("serviceId");
    if (!serviceId) {
      setSelectedServices([]);
      return;
    }
    
    fetchServiceDetails();
  }, [form.watch("serviceId")]);

  // Função para lidar com o fechamento do modal principal
  const handleMainDialogClose = () => {
    form.reset();
    onClose();
  };

  // Handler para novo cliente criado
  const handleClientCreated = (newClient: any) => {
    form.setValue("clientId", newClient.id);
    setShowNewClientDialog(false);
  };

  // Handler para novo serviço criado
  const handleServiceCreated = (newService: any) => {
    form.setValue("serviceId", newService.id);
    setShowNewServiceDialog(false);
  };

  return (
    <div className="relative">
      {/* Botão de fechar no cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Novo Agendamento</h2>
        <Button variant="ghost" size="icon" onClick={handleMainDialogClose} type="button">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Progresso */}
          <div className="mb-8 hidden md:block">
            <div className="flex items-center justify-between">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center",
                    step.id !== STEPS.length - 1 &&
                      "after:content-[''] after:w-full after:h-[2px] after:bg-muted after:ml-2"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0",
                      currentStep === step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background"
                    )}
                    onClick={() => step.id < currentStep && goToStep(step.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{step.id + 1}</span>
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progresso em telas pequenas */}
          <div className="mb-6 md:hidden">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Etapa {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Conteúdo do passo atual */}
          <div className="mt-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <ClientSelect
                  form={form}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewClientDialog(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <ServiceSelect
                  form={form}
                  onServiceSelect={(service) => {
                    setSelectedServices([service]);
                    form.setValue('additionalServices', []);
                  }}
                />
                {selectedServices.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Serviços Selecionados</h4>
                    {selectedServices.map((service, index) => (
                      <Alert key={service.id}>
                        <AlertTitle className="flex justify-between">
                          {service.name}
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveService(index)}
                            >
                              Remover
                            </Button>
                          )}
                        </AlertTitle>
                        <AlertDescription>
                          <p>Duração: {service.duration} minutos</p>
                          <p>Preço: R$ {service.price.toFixed(2)}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                    <ServiceSelect
                      form={form}
                      label="Adicionar Serviço"
                      excludeIds={selectedServices.map(s => s.id)}
                      onServiceSelect={handleAddService}
                      optional
                    />
                  </div>
                )}
                {canCreateService && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewServiceDialog(true)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Serviço
                  </Button>
                )}
                <ProfessionalSelect
                  form={form}
                  serviceId={form.getValues("serviceId")}
                  disabled={!form.getValues("serviceId")}
                  defaultValue={isProfessional ? user?.id : undefined}
                  readOnly={isProfessional}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <DateTimeSelect
                  form={form}
                  onTimeChange={checkTimeConflicts}
                  minAdvanceTime={minAdvanceTime}
                  maxFutureDays={maxFutureDays}
                  businessHours={businessHours}
                />
                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro de Validação</AlertTitle>
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}
                {(isAdmin || validationError?.includes("antecedência")) && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emergency"
                      checked={isEmergency}
                      onCheckedChange={(checked) => {
                        setIsEmergency(checked);
                        form.setValue('isEmergency', checked);
                        if (checked) {
                          checkTimeConflicts();
                        }
                      }}
                    />
                    <Label htmlFor="emergency">Agendamento de Emergência</Label>
                  </div>
                )}
                {isEmergency && (
                  <Textarea
                    placeholder="Motivo da emergência"
                    {...form.register('emergencyReason')}
                  />
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <NotesField form={form} />
                <StatusSelect form={form} />
                <PaymentMethodSelect form={form} />
                <NotificationsOptions form={form} />
                
                <Alert>
                  <AlertTitle>Resumo do Agendamento</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>Data: {watchedFields.date ? format(watchedFields.date, "PPP", { locale: ptBR }) : "-"}</p>
                    <p>Horário: {watchedFields.time || "-"}</p>
                    <p>Serviços:</p>
                    <ul className="list-disc pl-4">
                      {selectedServices.map(service => (
                        <li key={service.id}>
                          {service.name} - {service.duration}min - R$ {service.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p>Duração Total: {selectedServices.reduce((total, service) => total + service.duration, 0)} minutos</p>
                    <p>Preço Total: R$ {selectedServices.reduce((total, service) => total + service.price, 0).toFixed(2)}</p>
                    {isEmergency && (
                      <p className="text-destructive">Agendamento de Emergência</p>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Botões de navegação */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 0 ? handleMainDialogClose : handleBack}
            >
              {currentStep === 0 ? "Cancelar" : "Voltar"}
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button
                type="submit"
                disabled={!isCurrentStepValid() || isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? "Criando..." : "Criar Agendamento"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="ml-auto"
              >
                Próximo
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Diálogos auxiliares */}
      {showNewClientDialog && (
        <NewClientDialog onClose={() => setShowNewClientDialog(false)} />
      )}

      {showNewServiceDialog && (
        <NewServiceDialog 
          onServiceCreated={handleServiceCreated}
        />
      )}
    </div>
  );
}; 