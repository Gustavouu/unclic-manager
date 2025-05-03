
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { StatCard } from './components/stats/StatCard';
import { Card } from './components/Card';
import { DataTable } from './components/data/DataTable';
import { Button } from './components/Button';
import { Search, Filter, Plus, Package, AlertTriangle, Archive, ShoppingBag, TrendingDown } from 'lucide-react';
import { SimpleBarChart } from './components/charts/SimpleBarChart';

const InventoryPrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for products
  const productsData = [
    { id: '1', name: 'Pomada Modeladora', category: 'Cabelo', price: 'R$ 35,00', cost: 'R$ 18,00', stock: 15, minStock: 5, status: 'Em Estoque' },
    { id: '2', name: 'Shampoo Premium', category: 'Cabelo', price: 'R$ 45,00', cost: 'R$ 22,00', stock: 8, minStock: 10, status: 'Baixo Estoque' },
    { id: '3', name: 'Óleo para Barba', category: 'Barba', price: 'R$ 30,00', cost: 'R$ 15,00', stock: 12, minStock: 8, status: 'Em Estoque' },
    { id: '4', name: 'Kit Barbear', category: 'Acessórios', price: 'R$ 120,00', cost: 'R$ 80,00', stock: 3, minStock: 5, status: 'Baixo Estoque' },
    { id: '5', name: 'Máquina de Corte', category: 'Equipamentos', price: 'R$ 250,00', cost: 'R$ 180,00', stock: 0, minStock: 2, status: 'Sem Estoque' },
    { id: '6', name: 'Tesoura Profissional', category: 'Equipamentos', price: 'R$ 180,00', cost: 'R$ 120,00', stock: 2, minStock: 3, status: 'Baixo Estoque' },
  ];
  
  // Products by category data
  const categoryData = [
    { label: 'Cabelo', value: 15 },
    { label: 'Barba', value: 8 },
    { label: 'Acessórios', value: 5 },
    { label: 'Equipamentos', value: 6 },
    { label: 'Outros', value: 3 },
  ];

  // Filter products based on active tab
  let filteredProducts = productsData;
  if (activeTab === 'low') {
    filteredProducts = productsData.filter(product => product.status === 'Baixo Estoque');
  } else if (activeTab === 'out') {
    filteredProducts = productsData.filter(product => product.status === 'Sem Estoque');
  }

  return (
    <Layout title="Estoque" subtitle="Gerencie seu inventário e produtos">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total de Produtos" 
          value="37" 
          color="blue"
          icon={<Package size={20} />}
        />
        <StatCard 
          title="Baixo Estoque" 
          value="8" 
          trend={{ value: 3, direction: 'up', label: 'desde ontem' }}
          color="amber"
          icon={<AlertTriangle size={20} />}
        />
        <StatCard 
          title="Sem Estoque" 
          value="3" 
          color="red"
          icon={<TrendingDown size={20} />}
        />
        <StatCard 
          title="Valor Total" 
          value="R$ 8.350,00" 
          color="purple"
          icon={<Archive size={20} />}
        />
      </div>

      {/* Category Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Categories Chart */}
        <div className="md:col-span-2">
          <Card 
            title="Produtos por Categoria" 
            subtitle="Distribuição do estoque"
            action={<Button variant="outline" size="sm">Ver Detalhes</Button>}
          >
            <SimpleBarChart 
              data={categoryData.map(item => ({
                ...item,
                color: 'bg-blue-500'
              }))} 
              height={220}
            />
          </Card>
        </div>
        
        {/* Low Stock Alert */}
        <div>
          <Card title="Alertas de Estoque" subtitle="Itens que precisam de atenção">
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 bg-amber-50 p-3 rounded-r-lg">
                <h4 className="font-medium">Produtos com Baixo Estoque</h4>
                <p className="text-sm text-gray-500">8 produtos abaixo do estoque mínimo</p>
                <Button variant="outline" size="sm" className="mt-2">Ver Produtos</Button>
              </div>
              
              <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r-lg">
                <h4 className="font-medium">Produtos sem Estoque</h4>
                <p className="text-sm text-gray-500">3 produtos indisponíveis</p>
                <Button variant="outline" size="sm" className="mt-2">Ver Produtos</Button>
              </div>
              
              <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg">
                <h4 className="font-medium">Pedido Pendente</h4>
                <p className="text-sm text-gray-500">1 pedido aguardando recebimento</p>
                <Button variant="outline" size="sm" className="mt-2">Ver Detalhes</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Management */}
      <Card 
        title="Gerenciamento de Produtos"
        action={
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Plus size={16} />}
          >
            Novo Produto
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
              placeholder="Buscar produto..."
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
                  activeTab === 'low' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('low')}
              >
                Baixo Estoque
              </button>
            </li>
            <li>
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'out' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab('out')}
              >
                Sem Estoque
              </button>
            </li>
          </ul>
        </div>
        
        {/* Products Table */}
        <DataTable
          columns={[
            { 
              header: 'Produto', 
              accessor: 'name',
              cell: (value) => (
                <div className="font-medium text-gray-900">{value}</div>
              )
            },
            { header: 'Categoria', accessor: 'category' },
            { 
              header: 'Preço', 
              accessor: 'price',
              cell: (value) => (
                <div className="font-medium">{value}</div>
              )
            },
            { header: 'Custo', accessor: 'cost' },
            { 
              header: 'Estoque', 
              accessor: 'stock',
              cell: (value) => (
                <div className="font-medium">{value}</div>
              )
            },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (value) => {
                let colorClass = 'bg-green-100 text-green-800';
                if (value === 'Baixo Estoque') {
                  colorClass = 'bg-amber-100 text-amber-800';
                } else if (value === 'Sem Estoque') {
                  colorClass = 'bg-red-100 text-red-800';
                }
                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {value}
                  </span>
                );
              }
            },
            { 
              header: 'Ações', 
              accessor: 'id',
              cell: (value) => (
                <div className="flex space-x-2">
                  <Button variant="outline" size="xs">Editar</Button>
                  <Button variant="outline" size="xs" icon={<Plus size={14} />}>Estoque</Button>
                </div>
              )
            },
          ]}
          data={filteredProducts}
        />
      </Card>
      
      {/* Product Detail / Add Form */}
      <Card title="Cadastro de Produto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome do produto"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Selecione uma categoria</option>
                  <option value="cabelo">Cabelo</option>
                  <option value="barba">Barba</option>
                  <option value="acessorios">Acessórios</option>
                  <option value="equipamentos">Equipamentos</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código do Produto</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Código de barras ou SKU"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="un">Unidade</option>
                  <option value="cx">Caixa</option>
                  <option value="kg">Kilograma</option>
                  <option value="ml">Mililitros</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição do produto"
                rows={4}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancelar</Button>
              <Button variant="primary">Salvar Produto</Button>
            </div>
          </div>
          
          {/* Product Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="mb-3">
                  <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center mb-2">
                  Arraste uma imagem ou clique para fazer upload
                </p>
                <Button variant="outline" size="sm">Selecionar Imagem</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Movimento de Estoque</h4>
              <div className="border rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimento</label>
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <input type="radio" id="entrada" name="movimento" className="mr-1" />
                        <label htmlFor="entrada" className="text-sm">Entrada</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="saida" name="movimento" className="mr-1" />
                        <label htmlFor="saida" className="text-sm">Saída</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <input
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  
                  <Button variant="outline" size="sm" fullWidth>Registrar Movimento</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default InventoryPrototype;
