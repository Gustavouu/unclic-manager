
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Star, TrendingUp, Users } from "lucide-react";

interface ProfessionalPerformanceTabProps {
  professionalId: string;
}

export const ProfessionalPerformanceTab = ({ professionalId }: ProfessionalPerformanceTabProps) => {
  // Dados mockados para exemplo
  const performanceData = {
    appointmentsCompleted: 240,
    appointmentsCanceled: 12,
    averageRating: 4.8,
    commissionEarned: 5240.75,
    clientsServed: 168,
    repeatClients: 142,
    totalHoursWorked: 420,
    popularServices: [
      { name: "Corte de Cabelo", count: 98 },
      { name: "Coloração", count: 45 },
      { name: "Manicure", count: 33 },
      { name: "Barba", count: 30 },
    ],
    recentRatings: [
      { client: "Maria Silva", rating: 5, comment: "Excelente atendimento!" },
      { client: "João Pereira", rating: 5, comment: "Profissional e pontual" },
      { client: "Ana Souza", rating: 4, comment: "Bom trabalho, voltarei" },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="text-2xl font-bold">
                {performanceData.appointmentsCompleted}
              </div>
              <p className="text-sm text-muted-foreground">
                Agendamentos Realizados
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Star className="h-8 w-8 text-amber-500" />
              <div className="text-2xl font-bold">
                {performanceData.averageRating}/5
              </div>
              <p className="text-sm text-muted-foreground">
                Avaliação Média
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Users className="h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold">
                {performanceData.clientsServed}
              </div>
              <p className="text-sm text-muted-foreground">
                Clientes Atendidos
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="text-2xl font-bold">
                R$ {performanceData.commissionEarned.toLocaleString('pt-BR')}
              </div>
              <p className="text-sm text-muted-foreground">
                Comissão Total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart size={18} className="text-blue-600" />
              Serviços Mais Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.popularServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {service.count} realizados
                    </div>
                  </div>
                  <div className="w-1/2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ 
                        width: `${(service.count / performanceData.popularServices[0].count) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              Avaliações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.recentRatings.map((rating, index) => (
                <div key={index} className="py-2 border-b last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{rating.client}</div>
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < rating.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rating.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
