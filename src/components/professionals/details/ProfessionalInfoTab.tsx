
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Professional } from "@/hooks/professionals/types";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  User, 
  Percent, 
  Edit 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfessionalStatusBadge } from "../ProfessionalStatusBadge";
import { Separator } from "@/components/ui/separator";

interface ProfessionalInfoTabProps {
  professional: Professional;
}

export const ProfessionalInfoTab = ({ professional }: ProfessionalInfoTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={professional.photoUrl} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">
                  {professional.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="mt-4 gap-2">
                <Edit size={14} />
                Editar foto
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{professional.name}</h2>
                  <p className="text-muted-foreground">{professional.role}</p>
                </div>
                <ProfessionalStatusBadge status={professional.status} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{professional.email || "Não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{professional.phone || "Não informado"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>Contratado em: {professional.hireDate || "Não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent size={16} className="text-muted-foreground" />
                    <span>Comissão: {professional.commissionPercentage}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Especializações</h3>
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-transparent">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {professional.bio && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-medium mb-2">Sobre</h3>
                <p className="text-muted-foreground">{professional.bio}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-blue-600" />
              <h3 className="font-medium">Detalhes do usuário</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ID do colaborador</p>
                <p className="font-mono text-sm">{professional.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID do usuário vinculado</p>
                <p className="font-mono text-sm">{professional.userId || "Não vinculado"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} className="text-blue-600" />
              <h3 className="font-medium">Estatísticas</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total de agendamentos</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avaliação média</span>
                <span className="font-medium">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de remarcação</span>
                <span className="font-medium">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Clientes recorrentes</span>
                <span className="font-medium">84%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
