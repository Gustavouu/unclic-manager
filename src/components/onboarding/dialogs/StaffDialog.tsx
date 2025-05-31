
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
  staff?: StaffData;
  onSave: (staff: StaffData) => void;
}

export const StaffDialog: React.FC<StaffDialogProps> = ({
  open,
  onOpenChange,
  staff,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<StaffData>>({
    nome: '',
    cargo: '',
    email: '',
    phone: '',
    bio: '',
    foto_url: '',
    especializacoes: [],
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        ...staff,
        email: staff.email || '',
        phone: staff.phone || '',
      });
    } else {
      setFormData({
        nome: '',
        cargo: '',
        email: '',
        phone: '',
        bio: '',
        foto_url: '',
        especializacoes: [],
      });
    }
  }, [staff, open]);

  const handleSave = () => {
    if (!formData.nome?.trim()) return;

    const staffData: StaffData = {
      id: staff?.id || `staff_${Date.now()}`,
      nome: formData.nome,
      cargo: formData.cargo || 'Funcionário',
      email: formData.email || '',
      phone: formData.phone || '',
      bio: formData.bio || '',
      foto_url: formData.foto_url || '',
      especializacoes: formData.especializacoes || [],
    };

    onSave(staffData);
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
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do funcionário"
            />
          </div>

          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              value={formData.cargo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
              placeholder="Ex: Cabeleireiro, Manicure"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Breve descrição sobre o funcionário"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.nome?.trim()}>
              {staff ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
