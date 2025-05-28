import { Client } from "@/types/client";

interface ClientStatsProps {
  clients: Client[];
}

export function ClientStats({ clients }: ClientStatsProps) {
  const lastVisitStats = clients.filter(client => {
    if (!client.last_visit) return false;
    const lastVisit = new Date(client.last_visit);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastVisit >= thirtyDaysAgo;
  }).length;

  const totalSpentStats = clients.reduce((total, client) => {
    return total + (client.total_spent || 0);
  }, 0);

  const totalAppointmentsStats = clients.reduce((total, client) => {
    return total + (client.total_appointments || 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
        <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Visitaram (30 dias)</h3>
        <p className="text-2xl font-bold text-gray-900">{lastVisitStats}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Faturamento Total</h3>
        <p className="text-2xl font-bold text-gray-900">R$ {totalSpentStats.toFixed(2)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total de Agendamentos</h3>
        <p className="text-2xl font-bold text-gray-900">{totalAppointmentsStats}</p>
      </div>
    </div>
  );
}
