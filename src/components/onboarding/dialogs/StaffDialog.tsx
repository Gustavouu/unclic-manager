
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StaffData } from '@/contexts/onboarding/types';

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    specialties?: string[];
  }) => void;
  staff?: StaffData | null;
}

export const StaffDialog: React.FC<StaffDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  staff,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    photo_url: '',
    specialties: [] as string[],
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.nome || staff.name || '',
        role: staff.cargo || staff.role || '',
        email: staff.email || '',
        phone: staff.phone || '',
        bio: staff.bio || '',
        photo_url: staff.foto_url || staff.photo_url || '',
        specialties: staff.especializacoes || staff.specialties || [],
      });
    } else {
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        bio: '',
        photo_url: '',
        specialties: [],
      });
    }
  }, [staff, open]);

  const handleSubmit = () => {
    if (!formData.name?.trim()) return;

    onSubmit({
      name: formData.name,
      role: formData.role || 'Funcionário',
      email: formData.email,
      phone: formData.phone,
      specialties: formData.specialties,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {staff ? 'Editar Funcionário' : 'Adicionar Funcionário'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do funcionário"
            />
          </div>

          <div>
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Ex: Cabeleireiro, Manicure"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Breve descrição sobre o funcionário"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name?.trim()}>
              {staff ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
