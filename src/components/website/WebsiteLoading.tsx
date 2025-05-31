
import React from 'react';
import { Loader } from '@/components/ui/loader';

export interface WebsiteLoadingProps {
  type?: 'business' | 'services' | 'general';
  message?: string;
}

export function WebsiteLoading({ type = 'general', message }: WebsiteLoadingProps) {
  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'business':
        return 'Carregando informações do negócio...';
      case 'services':
        return 'Carregando serviços...';
      default:
        return 'Carregando...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size="lg" text={getMessage()} />
      </div>
    </div>
  );
}
