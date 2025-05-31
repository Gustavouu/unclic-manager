
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/contexts/onboarding/OnboardingContext';
import { CheckCircle, Building, Users, Clock, Briefcase } from 'lucide-react';

export const SummaryStep: React.FC = () => {
  const { businessData, services, staff, businessHours } = useOnboarding();

  const formatTime = (time: string) => {
    return time || '00:00';
  };

  const getOpenDays = () => {
    if (!businessHours) return [];
    
    return Object.entries(businessHours).filter(([_, hours]) => {
      return hours.isOpen === true || hours.open === true;
    });
  };

  const openDays = getOpenDays();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Configuração Concluída!</h2>
        <p className="text-muted-foreground">
          Revise as informações antes de finalizar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações do Negócio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{businessData.name}</p>
              <p className="text-sm text-muted-foreground">{businessData.description}</p>
            </div>
            
            {businessData.phone && (
              <p className="text-sm">📞 {businessData.phone}</p>
            )}
            
            {businessData.adminEmail && (
              <p className="text-sm">✉️ {businessData.adminEmail}</p>
            )}
            
            {businessData.address && (
              <p className="text-sm">📍 {businessData.address}, {businessData.city}</p>
            )}
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openDays.length > 0 ? (
              <div className="space-y-2">
                {openDays.map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="capitalize">{day}</span>
                    <span>
                      {formatTime(hours.start || hours.openTime || '')} - {formatTime(hours.end || hours.closeTime || '')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum horário configurado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Serviços ({services.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="space-y-2">
                {services.slice(0, 3).map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <span className="text-sm">{service.nome || service.name}</span>
                    <Badge variant="secondary">
                      R$ {(service.preco || service.price || 0).toFixed(2)}
                    </Badge>
                  </div>
                ))}
                {services.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{services.length - 3} serviços adicionais
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum serviço adicionado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Staff */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipe ({staff.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staff.length > 0 ? (
              <div className="space-y-2">
                {staff.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex justify-between items-center">
                    <span className="text-sm">{member.nome || member.name}</span>
                    <Badge variant="outline">
                      {member.cargo || member.role || 'Funcionário'}
                    </Badge>
                  </div>
                ))}
                {staff.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{staff.length - 3} membros adicionais
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum funcionário adicionado
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Tudo pronto!</p>
              <p className="text-sm text-green-700">
                Clique em "Finalizar Configuração" para começar a usar o sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
