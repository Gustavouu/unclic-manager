
import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/card';
import { Sparkles, Shield, Zap, Users } from 'lucide-react';

const AuthPremium = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Hero Section - Left Side */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unclic Manager
              </h1>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Gerencie seu negócio com{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                inteligência
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              A plataforma completa para gestão de agendamentos, clientes e finanças. 
              Simplifique sua rotina e acelere seu crescimento.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Seguro e Confiável', desc: 'Seus dados protegidos' },
                { icon: Zap, title: 'Rápido e Eficiente', desc: 'Interface otimizada' },
                { icon: Users, title: 'Gestão Completa', desc: 'Clientes e agendamentos' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Auth Form - Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Unclic Manager
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Faça login para acessar sua conta
              </p>
            </div>

            {/* Glassmorphism Card */}
            <Card className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-white/20 shadow-2xl">
              <AuthForm />
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>© 2024 Unclic Manager. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPremium;
