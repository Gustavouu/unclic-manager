
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="********" />
            </div>
            <div className="flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => navigate('/esqueci-senha')}
                className="text-sm text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Não tem uma conta?{' '}
              <button 
                onClick={() => navigate('/registro')}
                className="text-blue-600 hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
