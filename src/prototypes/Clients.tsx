
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { StatCard } from './components/stats/StatCard';
import { Card } from './components/Card';
import { DataTable } from './components/data/DataTable';
import { Button } from './components/Button';
import { Search, Filter, Plus, Users, TrendingUp, Calendar, Phone } from 'lucide-react';

const ClientsPrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for clients
  const clientsData = [
    { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-1111', lastVisit: '15/05/2023', totalSpent: 'R$ 350,00', status: 'Ativo' },
    { id: '2', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 99999-2222', lastVisit: '20/05/2023', totalSpent: 'R$ 520,00', status: 'Ativo' },
    { id: '3', name: 'Pedro Santos', email: 'pedro@email.com', phone: '(11) 99999-3333', lastVisit: '10/04/2023', totalSpent: 'R$ 180,00', status: 'Inativo' },
    { id: '4', name: 'Ana Pereira', email: 'ana@email.com', phone: '(11) 99999-4444', lastVisit: '02/05/2023', totalSpent: 'R$ 420,00', status: 'Ativo' },
    { id: '5', name: 'Lucas Costa', email: 'lucas@email.com', phone: '(11) 99999-5555', lastVisit: '25/03/2023', totalSpent: 'R$ 150,00', status: 'Inativo' },
  ];

  // Filter clients based on active tab
  const filteredClients = activeTab === 'all' 
    ? clientsData
    : clientsData.filter(client => 
        activeTab === 'active' ? client.status === 'Ativo' : client.status === 'Inativo'
      );

  return (
    <Layout title="Clientes" subtitle="Gerencie seus clientes e acompanhe seu histórico">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total de Clientes" 
          value="124" 
          color="blue"
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Novos Clientes" 
          value="18" 
          trend={{ value: 10, direction: 'up', label: 'este mês' }}
          color="green"
          icon={<TrendingUp size={20} />}
        />
        <StatCard 
          title="Visitas no Mês" 
          value="45" 
          color="amber"
          icon={<Calendar size={20} />}
        />
        <StatCard 
          title="Taxa de Retorno" 
          value="65%" 
          trend={{ value: 5, direction: 'up', label: 'este mês' }}
          color="purple"
          icon={<Users size={20} />}
        />
      </div>

      {/* Main Content */}
      <Card 
        title="Gerenciamento de Clientes"
        action={
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Plus size={16} />}
          >
            Novo Cliente
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
              placeholder="Buscar cliente..."
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
        
        {/* Clients Table */}
        <DataTable
          columns={[
            { 
              header: 'Nome', 
              accessor: 'name',
              cell: (value) => (
                <div className="font-medium text-gray-900">{value}</div>
              )
            },
            { 
              header: 'Contato', 
              accessor: 'phone',
              cell: (value) => (
                <div className="flex items-center">
                  <Phone size={14} className="mr-1 text-gray-400" />
                  <span>{value}</span>
                </div>
              )
            },
            { header: 'Email', accessor: 'email' },
            { header: 'Última Visita', accessor: 'lastVisit' },
            { 
              header: 'Total Gasto', 
              accessor: 'totalSpent',
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
          data={filteredClients}
        />
      </Card>
      
      {/* Client Detail View - Mockup */}
      <Card title="Detalhes do Cliente">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Info */}
          <div className="md:col-span-1 border-r pr-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-semibold mb-2">
                JS
              </div>
              <h3 className="text-lg font-semibold">João Silva</h3>
              <p className="text-gray-500">Cliente desde Jan/2023</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>joao@email.com</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                <p>(11) 99999-1111</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Aniversário</h4>
                <p>15/03/1985</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Última Visita</h4>
                <p>15/05/2023</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total Gasto</h4>
                <p className="font-medium">R$ 350,00</p>
              </div>
            </div>
          </div>
          
          {/* Client Tabs */}
          <div className="md:col-span-2">
            <div className="border-b border-gray-200 mb-6">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                  <button className="inline-block py-2 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600">
                    Histórico
                  </button>
                </li>
                <li className="mr-2">
                  <button className="inline-block py-2 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-600">
                    Agendamentos
                  </button>
                </li>
                <li>
                  <button className="inline-block py-2 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-600">
                    Anotações
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Client History */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Corte Masculino</h4>
                    <p className="text-sm text-gray-500">Atendido por Carlos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ 50,00</p>
                    <p className="text-sm text-gray-500">15/05/2023</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Corte + Barba</h4>
                    <p className="text-sm text-gray-500">Atendido por Carlos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ 80,00</p>
                    <p className="text-sm text-gray-500">30/04/2023</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Corte Masculino</h4>
                    <p className="text-sm text-gray-500">Atendido por Ana</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ 50,00</p>
                    <p className="text-sm text-gray-500">15/04/2023</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Button variant="outline" size="sm">Carregar Mais</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default ClientsPrototype;
