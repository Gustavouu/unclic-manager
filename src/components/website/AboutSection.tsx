
import React from 'react';
import { BusinessData } from '@/hooks/useBusinessWebsite';

export interface AboutSectionProps {
  business: BusinessData;
}

export function AboutSection({ business }: AboutSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sobre Nós</h2>
          {business.description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {business.description}
            </p>
          )}
        </div>
        
        {(business.phone || business.address) && (
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {business.phone && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Contato</h3>
                <p className="text-gray-600">{business.phone}</p>
              </div>
            )}
            {business.address && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Localização</h3>
                <p className="text-gray-600">
                  {business.address}
                  {business.address_number && `, ${business.address_number}`}
                  {business.city && `, ${business.city}`}
                  {business.state && ` - ${business.state}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
