
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientAcquisitionChart } from "../charts/ClientAcquisitionChart";
import { ClientRetentionChart } from "../charts/ClientRetentionChart";
import { ClientCategoriesChart } from "../charts/ClientCategoriesChart";
import { ClientStatisticsSection } from "../sections/ClientStatisticsSection";

export function ClientReports() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Estatísticas de Clientes</CardTitle>
          <CardDescription>Dados consolidados da sua base de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientStatisticsSection />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aquisição de Clientes</CardTitle>
          <CardDescription>Novos clientes por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientAcquisitionChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Retenção de Clientes</CardTitle>
          <CardDescription>Taxa de retorno de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientRetentionChart />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Categorias de Clientes</CardTitle>
          <CardDescription>Segmentação por perfil de consumo</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientCategoriesChart />
        </CardContent>
      </Card>
    </div>
  );
}
