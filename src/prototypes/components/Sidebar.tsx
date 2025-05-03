
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Scissors, Package, Calendar, 
         CreditCard, BarChart3, Settings, Menu, X } from 'lucide-react';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/appointments' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: Scissors, label: 'Profissionais', path: '/professionals' },
    { icon: CreditCard, label: 'Financeiro', path: '/finance' },
    { icon: Package, label: 'Estoque', path: '/inventory' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile sidebar trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out border-r
                  ${isCollapsed ? 'w-16' : 'w-64'}
                  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className={`h-16 flex items-center px-4 border-b ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && <h2 className="text-xl font-semibold text-blue-600">Unclic</h2>}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:block hidden"
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            {isMobileOpen && (
              <button
                onClick={toggleMobileSidebar}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center py-2 px-3 rounded-md hover:bg-blue-50 ${
                      window.location.pathname === item.path 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700'
                    }`}
                  >
                    <item.icon size={20} className={isCollapsed ? 'mx-auto' : 'mr-3'} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className={`p-4 border-t flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              U
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-sm font-medium">Usuário Demo</p>
                <p className="text-xs text-gray-500">admin@unclic.app</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
