
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Professional } from "../types";

interface ProfessionalInfoTabProps {
  professional: Professional;
}

export const ProfessionalInfoTab = ({ professional }: ProfessionalInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          <CardDescription>Dados pessoais do colaborador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</h4>
            <p>{professional.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">CPF</h4>
            <p>{professional.document}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Nascimento</h4>
            <p>{format(new Date(professional.birthDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Endereço</h4>
            <p>{professional.address}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Profissionais</CardTitle>
          <CardDescription>Dados de trabalho e especialidades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
            <Badge variant={professional.active ? "success" : "secondary"}>
              {professional.active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Contratação</h4>
            <p>{format(new Date(professional.hireDate), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Especialidades</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {professional.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Comissão</h4>
            <p>{professional.commissionRate}%</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Observações</h4>
            <p className="text-sm text-muted-foreground">{professional.notes || "Nenhuma observação."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
