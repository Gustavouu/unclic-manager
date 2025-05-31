
import React from 'react';
import { Button } from '@/components/ui/button';
import { BusinessData } from '@/hooks/useBusinessWebsite';

export interface WebsiteBannerProps {
  business: BusinessData;
  onBookingClick: () => void;
}

export function WebsiteBanner({ business, onBookingClick }: WebsiteBannerProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">{business.name}</h2>
        {business.description && (
          <p className="text-xl mb-8 max-w-2xl mx-auto">{business.description}</p>
        )}
        <Button 
          onClick={onBookingClick}
          size="lg"
          variant="secondary"
        >
          Agende Seu Horário
        </Button>
      </div>
    </section>
  );
}
