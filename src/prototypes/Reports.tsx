
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Calendar, Download, Calendar as CalendarIcon } from 'lucide-react';
import { SimpleLineChart } from './components/charts/SimpleLineChart';
import { SimpleBarChart } from './components/charts/SimpleBarChart';
import { SimplePieChart } from './components/charts/SimplePieChart';

const ReportsPrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [period, setPeriod] = useState('month');
  
  // Monthly revenue data
  const revenueData = [
    { label: 'Jan', value: 4200 },
    { label: 'Fev', value: 3800 },
    { label: 'Mar', value: 5100 },
    { label: 'Abr', value: 4700 },
    { label: 'Mai', value: 6200 },
    { label: 'Jun', value: 5800 },
  ];
  
  // Service popularity data
  const serviceData = [
    { label: 'Corte Masculino', value: 45, color: '#4466ff' },
    { label: 'Barba', value: 25, color: '#10b981' },
    { label: 'Corte + Barba', value: 15, color: '#f59e0b' },
    { label: 'Coloração', value: 10, color: '#ef4444' },
    { label: 'Outros', value: 5, color: '#9ca3af' },
  ];
  
  // Payment methods data
  const paymentMethods = [
    { label: 'Cartão de Crédito', value: 45, color: '#4466ff' },
    { label: 'Cartão de Débito', value: 25, color: '#10b981' },
    { label: 'Dinheiro', value: 15, color: '#f59e0b' },
    { label: 'PIX', value: 15, color: '#ef4444' },
  ];
  
  // Professional revenue data
  const professionalData = [
    { label: 'Carlos', value: 2250 },
    { label: 'Ana', value: 3040 },
    { label: 'Pedro', value: 1500 },
    { label: 'Julia', value: 1820 },
  ];
  
  // Client acquisition data
  const clientData = [
    { label: 'Jan', value: 10 },
    { label: 'Fev', value: 15 },
    { label: 'Mar', value: 22 },
    { label: 'Abr', value: 18 },
    { label: 'Mai', value: 25 },
    { label: 'Jun', value: 30 },
  ];

  return (
    <Layout title="Relatórios" subtitle="Visualize e analise os dados do seu negócio">
      {/* Period Selector and Export Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="border rounded-lg p-1 flex bg-white">
            <button 
              className={`px-3 py-1 text-sm rounded ${period === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              onClick={() => setPeriod('week')}
            >
              Semana
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded ${period === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              onClick={() => setPeriod('month')}
            >
              Mês
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded ${period === 'year' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              onClick={() => setPeriod('year')}
            >
              Ano
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            icon={<CalendarIcon size={16} />}
          >
            Personalizado
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Download size={16} />}
          >
            Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Download size={16} />}
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Receita Total</h3>
            <p className="text-3xl font-bold text-blue-600">R$ 32.580,00</p>
            <p className="text-sm text-gray-500">+12% em relação ao período anterior</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Despesas</h3>
            <p className="text-3xl font-bold text-red-600">R$ 12.450,00</p>
            <p className="text-sm text-gray-500">-5% em relação ao período anterior</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Clientes</h3>
            <p className="text-3xl font-bold text-green-600">245</p>
            <p className="text-sm text-gray-500">35 novos neste período</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Agendamentos</h3>
            <p className="text-3xl font-bold text-amber-600">512</p>
            <p className="text-sm text-gray-500">98% de taxa de comparecimento</p>
          </div>
        </Card>
      </div>

      {/* Tabs Selector */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'financial' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
              }`}
              onClick={() => setActiveTab('financial')}
            >
              Financeiro
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'clients' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
              }`}
              onClick={() => setActiveTab('clients')}
            >
              Clientes
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'services' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Serviços
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'professionals' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
              }`}
              onClick={() => setActiveTab('professionals')}
            >
              Profissionais
            </button>
          </li>
        </ul>
      </div>

      {/* Financial Reports */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card 
            title="Receita Mensal" 
            subtitle="Últimos 6 meses"
            action={<Button variant="outline" size="sm">Ver Detalhes</Button>}
          >
            <SimpleLineChart 
              data={revenueData} 
              height={240}
              color="#10b981"
            />
          </Card>
          
          <Card title="Métodos de Pagamento" subtitle="Distribuição dos recebimentos">
            <SimplePieChart data={paymentMethods} size={180} />
          </Card>
          
          <Card 
            title="Receita por Categoria" 
            subtitle="Distribuição de receita por tipo de serviço"
            className="lg:col-span-2"
          >
            <SimpleBarChart 
              data={serviceData.map(item => ({
                ...item,
                color: `bg-${item.color}`
              }))} 
              height={240}
            />
          </Card>
        </div>
      )}
      
      {/* Client Reports */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Novos Clientes" subtitle="Aquisição de clientes nos últimos 6 meses">
            <SimpleLineChart 
              data={clientData} 
              height={240}
              color="#4466ff"
            />
          </Card>
          
          <Card title="Retenção de Clientes" subtitle="Taxa de retorno de clientes">
            <div className="flex flex-col items-center justify-center h-60">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#4466ff"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">75%</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                75% dos clientes retornam após a primeira visita
              </p>
            </div>
          </Card>
          
          <Card 
            title="Frequência de Visitas" 
            subtitle="Número médio de visitas por cliente"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">1 vez</h4>
                <p className="text-2xl font-semibold text-blue-700">25%</p>
                <p className="text-xs text-gray-500 mt-1">dos clientes</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">2-3 vezes</h4>
                <p className="text-2xl font-semibold text-blue-700">35%</p>
                <p className="text-xs text-gray-500 mt-1">dos clientes</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">4-6 vezes</h4>
                <p className="text-2xl font-semibold text-blue-700">25%</p>
                <p className="text-xs text-gray-500 mt-1">dos clientes</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">7+ vezes</h4>
                <p className="text-2xl font-semibold text-blue-700">15%</p>
                <p className="text-xs text-gray-500 mt-1">dos clientes</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Service Reports */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Serviços Populares" subtitle="Distribuição por agendamentos">
            <SimplePieChart data={serviceData} size={180} />
          </Card>
          
          <Card title="Avaliação dos Serviços" subtitle="Média de avaliações por serviço">
            <SimpleBarChart 
              data={[
                { label: 'Corte Masculino', value: 4.8, color: 'bg-green-500' },
                { label: 'Barba', value: 4.6, color: 'bg-green-500' },
                { label: 'Corte + Barba', value: 4.9, color: 'bg-green-500' },
                { label: 'Coloração', value: 4.3, color: 'bg-green-500' },
                { label: 'Outros', value: 4.5, color: 'bg-green-500' },
              ]} 
              height={240}
            />
          </Card>
          
          <Card 
            title="Taxa de Ocupação" 
            subtitle="Porcentagem de horários preenchidos"
            className="lg:col-span-2"
          >
            <SimpleLineChart 
              data={[
                { label: 'Segunda', value: 65 },
                { label: 'Terça', value: 70 },
                { label: 'Quarta', value: 75 },
                { label: 'Quinta', value: 85 },
                { label: 'Sexta', value: 95 },
                { label: 'Sábado', value: 98 },
                { label: 'Domingo', value: 40 },
              ]} 
              height={240}
              color="#f59e0b"
            />
          </Card>
        </div>
      )}
      
      {/* Professional Reports */}
      {activeTab === 'professionals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Receita por Profissional" subtitle="Valores gerados no período">
            <SimpleBarChart 
              data={professionalData.map(item => ({
                ...item,
                color: 'bg-blue-500'
              }))} 
              height={240}
            />
          </Card>
          
          <Card title="Produtividade" subtitle="Agendamentos realizados por profissional">
            <SimpleBarChart 
              data={[
                { label: 'Carlos', value: 45, color: 'bg-purple-500' },
                { label: 'Ana', value: 38, color: 'bg-purple-500' },
                { label: 'Pedro', value: 30, color: 'bg-purple-500' },
                { label: 'Julia', value: 52, color: 'bg-purple-500' },
              ]} 
              height={240}
            />
          </Card>
          
          <Card 
            title="Avaliação dos Profissionais" 
            subtitle="Média de avaliações por profissional"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                    C
                  </div>
                  <h4 className="font-medium">Carlos</h4>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-5 h-5 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium">5.0</span>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                    A
                  </div>
                  <h4 className="font-medium">Ana</h4>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium">4.8</span>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                    P
                  </div>
                  <h4 className="font-medium">Pedro</h4>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium">4.7</span>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                    J
                  </div>
                  <h4 className="font-medium">Julia</h4>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium">4.9</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default ReportsPrototype;
