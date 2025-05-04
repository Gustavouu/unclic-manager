import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { 
  Save, Building, Clock, Scissors, Users, 
  Calendar, CreditCard, Bell, Database, Shield, 
  Settings as SettingsIcon, Phone, Instagram, Mail, Globe
} from 'lucide-react';

const SettingsPrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');

  return (
    <Layout title="Configurações" subtitle="Gerencie as configurações do seu negócio">
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Button 
          variant="primary" 
          size="md" 
          icon={<Save size={16} />}
        >
          Salvar Alterações
        </Button>
      </div>

      {/* Settings Container */}
      <Card>
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar - Tabs */}
          <div className="md:w-64 p-4 border-r">
            <h3 className="text-lg font-medium mb-4">Configurações</h3>
            <nav className="space-y-1">
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'business' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('business')}
              >
                <Building size={18} className="mr-3" />
                <span>Perfil do Negócio</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'hours' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('hours')}
              >
                <Clock size={18} className="mr-3" />
                <span>Horário de Funcionamento</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'services' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('services')}
              >
                <Scissors size={18} className="mr-3" />
                <span>Serviços</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'staff' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('staff')}
              >
                <Users size={18} className="mr-3" />
                <span>Equipe</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'appointments' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('appointments')}
              >
                <Calendar size={18} className="mr-3" />
                <span>Agendamentos</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'financial' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('financial')}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Financeiro</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-3" />
                <span>Notificações</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'integrations' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('integrations')}
              >
                <Database size={18} className="mr-3" />
                <span>Integrações</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'permissions' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('permissions')}
              >
                <Shield size={18} className="mr-3" />
                <span>Permissões</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === 'advanced' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('advanced')}
              >
                <SettingsIcon size={18} className="mr-3" />
                <span>Configurações Avançadas</span>
              </button>
            </nav>
          </div>
          
          {/* Right Content Area */}
          <div className="flex-1 p-6">
            {/* Business Profile */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Perfil do Negócio</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Configure as informações básicas do seu estabelecimento.
                  </p>
                </div>
                
                {/* General Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Informações Gerais</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Estabelecimento
                    </label>
                    <input 
                      type="text" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome do estabelecimento"
                      defaultValue="Barbearia Modelo"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="email" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="contato@exemplo.com"
                          defaultValue="contato@barbearia.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="tel" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(00) 00000-0000"
                          defaultValue="(11) 99999-8888"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descreva seu estabelecimento"
                      defaultValue="Barbearia com foco em atendimento de alta qualidade e ambiente agradável."
                      rows={4}
                    />
                  </div>
                </div>
                
                {/* Web and Social */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-md font-medium">Web e Redes Sociais</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Globe size={16} className="text-gray-400" />
                      </div>
                      <input 
                        type="url" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://www.exemplo.com"
                        defaultValue="https://www.barbearia.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Instagram size={16} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="@nomedapagina"
                        defaultValue="@barbearia"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-md font-medium">Endereço</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CEP
                      </label>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="00000-000"
                        defaultValue="01234-567"
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Rua, Avenida, etc"
                        defaultValue="Av. Paulista"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número
                      </label>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número"
                        defaultValue="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sala, Andar, etc."
                        defaultValue="Sala 101"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Bairro"
                        defaultValue="Bela Vista"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade
                      </label>
                      <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cidade"
                        defaultValue="São Paulo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="SP" selected>São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Logos and Images */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-md font-medium">Logo e Imagens</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <div className="flex items-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                          <div className="text-gray-400">Logo</div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="mb-2">
                            Alterar Logo
                          </Button>
                          <p className="text-xs text-gray-500">
                            Recomendado: 200x200px, PNG ou JPG
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner
                      </label>
                      <div className="flex items-center">
                        <div className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                          <div className="text-gray-400">Banner</div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="mb-2">
                            Alterar Banner
                          </Button>
                          <p className="text-xs text-gray-500">
                            Recomendado: 1200x600px, PNG ou JPG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t flex justify-end">
                  <Button 
                    variant="primary" 
                    icon={<Save size={16} />}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
            
            {/* Business Hours */}
            {activeTab === 'hours' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Horário de Funcionamento</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configure os horários de funcionamento do seu estabelecimento.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center py-2 border-b">
                    <div className="font-medium">Dia</div>
                    <div className="font-medium">Horário de Abertura</div>
                    <div className="font-medium">Horário de Fechamento</div>
                  </div>
                  
                  {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map((day, index) => (
                    <div key={index} className="grid grid-cols-3 items-center py-2 border-b">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`day-${index}`} 
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked={index < 6} 
                        />
                        <label htmlFor={`day-${index}`}>{day}</label>
                      </div>
                      <div>
                        <select 
                          disabled={index === 6} 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00" selected>10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                        </select>
                      </div>
                      <div>
                        <select 
                          disabled={index === 6} 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                          <option value="19:00" selected>19:00</option>
                          <option value="20:00">20:00</option>
                          <option value="21:00">21:00</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button 
                    variant="primary" 
                    icon={<Save size={16} />}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
            
            {/* Other tabs would be implemented similarly */}
            {activeTab !== 'business' && activeTab !== 'hours' && (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Configurações de {activeTab}</h3>
                <p className="text-gray-500">Esta seção não está implementada no protótipo.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default SettingsPrototype;
