
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, UserRound, Mail, Phone, Calendar, Award, Activity, Users, DollarSign, Percent } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessionalData } from "@/hooks/useProfessionalData";

interface ProfessionalDetailsProps {
  professionalId: string;
  onClose: () => void;
}

export const ProfessionalDetails = ({ professionalId, onClose }: ProfessionalDetailsProps) => {
  const { professionals } = useProfessionalData();
  const professional = professionals.find(p => p.id === professionalId);

  if (!professional) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>Detalhes do Colaborador</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <UserRound className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-muted-foreground mb-1">Colaborador não encontrado</p>
            <p className="text-sm text-muted-foreground/75">O colaborador solicitado não existe ou foi removido</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data indisponível";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'vacation':
        return 'Em férias';
      default:
        return status;
    }
  };

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>Detalhes do Colaborador</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Informações básicas do colaborador */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={professional.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(professional.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium">{professional.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(professional.status)}>
                  {getStatusText(professional.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">{professional.role}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações de contato */}
          <div>
            <h3 className="text-sm font-medium mb-3">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{professional.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{professional.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações profissionais */}
          <div>
            <h3 className="text-sm font-medium mb-3">Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                <span><strong>Especialidade:</strong> {professional.specialty}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span><strong>Data de Contratação:</strong> {formatDate(professional.hireDate)}</span>
              </div>
              <div className="flex items-center">
                <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                <span><strong>Comissão:</strong> {formatPercentage(professional.commission)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estatísticas */}
          <div>
            <h3 className="text-sm font-medium mb-3">Desempenho</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Activity className="h-5 w-5 text-muted-foreground mb-2" />
                  <div className="text-2xl font-medium">{professional.appointmentsCount}</div>
                  <div className="text-xs text-muted-foreground">Atendimentos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground mb-2" />
                  <div className="text-2xl font-medium">{professional.clientsServed}</div>
                  <div className="text-xs text-muted-foreground">Clientes Atendidos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground mb-2" />
                  <div className="text-2xl font-medium">{formatCurrency(professional.revenueGenerated)}</div>
                  <div className="text-xs text-muted-foreground">Receita Gerada</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
