
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Scissors, Users, Clock, CheckCircle, AlertCircle, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SummaryStepProps {
  isEditMode?: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ isEditMode = false }) => {
  const { businessData, services, staffMembers, businessHours, hasStaff, isComplete } = useOnboarding();
  
  // Check if each step is complete
  const isBusinessComplete = 
    businessData.name.trim() !== "" && 
    businessData.email.trim() !== "" && 
    businessData.phone.trim() !== "" &&
    businessData.address.trim() !== "" &&
    businessData.cep.trim() !== "";
  
  const isServicesComplete = services.length > 0;
  
  const isStaffComplete = !hasStaff || (hasStaff && staffMembers.length > 0);
  
  const isHoursComplete = Object.values(businessHours).some(day => day.open);
  
  // Format days for display
  const formatDays = () => {
    const dayNames: Record<string, string> = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
      sunday: "Domingo"
    };
    
    return Object.entries(businessHours)
      .filter(([_, data]) => data.open)
      .map(([day, data]) => `${dayNames[day]}: ${data.openTime} - ${data.closeTime}`)
      .join(", ");
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {isEditMode ? "Revisão das Alterações" : "Revisão Final"}
      </h3>
      
      {!isComplete() && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informações Incompletas</AlertTitle>
          <AlertDescription>
            Existem informações obrigatórias que ainda não foram preenchidas. Revise os itens destacados abaixo antes de {isEditMode ? "salvar" : "finalizar"}.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={!isBusinessComplete ? "border-destructive" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Building className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Dados do Estabelecimento</h3>
                {!isBusinessComplete ? (
                  <p className="text-destructive mt-1 text-sm">Informações incompletas</p>
                ) : (
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Nome:</strong> {businessData.name}</p>
                    <p><strong>Email:</strong> {businessData.email}</p>
                    <p><strong>Telefone:</strong> {businessData.phone}</p>
                    <p><strong>Endereço:</strong> {businessData.address}, {businessData.number} - {businessData.city}/{businessData.state}</p>
                    <p><strong>CEP:</strong> {businessData.cep}</p>
                    {businessData.website && (
                      <p className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <strong>Site:</strong> https://{businessData.website}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={!isServicesComplete ? "border-destructive" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Scissors className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Serviços</h3>
                {!isServicesComplete ? (
                  <p className="text-destructive mt-1 text-sm">Nenhum serviço cadastrado</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm mb-2">{services.length} serviço(s) cadastrado(s)</p>
                    <div className="flex flex-wrap gap-1">
                      {services.map(service => (
                        <Badge key={service.id} variant="outline">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={hasStaff && !isStaffComplete ? "border-destructive" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Users className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Profissionais</h3>
                {!hasStaff ? (
                  <p className="text-sm mt-1">Configurado como Autônomo</p>
                ) : !isStaffComplete ? (
                  <p className="text-destructive mt-1 text-sm">Nenhum profissional cadastrado</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm mb-2">{staffMembers.length} profissional(is) cadastrado(s)</p>
                    <div className="flex flex-wrap gap-1">
                      {staffMembers.map(staff => (
                        <Badge key={staff.id} variant="outline">
                          {staff.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={!isHoursComplete ? "border-destructive" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Horários de Funcionamento</h3>
                {!isHoursComplete ? (
                  <p className="text-destructive mt-1 text-sm">Horários não configurados</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm">
                      {formatDays()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      {isComplete() && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>{isEditMode ? "Tudo Pronto para Salvar!" : "Tudo Pronto!"}</AlertTitle>
          <AlertDescription>
            {isEditMode 
              ? "Todas as informações foram revisadas e estão prontas para serem salvas. Clique em 'Salvar Alterações' para atualizar as configurações do seu negócio."
              : "Todas as informações básicas foram preenchidas. Você pode finalizar o processo de configuração. Você poderá ajustar essas configurações posteriormente nas configurações do sistema."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
