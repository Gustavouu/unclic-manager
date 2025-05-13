
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
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
            <div>
              <Label htmlFor="confirm-password">Confirme a senha</Label>
              <Input id="confirm-password" type="password" placeholder="********" />
            </div>
            <Button type="submit" className="w-full">Registrar</Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
