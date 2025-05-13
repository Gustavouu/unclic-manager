import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ProfessionalInfoTabProps {
  professional: {
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
    role?: string;
    hireDate?: string | Date;
    commissionPercentage?: number;
  };
}

export const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({ professional }) => {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Não informado";
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data inválida";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Colaborador</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <p id="name" className="text-sm font-medium">{professional.name || 'Não informado'}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Cargo</Label>
          <p id="role" className="text-sm font-medium">{professional.role || 'Não informado'}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <p id="email" className="text-sm font-medium">{professional.email || 'Não informado'}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <p id="phone" className="text-sm font-medium">{professional.phone || 'Não informado'}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hireDate">Data de Contratação</Label>
          <p id="hireDate" className="text-sm font-medium">{formatDate(professional.hireDate)}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="commission">Comissão (%)</Label>
          <p id="commission" className="text-sm font-medium">{professional.commissionPercentage ? `${professional.commissionPercentage}%` : 'Não informado'}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <p id="bio" className="text-sm font-medium">{professional.bio || 'Não informado'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
