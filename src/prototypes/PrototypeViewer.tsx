
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Unclic - Protótipos de Alta Fidelidade</h1>
            <p className="text-gray-600">Selecione um módulo para visualizar</p>
          </header>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/dashboard" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
              Dashboard
            </Link>
            <Link to="/clients" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
              Clientes
            </Link>
            <Link to="/professionals" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
              Profissionais
            </Link>
            <Link to="/finance" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
              Financeiro e PDV
            </Link>
            <Link to="/inventory" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
              Estoque
            </Link>
            <Link to="/reports" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
              Relatórios
            </Link>
            <Link to="/settings" className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 text-center transition duration-200">
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
            <Route path="/dashboard" element={<DashboardPrototype />} />
            <Route path="/clients" element={<ClientsPrototype />} />
            <Route path="/professionals" element={<ProfessionalsPrototype />} />
            <Route path="/finance" element={<FinancePrototype />} />
            <Route path="/inventory" element={<InventoryPrototype />} />
            <Route path="/reports" element={<ReportsPrototype />} />
            <Route path="/settings" element={<SettingsPrototype />} />
            <Route path="/" element={
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
    </Router>
  );
};

export default PrototypeViewer;
