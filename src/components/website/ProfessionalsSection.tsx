
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StaffData } from '@/pages/BusinessWebsite';

export interface ProfessionalsSectionProps {
  staff: StaffData[];
  onBookingClick: () => void;
}

export function ProfessionalsSection({ staff, onBookingClick }: ProfessionalsSectionProps) {
  if (!staff.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
          <p className="text-lg text-gray-600">
            Conheça os profissionais que irão cuidar de você
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <Card key={member.id} className="text-center">
              <CardHeader>
                {member.photo_url && (
                  <img 
                    src={member.photo_url} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h3 className="text-xl font-bold">{member.name}</h3>
                {member.position && (
                  <p className="text-sm text-gray-500">{member.position}</p>
                )}
              </CardHeader>
              <CardContent>
                {member.specialties && member.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Especialidades:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.specialties.map((specialty, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={onBookingClick}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Agendar com {member.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
