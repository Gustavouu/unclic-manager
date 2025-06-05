
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Activity,
  Star
} from 'lucide-react';

interface ReportsKPICardsProps {
  data: {
    totalRevenue: number;
    totalAppointments: number;
    averageTicket: number;
    completionRate: number;
  };
}

export const ReportsKPICards: React.FC<ReportsKPICardsProps> = ({ data }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span className="ml-1">vs período anterior</span>
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalAppointments}</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+8.2%</span>
              <span className="ml-1">vs período anterior</span>
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {data.averageTicket.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+3.8%</span>
              <span className="ml-1">vs período anterior</span>
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center">
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              <span className="text-red-600">-1.2%</span>
              <span className="ml-1">vs período anterior</span>
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
