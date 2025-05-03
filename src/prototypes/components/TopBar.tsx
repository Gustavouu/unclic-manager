
import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export const TopBar = () => {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar..."
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-3">
        {/* Help button */}
        <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
          <HelpCircle size={20} />
        </button>
        
        {/* Notifications */}
        <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User menu - simplified for the prototype */}
        <div className="flex items-center cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            U
          </div>
        </div>
      </div>
    </header>
  );
};
