
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
}

interface ServicesSectionProps {
  services: Service[];
  onServiceSelect?: (service: Service) => void;
}

export function ServicesSection({ services, onServiceSelect }: ServicesSectionProps) {
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma ampla gama de serviços profissionais para cuidar da sua beleza e bem-estar
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedServices).map(([category, categoryServices]) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <Card 
                    key={service.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onServiceSelect?.(service)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {service.name}
                        </CardTitle>
                        <Badge variant="secondary">
                          {formatDuration(service.duration)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {service.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {service.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(service.price)}
                        </span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Agendar
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum serviço disponível no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
