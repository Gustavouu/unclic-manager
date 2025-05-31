
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessData } from '@/hooks/useBusinessWebsite';
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';

export interface AppointmentSectionProps {
  business: BusinessData;
  onBookingClick: () => void;
}

export function AppointmentSection({ business, onBookingClick }: AppointmentSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Agende Seu Horário</h2>
          <p className="text-lg text-gray-600">
            Faça seu agendamento de forma rápida e fácil
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Informações para Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Horário de Funcionamento</p>
                <p className="text-sm text-gray-500">Segunda a Sexta: 9:00 - 18:00</p>
              </div>
            </div>
            
            {business.phone && (
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Contato</p>
                  <p className="text-sm text-gray-500">{business.phone}</p>
                </div>
              </div>
            )}
            
            {business.address && (
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-sm text-gray-500">
                    {business.address}
                    {business.address_number && `, ${business.address_number}`}
                    {business.city && `, ${business.city}`}
                    {business.state && ` - ${business.state}`}
                  </p>
                </div>
              </div>
            )}
            
            <Button onClick={onBookingClick} size="lg" className="w-full mt-6">
              Agendar Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
