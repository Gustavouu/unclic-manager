
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { appointmentFormSchema, AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Button } from "@/components/ui/button";
import { ServiceSelect } from "./ServiceSelect";
import { ProfessionalSelect } from "./ProfessionalSelect";
import { DateTimeSelect } from "./DateTimeSelect";
import { NotificationsOptions } from "./NotificationsOptions";
import { format, addMinutes, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

interface PaymentRequiredAppointmentFormProps {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: () => void;
  availableServices: Array<{
    id: string;
    nome: string;
    descricao: string;
    duracao: number;
    preco: number;
    ativo: boolean;
  }>;
  availableStaff: Array<{
    id: string;
    nome: string;
    cargo: string;
    especializacoes: string[];
    foto_url: string;
    bio: string;
  }>;
}

// Define etapas do formulário
const STEPS = [
  { id: 0, label: "Serviço e Profissional" },
  { id: 1, label: "Data e Hora" },
  { id: 2, label: "Pagamento" },
  { id: 3, label: "Confirmação" },
];

export function PaymentRequiredAppointmentForm({
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  availableServices,
  availableStaff,
}: PaymentRequiredAppointmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: customerId,
      status: "pendente",
      notes: "",
      paymentMethod: "credit_card", // Changed from "online" to a valid value
      notifications: {
        sendConfirmation: true,
        sendReminder: true,
      },
    },
  });
  
  // Observa mudanças nos campos
  const watchedFields = form.watch();
  
  // Verifica se a etapa atual está válida
  const isCurrentStepValid = () => {
    const { errors } = form.formState;
    
    switch(currentStep) {
      case 0: // Serviço e Profissional
        return !!watchedFields.serviceId && !!watchedFields.professionalId && 
               !errors.serviceId && !errors.professionalId;
      case 1: // Data e Hora
        return !!watchedFields.date && !!watchedFields.time && 
               !errors.date && !errors.time && !validationError;
      case 2: // Pagamento
        return isPaymentComplete;
      case 3: // Confirmação
        return true;
      default:
        return false;
    }
  };
  
  // Avança para a próxima etapa
  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && isCurrentStepValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Volta para a etapa anterior
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setValidationError(null);
    }
  };
  
  // Vai para uma etapa específica (somente pode ir para etapas já validadas)
  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setValidationError(null);
    }
  };
  
  // Simulação de processamento de pagamento
  const processPayment = async () => {
    setIsPaymentProcessing(true);
    
    // Simula processamento de pagamento
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsPaymentComplete(true);
      toast.success("Pagamento processado com sucesso!");
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  
  // Verifica conflitos quando muda data/hora/profissional
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'date' || name === 'time' || name === 'professionalId') {
        setValidationError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  const validateAppointmentTime = () => {
    // Implementar verificação de conflitos de horário
    // Normalmente chamaria um hook ou serviço para verificar
    return { valid: true }; 
  };
  
  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Preparar data do agendamento
      const appointmentDate = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Gerar IDs se necessário
      const serviceId = values.serviceId || uuidv4();
      const professionalId = values.professionalId || uuidv4();
      
      console.log("Criando agendamento com pagamento:", {
        clientId: customerId,
        clientName: customerName,
        serviceName: selectedService?.name,
        professionalName: selectedProfessional?.name,
        date: appointmentDate,
        price: selectedService?.price || 0,
        status: "confirmado" // Confirmado pois o pagamento foi realizado
      });
      
      // Simulação de criação de agendamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sucesso
      toast.success("Agendamento criado com sucesso!");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Convert Supabase service format to form component format
  const serviceOptions = availableServices.map(service => ({
    value: service.id,
    label: `${service.nome} - ${service.duracao}min - R$${service.preco.toFixed(2)}`,
    price: service.preco,
    duration: service.duracao
  }));

  // Convert Supabase staff format to form component format
  const professionalOptions = availableStaff.map(staff => ({
    value: staff.id,
    label: staff.nome,
    description: staff.cargo
  }));

  // Handle service selection
  const handleServiceSelect = (service: any) => {
    setSelectedService({
      id: service.id,
      name: service.nome || service.name,
      duration: service.duracao || service.duration,
      price: service.preco || service.price
    });
  };
  
  // Handle professional selection
  const handleProfessionalSelect = (professional: any) => {
    setSelectedProfessional({
      id: professional.id,
      name: professional.nome || professional.name
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progresso */}
        <div className="mb-6 hidden md:block">
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

        {/* Informações do cliente */}
        <div className="mb-4">
          <Alert>
            <AlertTitle>Cliente</AlertTitle>
            <AlertDescription>
              <p>{customerName}</p>
              {customerEmail && <p>Email: {customerEmail}</p>}
              {customerPhone && <p>Telefone: {customerPhone}</p>}
            </AlertDescription>
          </Alert>
        </div>

        {/* Conteúdo do passo atual */}
        <div className="mt-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              {/* Serviço */}
              <div>
                <ServiceSelect
                  form={form}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  onServiceSelect={handleServiceSelect}
                  options={serviceOptions}
                />
              </div>

              {/* Profissional */}
              <div>
                <ProfessionalSelect
                  form={form}
                  options={professionalOptions}
                  onProfessionalSelect={handleProfessionalSelect}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <DateTimeSelect
                form={form}
                onTimeChange={validateAppointmentTime}
              />
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro de Validação</AlertTitle>
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Resumo do Agendamento</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Cliente: {customerName}</p>
                  <p>Serviço: {selectedService?.name || "Não selecionado"}</p>
                  <p>Profissional: {selectedProfessional?.name || "Não selecionado"}</p>
                  <p>Data: {form.watch('date') ? format(form.watch('date'), "PPP", { locale: ptBR }) : "-"}</p>
                  <p>Horário: {form.watch('time') || "-"}</p>
                  <p className="font-medium">Valor Total: R$ {selectedService?.price.toFixed(2) || "0.00"}</p>
                </AlertDescription>
              </Alert>

              <div className="py-4">
                <h3 className="text-lg font-medium mb-2">Efetuar Pagamento</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para confirmar seu agendamento, realize o pagamento abaixo.
                </p>
                
                {/* Simulação de interface de pagamento */}
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-number" className="text-sm font-medium">
                        Número do Cartão
                      </label>
                      <input
                        id="card-number"
                        type="text"
                        className="w-full border rounded-md p-2 mt-1"
                        placeholder="0000 0000 0000 0000"
                        disabled={isPaymentProcessing || isPaymentComplete}
                      />
                    </div>
                    <div>
                      <label htmlFor="card-expiry" className="text-sm font-medium">
                        Validade
                      </label>
                      <input
                        id="card-expiry"
                        type="text"
                        className="w-full border rounded-md p-2 mt-1"
                        placeholder="MM/AA"
                        disabled={isPaymentProcessing || isPaymentComplete}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-name" className="text-sm font-medium">
                        Nome no Cartão
                      </label>
                      <input
                        id="card-name"
                        type="text"
                        className="w-full border rounded-md p-2 mt-1"
                        placeholder="Nome completo"
                        disabled={isPaymentProcessing || isPaymentComplete}
                      />
                    </div>
                    <div>
                      <label htmlFor="card-cvv" className="text-sm font-medium">
                        CVV
                      </label>
                      <input
                        id="card-cvv"
                        type="text"
                        className="w-full border rounded-md p-2 mt-1"
                        placeholder="123"
                        disabled={isPaymentProcessing || isPaymentComplete}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={processPayment}
                    disabled={isPaymentProcessing || isPaymentComplete}
                  >
                    {isPaymentProcessing
                      ? "Processando..."
                      : isPaymentComplete
                      ? "Pagamento Confirmado"
                      : `Pagar R$ ${selectedService?.price.toFixed(2) || "0.00"}`}
                  </Button>
                  
                  {isPaymentComplete && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-700">Pagamento Aprovado</AlertTitle>
                      <AlertDescription className="text-green-600">
                        Seu pagamento foi processado com sucesso.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <NotificationsOptions form={form} />
              
              <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-700">Agendamento Confirmado</AlertTitle>
                <AlertDescription className="text-green-600 space-y-2">
                  <p>Cliente: {customerName}</p>
                  <p>Serviço: {selectedService?.name}</p>
                  <p>Profissional: {selectedProfessional?.name}</p>
                  <p>Data: {form.watch('date') ? format(form.watch('date'), "PPP", { locale: ptBR }) : "-"}</p>
                  <p>Horário: {form.watch('time')}</p>
                  <p>Pagamento: Aprovado</p>
                  
                  <p className="font-medium mt-4">
                    Por favor, chegue com 10 minutos de antecedência. Agradecemos a preferência!
                  </p>
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
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Voltar
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button
              type="submit"
              disabled={!isCurrentStepValid() || isSubmitting}
              className="ml-auto"
            >
              {isSubmitting ? "Finalizando..." : "Finalizar Agendamento"}
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
  );
}
