
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Professional {
  name: string;
  appointments: number;
  revenue: number;
  rating: number;
}

interface ProfessionalsTabProps {
  professionalPerformance: Professional[];
}

export const ProfessionalsTab: React.FC<ProfessionalsTabProps> = ({ professionalPerformance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Profissionais</CardTitle>
        <CardDescription>Desempenho individual da equipe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {professionalPerformance.map((professional, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-medium">{professional.name}</h4>
                  <p className="text-sm text-muted-foreground">{professional.appointments} agendamentos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {professional.revenue.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{professional.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
