
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Users, Clock, Briefcase, Phone, Mail, MapPin } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SummaryStepImproved: React.FC = () => {
  const { 
    businessData, 
    services, 
    staffMembers, 
    businessHours, 
    hasStaff,
    completeOnboarding 
  } = useOnboarding();
  
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<string>('');

  // Validation
  const missingRequiredFields = [];
  if (!businessData.name) missingRequiredFields.push("Nome do negócio");
  if (!businessData.adminEmail && !businessData.email) missingRequiredFields.push("Email de contato");

  const hasValidationErrors = missingRequiredFields.length > 0;

  const handleComplete = async () => {
    if (hasValidationErrors) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);
      setCompletionStatus('Iniciando criação do negócio...');

      const result = await completeOnboarding();

      if (result.success) {
        setCompletionStatus('Negócio criado com sucesso!');
        toast.success("Parabéns! Seu negócio foi configurado com sucesso.");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao completar configuração: ${errorMessage}`);
      setCompletionStatus('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h2 className="text-xl font-semibold">Criando seu negócio...</h2>
        {completionStatus && (
          <p className="text-muted-foreground">{completionStatus}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Resumo da Configuração</h2>
        <p className="text-muted-foreground mt-2">
          Revise as informações antes de finalizar
        </p>
      </div>

      {hasValidationErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Campos obrigatórios não preenchidos: {missingRequiredFields.join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Informações do Negócio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Nome:</strong> {businessData.name || "Não informado"}
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <strong>Email:</strong> {businessData.adminEmail || businessData.email || "Não informado"}
            </div>
            {businessData.phone && (
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <strong>Telefone:</strong> {businessData.phone}
              </div>
            )}
            {(businessData.address || businessData.city) && (
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <strong>Endereço:</strong> {[
                  businessData.address,
                  businessData.addressNumber || businessData.number,
                  businessData.city,
                  businessData.state
                ].filter(Boolean).join(", ")}
              </div>
            )}
          </div>
          {businessData.description && (
            <div>
              <strong>Descrição:</strong> {businessData.description}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Serviços
            </span>
            <Badge variant={services.length > 0 ? "default" : "secondary"}>
              {services.length} serviço{services.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{service.nome || service.name}</div>
                    {(service.descricao || service.description) && (
                      <div className="text-sm text-muted-foreground">
                        {service.descricao || service.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {(service.preco || service.price || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {service.duracao || service.duration || 0} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhum serviço adicionado
            </p>
          )}
        </CardContent>
      </Card>

      {/* Staff */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Equipe
            </span>
            <Badge variant={hasStaff && staffMembers.length > 0 ? "default" : "secondary"}>
              {hasStaff ? `${staffMembers.length} funcionário${staffMembers.length !== 1 ? 's' : ''}` : 'Sem funcionários'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasStaff && staffMembers.length > 0 ? (
            <div className="space-y-3">
              {staffMembers.map((member, index) => (
                <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{member.nome || member.name}</div>
                    {(member.cargo || member.role) && (
                      <div className="text-sm text-muted-foreground">
                        {member.cargo || member.role}
                      </div>
                    )}
                  </div>
                  {(member.especializacoes || member.specialties) && (
                    <div className="text-sm text-muted-foreground">
                      {(member.especializacoes || member.specialties || []).join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              {hasStaff ? "Nenhum funcionário adicionado" : "Sem funcionários por enquanto"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Business Hours */}
      {businessHours && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center p-2 rounded">
                  <span className="capitalize">{day}</span>
                  <span className="text-sm">
                    {hours.isOpen || hours.open ? 
                      `${hours.start || hours.openTime || ''} - ${hours.end || hours.closeTime || ''}` : 
                      'Fechado'
                    }
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="flex justify-center">
        <Button 
          onClick={handleComplete} 
          disabled={hasValidationErrors}
          size="lg"
          className="w-full md:w-auto px-8"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {hasValidationErrors ? "Complete os campos obrigatórios" : "Finalizar Configuração"}
        </Button>
      </div>
    </div>
  );
};
