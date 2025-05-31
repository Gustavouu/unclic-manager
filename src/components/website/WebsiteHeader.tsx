
import React from 'react';
import { Button } from '@/components/ui/button';
import { BusinessData } from '@/hooks/useBusinessWebsite';

export interface WebsiteHeaderProps {
  business: BusinessData;
  onBookingClick: () => void;
}

export function WebsiteHeader({ business, onBookingClick }: WebsiteHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {business.logo_url && (
              <img 
                src={business.logo_url} 
                alt={business.name}
                className="h-10 w-auto mr-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          </div>
          <Button onClick={onBookingClick}>
            Agendar Horário
          </Button>
        </div>
      </div>
    </header>
  );
}
