
import { Users, UserPlus, UserCheck, Calendar } from "lucide-react";

export function ClientStatisticsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
          <h3 className="text-2xl font-bold">685</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-green-100 p-2 rounded-full">
            <UserPlus className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Novos Clientes (Mês)</p>
          <h3 className="text-2xl font-bold">42</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserCheck className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
          <h3 className="text-2xl font-bold">87%</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-purple-100 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Frequência Média</p>
          <h3 className="text-2xl font-bold">18 dias</h3>
        </div>
      </div>
    </div>
  );
}
