
import React from 'react';
import { Layout } from './components/Layout';
import { StatCard } from './components/stats/StatCard';
import { Card } from './components/Card';
import { SimpleBarChart } from './components/charts/SimpleBarChart';
import { SimplePieChart } from './components/charts/SimplePieChart';
import { SimpleLineChart } from './components/charts/SimpleLineChart';
import { DataTable } from './components/data/DataTable';
import { Button } from './components/Button';
import { Calendar, ChevronRight, Clock, DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const DashboardPrototype: React.FC = () => {
  // Mock data for charts and tables
  const revenueData = [
    { label: 'Jan', value: 4200 },
    { label: 'Fev', value: 3800 },
    { label: 'Mar', value: 5100 },
    { label: 'Abr', value: 4700 },
    { label: 'Mai', value: 6200 },
    { label: 'Jun', value: 5800 },
  ];
  
  const serviceData = [
    { label: 'Corte Masculino', value: 45, color: '#4466ff' },
    { label: 'Barba', value: 25, color: '#10b981' },
    { label: 'Corte + Barba', value: 15, color: '#f59e0b' },
    { label: 'Coloração', value: 10, color: '#ef4444' },
    { label: 'Outros', value: 5, color: '#9ca3af' },
  ];
  
  const appointmentsData = [
    { client: 'João Silva', service: 'Corte Masculino', time: '10:00', professional: 'Carlos', status: 'Confirmado' },
    { client: 'Maria Oliveira', service: 'Coloração', time: '11:30', professional: 'Ana', status: 'Confirmado' },
    { client: 'Pedro Santos', service: 'Corte + Barba', time: '14:00', professional: 'Carlos', status: 'Aguardando' },
    { client: 'Ana Pereira', service: 'Hidratação', time: '15:30', professional: 'Julia', status: 'Confirmado' },
    { client: 'Lucas Costa', service: 'Barba', time: '16:45', professional: 'Carlos', status: 'Aguardando' },
  ];
  
  const clientsData = [
    { label: 'Jan', value: 10 },
    { label: 'Fev', value: 15 },
    { label: 'Mar', value: 22 },
    { label: 'Abr', value: 18 },
    { label: 'Mai', value: 25 },
    { label: 'Jun', value: 30 },
  ];

  return (
    <Layout title="Dashboard" subtitle="Visualize e gerencie os dados do seu negócio">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Receita" 
          value="R$ 7.590,00" 
          trend={{ value: 12, direction: 'up', label: 'este mês' }}
          color="blue"
          icon={<DollarSign size={20} />}
        />
        <StatCard 
          title="Agendamentos" 
          value="124" 
          trend={{ value: 8, direction: 'up', label: 'este mês' }}
          color="green"
          icon={<Calendar size={20} />}
        />
        <StatCard 
          title="Clientes" 
          value="45" 
          trend={{ value: 5, direction: 'up', label: 'novos' }}
          color="amber"
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Vendas" 
          value="36" 
          trend={{ value: 3, direction: 'down', label: 'este mês' }}
          color="purple"
          icon={<ShoppingBag size={20} />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Revenue Chart */}
        <div className="lg:col-span-2">
          <Card 
            title="Receita Mensal" 
            subtitle="Últimos 6 meses"
            action={<Button variant="outline" size="sm">Ver Detalhes</Button>}
          >
            <SimpleBarChart 
              data={revenueData.map(item => ({
                ...item,
                color: 'bg-blue-500'
              }))} 
              height={250}
            />
          </Card>
        </div>
        
        {/* Right Column - Service Popularity */}
        <div>
          <Card title="Serviços Populares" subtitle="Distribuição por agendamentos">
            <SimplePieChart data={serviceData} size={180} />
          </Card>
        </div>
        
        {/* Appointments Section */}
        <div className="lg:col-span-2">
          <Card 
            title="Próximos Agendamentos" 
            subtitle="Agendamentos de hoje"
            action={<Button variant="ghost" size="sm" iconRight={<ChevronRight size={16} />}>Ver Todos</Button>}
          >
            <DataTable
              columns={[
                { header: 'Cliente', accessor: 'client' },
                { header: 'Serviço', accessor: 'service' },
                { 
                  header: 'Horário', 
                  accessor: 'time',
                  cell: (value) => (
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      <span>{value}</span>
                    </div>
                  )
                },
                { header: 'Profissional', accessor: 'professional' },
                { 
                  header: 'Status', 
                  accessor: 'status',
                  cell: (value) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      value === 'Confirmado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {value}
                    </span>
                  )
                },
              ]}
              data={appointmentsData}
            />
          </Card>
        </div>
        
        {/* Trends Section */}
        <div>
          <Card 
            title="Novos Clientes" 
            subtitle="Últimos 6 meses"
            action={<Button variant="ghost" size="sm" iconRight={<TrendingUp size={16} />}>Tendências</Button>}
          >
            <SimpleLineChart 
              data={clientsData} 
              height={200}
              color="#10b981"
            />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPrototype;
