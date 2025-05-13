
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Bem-vindo à Unclic
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de agendamento para profissionais e pequenos negócios
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            className="px-8 py-2"
          >
            Entrar
          </Button>
          <Button 
            onClick={() => navigate('/registro')}
            variant="outline"
            className="px-8 py-2"
          >
            Criar conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
