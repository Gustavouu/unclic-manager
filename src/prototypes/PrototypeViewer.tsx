
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  DashboardPrototype,
  ClientsPrototype,
  ProfessionalsPrototype,
  FinancePrototype,
  InventoryPrototype,
  ReportsPrototype,
  SettingsPrototype
} from './index';

const PrototypeViewer = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unclic - Protótipos de Alta Fidelidade</h1>
          <p className="text-gray-600">Selecione um módulo para visualizar</p>
        </header>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/prototype/dashboard" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Dashboard
          </Link>
          <Link to="/prototype/clients" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Clientes
          </Link>
          <Link to="/prototype/professionals" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Profissionais
          </Link>
          <Link to="/prototype/finance" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Financeiro e PDV
          </Link>
          <Link to="/prototype/inventory" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Estoque
          </Link>
          <Link to="/prototype/reports" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Relatórios
          </Link>
          <Link to="/prototype/settings" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
            Configurações
          </Link>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-medium mb-2">Instruções</h2>
          <p>
            Estes são protótipos interativos das principais telas do aplicativo Unclic. 
            Selecione um módulo acima para visualizar o protótipo correspondente.
          </p>
        </div>
        
        <Routes>
          <Route path="/prototype/dashboard" element={<DashboardPrototype />} />
          <Route path="/prototype/clients" element={<ClientsPrototype />} />
          <Route path="/prototype/professionals" element={<ProfessionalsPrototype />} />
          <Route path="/prototype/finance" element={<FinancePrototype />} />
          <Route path="/prototype/inventory" element={<InventoryPrototype />} />
          <Route path="/prototype/reports" element={<ReportsPrototype />} />
          <Route path="/prototype/settings" element={<SettingsPrototype />} />
          <Route path="/prototype" element={
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <h2 className="text-xl font-medium mb-4">Bem-vindo aos Protótipos do Unclic</h2>
              <p className="text-gray-600 mb-4">
                Selecione um dos módulos acima para explorar os protótipos de alta fidelidade.
              </p>
              <img 
                src="https://via.placeholder.com/600x300?text=Unclic+App" 
                alt="Unclic App" 
                className="mx-auto rounded-lg shadow-sm"
              />
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default PrototypeViewer;
