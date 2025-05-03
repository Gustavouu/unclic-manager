
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { StatCard } from './components/stats/StatCard';
import { Card } from './components/Card';
import { DataTable } from './components/data/DataTable';
import { Button } from './components/Button';
import { Search, Filter, Plus, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { SimpleBarChart } from './components/charts/SimpleBarChart';

const ProfessionalsPrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for professionals
  const professionalsData = [
    { id: '1', name: 'Carlos Santos', role: 'Barbeiro', email: 'carlos@email.com', phone: '(11) 99999-1111', appointments: 45, revenue: 'R$ 2.250,00', status: 'Ativo' },
    { id: '2', name: 'Ana Oliveira', role: 'Cabeleireira', email: 'ana@email.com', phone: '(11) 99999-2222', appointments: 38, revenue: 'R$ 3.040,00', status: 'Ativo' },
    { id: '3', name: 'Pedro Mendes', role: 'Barbeiro', email: 'pedro@email.com', phone: '(11) 99999-3333', appointments: 30, revenue: 'R$ 1.500,00', status: 'Ativo' },
    { id: '4', name: 'Julia Costa', role: 'Manicure', email: 'julia@email.com', phone: '(11) 99999-4444', appointments: 52, revenue: 'R$ 1.820,00', status: 'Ativo' },
    { id: '5', name: 'Ricardo Silva', role: 'Barbeiro', email: 'ricardo@email.com', phone: '(11) 99999-5555', appointments: 0, revenue: 'R$ 0,00', status: 'Inativo' },
  ];
  
  // Performance data for chart
  const performanceData = [
    { label: 'Carlos', value: 45 },
    { label: 'Ana', value: 38 },
    { label: 'Pedro', value: 30 },
    { label: 'Julia', value: 52 },
  ];
  
  // Revenue data for chart
  const revenueData = [
    { label: 'Carlos', value: 2250 },
    { label: 'Ana', value: 3040 },
    { label: 'Pedro', value: 1500 },
    { label: 'Julia', value: 1820 },
  ];

  // Filter professionals based on active tab
  const filteredProfessionals = activeTab === 'all' 
    ? professionalsData
    : professionalsData.filter(prof => 
        activeTab === 'active' ? prof.status === 'Ativo' : prof.status === 'Inativo'
      );

  return (
    <Layout title="Profissionais" subtitle="Gerencie sua equipe e acompanhe o desempenho">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total de Profissionais" 
          value="5" 
          color="blue"
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Agendamentos" 
          value="165" 
          trend={{ value: 8, direction: 'up', label: 'este mês' }}
          color="green"
          icon={<Calendar size={20} />}
        />
        <StatCard 
          title="Receita Total" 
          value="R$ 8.610,00" 
          color="purple"
          icon={<DollarSign size={20} />}
        />
        <StatCard 
          title="Tempo Médio" 
          value="45 min" 
          color="amber"
          icon={<Clock size={20} />}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Desempenho por Profissional" subtitle="Agendamentos realizados no mês">
          <SimpleBarChart 
            data={performanceData.map(item => ({
              ...item,
              color: 'bg-blue-500'
            }))} 
            height={200}
          />
        </Card>
        
        <Card title="Receita por Profissional" subtitle="Valores gerados no mês">
          <SimpleBarChart 
            data={revenueData.map(item => ({
              ...item,
              color: 'bg-green-500'
            }))} 
            height={200}
          />
        </Card>
      </div>

      {/* Main Content */}
      <Card 
        title="Gerenciamento de Profissionais"
        action={
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Plus size={16} />}
          >
            Novo Profissional
          </Button>
        }
        className="mb-6"
      >
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar profissional..."
            />
          </div>
          <Button variant="outline" size="md" icon={<Filter size={16} />}>
            Filtros
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'all' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('all')}
              >
                Todos
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'active' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Ativos
              </button>
            </li>
            <li>
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'inactive' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('inactive')}
              >
                Inativos
              </button>
            </li>
          </ul>
        </div>
        
        {/* Professionals Table */}
        <DataTable
          columns={[
            { 
              header: 'Nome', 
              accessor: 'name',
              cell: (value) => (
                <div className="font-medium text-gray-900">{value}</div>
              )
            },
            { header: 'Função', accessor: 'role' },
            { header: 'Email', accessor: 'email' },
            { header: 'Telefone', accessor: 'phone' },
            { 
              header: 'Agendamentos', 
              accessor: 'appointments',
              cell: (value) => (
                <div className="font-medium">{value}</div>
              )
            },
            { 
              header: 'Receita', 
              accessor: 'revenue',
              cell: (value) => (
                <div className="font-medium">{value}</div>
              )
            },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'Ativo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {value}
                </span>
              )
            },
            { 
              header: 'Ações', 
              accessor: 'id',
              cell: (value) => (
                <div className="flex space-x-2">
                  <Button variant="outline" size="xs">Ver</Button>
                  <Button variant="outline" size="xs">Editar</Button>
                </div>
              )
            },
          ]}
          data={filteredProfessionals}
        />
      </Card>
      
      {/* Professional Detail View - Mockup */}
      <Card title="Detalhes do Profissional">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Professional Info */}
          <div className="md:col-span-1 border-r pr-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-semibold mb-2">
                CS
              </div>
              <h3 className="text-lg font-semibold">Carlos Santos</h3>
              <p className="text-gray-500">Barbeiro</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>carlos@email.com</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                <p>(11) 99999-1111</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Especialidades</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Corte Masculino</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Barba</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Pigmentação</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Taxa de Comissão</h4>
                <p>50%</p>
              </div>
            </div>
          </div>
          
          {/* Professional Tabs */}
          <div className="md:col-span-2">
            <div className="border-b border-gray-200 mb-6">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                  <button className="inline-block py-2 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600">
                    Desempenho
                  </button>
                </li>
                <li className="mr-2">
                  <button className="inline-block py-2 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-600">
                    Comissões
                  </button>
                </li>
                <li>
                  <button className="inline-block py-2 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-600">
                    Agenda
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Performance Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <h4 className="text-sm text-gray-500 mb-1">Agendamentos</h4>
                  <p className="text-2xl font-semibold text-blue-700">45</p>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <h4 className="text-sm text-gray-500 mb-1">Receita Total</h4>
                  <p className="text-2xl font-semibold text-green-700">R$ 2.250,00</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-center">
                  <h4 className="text-sm text-gray-500 mb-1">Comissão</h4>
                  <p className="text-2xl font-semibold text-amber-700">R$ 1.125,00</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <h4 className="text-sm text-gray-500 mb-1">Avaliação</h4>
                  <p className="text-2xl font-semibold text-purple-700">4.8/5</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Serviços Realizados</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-1/2">
                      <p>Corte Masculino</p>
                    </div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-1/2">
                      <p>Barba</p>
                    </div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-1/2">
                      <p>Corte + Barba</p>
                    </div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default ProfessionalsPrototype;
