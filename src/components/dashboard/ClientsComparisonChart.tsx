
import React from 'react';
import { Users } from 'lucide-react';

interface ClientsComparisonChartProps {
  newClients: number;
  returningClients: number;
}

export function ClientsComparisonChart({ newClients, returningClients }: ClientsComparisonChartProps) {
  const totalClients = newClients + returningClients;

  if (totalClients === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Users className="h-12 w-12 mb-2 opacity-20" />
        <p className="text-sm">Sem dados de clientes para visualizar</p>
      </div>
    );
  }

  const newClientsPercentage = (newClients / totalClients) * 100;
  const returningClientsPercentage = (returningClients / totalClients) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Novos Clientes</span>
        <span className="text-sm text-gray-600">{newClients}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${newClientsPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Clientes Recorrentes</span>
        <span className="text-sm text-gray-600">{returningClients}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${returningClientsPercentage}%` }}
        ></div>
      </div>
      
      <div className="pt-2 border-t">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Total</span>
          <span className="font-medium">{totalClients} clientes</span>
        </div>
      </div>
    </div>
  );
}
