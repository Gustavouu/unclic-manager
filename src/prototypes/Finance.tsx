
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { StatCard } from './components/stats/StatCard';
import { Card } from './components/Card';
import { DataTable } from './components/data/DataTable';
import { Button } from './components/Button';
import { Search, Filter, Plus, Calendar, TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt } from 'lucide-react';
import { SimpleLineChart } from './components/charts/SimpleLineChart';
import { SimplePieChart } from './components/charts/SimplePieChart';

const FinancePrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for finance
  const transactionsData = [
    { id: '1', date: '15/05/2023', description: 'Corte Masculino - João Silva', category: 'Serviço', method: 'Cartão de Crédito', amount: 'R$ 50,00', type: 'Receita' },
    { id: '2', date: '15/05/2023', description: 'Barba - Pedro Santos', category: 'Serviço', method: 'Dinheiro', amount: 'R$ 30,00', type: 'Receita' },
    { id: '3', date: '15/05/2023', description: 'Produto Capilar', category: 'Produto', method: 'PIX', amount: 'R$ 45,00', type: 'Receita' },
    { id: '4', date: '14/05/2023', description: 'Corte Feminino - Maria Oliveira', category: 'Serviço', method: 'Cartão de Débito', amount: 'R$ 70,00', type: 'Receita' },
    { id: '5', date: '14/05/2023', description: 'Compra de Produtos', category: 'Estoque', method: 'Transferência', amount: 'R$ 200,00', type: 'Despesa' },
    { id: '6', date: '13/05/2023', description: 'Aluguel', category: 'Despesa Fixa', method: 'Transferência', amount: 'R$ 1.500,00', type: 'Despesa' },
  ];
  
  // Financial data for charts
  const revenueData = [
    { label: '01/05', value: 350 },
    { label: '02/05', value: 420 },
    { label: '03/05', value: 380 },
    { label: '04/05', value: 450 },
    { label: '05/05', value: 520 },
    { label: '06/05', value: 480 },
    { label: '07/05', value: 350 },
    { label: '08/05', value: 400 },
    { label: '09/05', value: 430 },
    { label: '10/05', value: 470 },
    { label: '11/05', value: 500 },
    { label: '12/05', value: 550 },
    { label: '13/05', value: 480 },
    { label: '14/05', value: 520 },
    { label: '15/05', value: 490 },
  ];
  
  // Payment methods data
  const paymentMethods = [
    { label: 'Cartão de Crédito', value: 45, color: '#4466ff' },
    { label: 'Cartão de Débito', value: 25, color: '#10b981' },
    { label: 'Dinheiro', value: 15, color: '#f59e0b' },
    { label: 'PIX', value: 15, color: '#ef4444' },
  ];

  // Filter transactions based on active tab
  const filteredTransactions = activeTab === 'all' 
    ? transactionsData
    : transactionsData.filter(transaction => 
        activeTab === 'income' 
          ? transaction.type === 'Receita' 
          : transaction.type === 'Despesa'
      );

  return (
    <Layout title="Financeiro e PDV" subtitle="Gerencie suas finanças e vendas">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Receitas" 
          value="R$ 15.240,00" 
          trend={{ value: 12, direction: 'up', label: 'este mês' }}
          color="green"
          icon={<TrendingUp size={20} />}
        />
        <StatCard 
          title="Despesas" 
          value="R$ 6.850,00" 
          trend={{ value: 5, direction: 'down', label: 'este mês' }}
          color="red"
          icon={<TrendingDown size={20} />}
        />
        <StatCard 
          title="Lucro Líquido" 
          value="R$ 8.390,00" 
          trend={{ value: 18, direction: 'up', label: 'este mês' }}
          color="blue"
          icon={<DollarSign size={20} />}
        />
        <StatCard 
          title="Vendas" 
          value="156" 
          color="purple"
          icon={<Receipt size={20} />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="md:col-span-2">
          <Card 
            title="Movimentação Financeira" 
            subtitle="Últimos 15 dias"
            action={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Semana</Button>
                <Button variant="primary" size="sm">Mês</Button>
              </div>
            }
          >
            <SimpleLineChart 
              data={revenueData} 
              height={250}
              color="#10b981"
            />
          </Card>
        </div>
        
        {/* Payment Methods */}
        <div>
          <Card title="Métodos de Pagamento" subtitle="Distribuição de recebimentos">
            <SimplePieChart data={paymentMethods} size={180} />
          </Card>
        </div>
      </div>

      {/* PDV Section */}
      <Card 
        title="Ponto de Venda"
        action={
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Plus size={16} />}
          >
            Nova Venda
          </Button>
        }
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Section */}
          <div className="md:col-span-2">
            <div className="border rounded-lg">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Carrinho de Compra</h4>
              </div>
              
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Corte Masculino</p>
                    <p className="text-sm text-gray-500">Serviço</p>
                  </div>
                  <div className="text-right">
                    <p>R$ 50,00</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">-</button>
                      <span className="text-sm">1</span>
                      <button className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Shampoo Premium</p>
                    <p className="text-sm text-gray-500">Produto</p>
                  </div>
                  <div className="text-right">
                    <p>R$ 45,00</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">-</button>
                      <span className="text-sm">1</span>
                      <button className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex justify-between mb-2">
                  <p>Subtotal</p>
                  <p>R$ 95,00</p>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <p>Total</p>
                  <p>R$ 95,00</p>
                </div>
                <div className="mt-4">
                  <Button variant="primary" fullWidth icon={<CreditCard size={16} />}>
                    Finalizar Pagamento
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Add Section */}
          <div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Adicionar ao Carrinho</h4>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar item..."
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Serviços Populares</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Corte Masculino
                  <p className="text-xs text-gray-500">R$ 50,00</p>
                </button>
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Barba
                  <p className="text-xs text-gray-500">R$ 30,00</p>
                </button>
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Corte + Barba
                  <p className="text-xs text-gray-500">R$ 70,00</p>
                </button>
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Corte Feminino
                  <p className="text-xs text-gray-500">R$ 70,00</p>
                </button>
              </div>
              
              <h4 className="font-medium mb-2 mt-4">Produtos Populares</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Pomada Modeladora
                  <p className="text-xs text-gray-500">R$ 35,00</p>
                </button>
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Shampoo Premium
                  <p className="text-xs text-gray-500">R$ 45,00</p>
                </button>
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Óleo para Barba
                  <p className="text-xs text-gray-500">R$ 30,00</p>
                </button>
                <button className="border p-2 rounded-lg text-sm hover:bg-gray-50">
                  Kit Barbear
                  <p className="text-xs text-gray-500">R$ 120,00</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions Section */}
      <Card 
        title="Transações"
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              icon={<Calendar size={16} />}
            >
              Filtrar por Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              icon={<Plus size={16} />}
            >
              Nova Transação
            </Button>
          </div>
        }
      >
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
                Todas
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'income' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('income')}
              >
                Receitas
              </button>
            </li>
            <li>
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'expense' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('expense')}
              >
                Despesas
              </button>
            </li>
          </ul>
        </div>
        
        {/* Transactions Table */}
        <DataTable
          columns={[
            { header: 'Data', accessor: 'date' },
            { 
              header: 'Descrição', 
              accessor: 'description',
              cell: (value) => (
                <div className="font-medium text-gray-900">{value}</div>
              )
            },
            { header: 'Categoria', accessor: 'category' },
            { 
              header: 'Método', 
              accessor: 'method',
              cell: (value) => (
                <div className="flex items-center">
                  <CreditCard size={14} className="mr-1 text-gray-400" />
                  <span>{value}</span>
                </div>
              )
            },
            { 
              header: 'Valor', 
              accessor: 'amount',
              cell: (value) => (
                <div className="font-medium">{value}</div>
              )
            },
            { 
              header: 'Tipo', 
              accessor: 'type',
              cell: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'Receita' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
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
          data={filteredTransactions}
        />
      </Card>
    </Layout>
  );
};

export default FinancePrototype;
