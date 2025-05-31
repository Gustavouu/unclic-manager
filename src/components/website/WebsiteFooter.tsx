
import React from 'react';
import { BusinessData } from '@/hooks/useBusinessWebsite';

export interface WebsiteFooterProps {
  business: BusinessData;
}

export function WebsiteFooter({ business }: WebsiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{business.name}</h3>
            {business.description && (
              <p className="text-gray-400 mb-4">{business.description}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            {business.phone && <p className="text-gray-400 mb-2">{business.phone}</p>}
            {business.admin_email && <p className="text-gray-400">{business.admin_email}</p>}
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Endereço</h3>
            <p className="text-gray-400">
              {business.address}
              {business.address_number && `, ${business.address_number}`}
              <br />
              {business.city && `${business.city}`}
              {business.state && `, ${business.state}`}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} {business.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
