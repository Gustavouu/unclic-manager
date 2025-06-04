
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleService } from '@/hooks/useBusinessWebsite';
import { formatCurrency } from '@/lib/format';

export interface ServicesSectionProps {
  services: SimpleService[];
  onBookingClick: () => void;
}

export function ServicesSection({ services, onBookingClick }: ServicesSectionProps) {
  if (!services.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
          <p className="text-lg text-gray-600">
            Conheça os serviços que oferecemos com qualidade e profissionalismo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {service.description && (
                  <p className="text-gray-600 mb-4">{service.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(service.price, 'BRL')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {service.duration} min
                  </span>
                </div>
                <Button 
                  onClick={onBookingClick}
                  className="w-full mt-4"
                >
                  Agendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
