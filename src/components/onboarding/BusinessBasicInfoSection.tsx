
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

type BusinessInfo = {
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
};

export default function BusinessBasicInfoSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    zipCode: '',
    city: '',
    state: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get user session to link business to user
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para continuar",
          variant: "destructive",
        });
        return;
      }

      // Check if user already has a business
      const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id')
        .eq('admin_email', session.user.email)
        .maybeSingle();

      if (existingBusiness) {
        // Update existing business
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            name: businessInfo.name,
            phone: businessInfo.phone,
            address: businessInfo.address,
            zip_code: businessInfo.zipCode,
            city: businessInfo.city,
            state: businessInfo.state,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingBusiness.id);

        if (updateError) throw updateError;
        
        // Update onboarding progress
        await supabase
          .from('onboarding_progress')
          .upsert({ 
            tenantId: existingBusiness.id, 
            step: 'business', 
            completed: true, 
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { onConflict: 'tenantId,step' });

        toast({
          title: "Sucesso",
          description: "Informações do negócio atualizadas com sucesso",
        });
        
        // Navigate to next step
        navigate('/onboarding/services');
      } else {
        // Create new business
        const slug = businessInfo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        const { data: newBusiness, error: createError } = await supabase
          .from('businesses')
          .insert([
            {
              name: businessInfo.name,
              slug: slug,
              admin_email: session.user.email,
              phone: businessInfo.phone,
              address: businessInfo.address,
              zip_code: businessInfo.zipCode,
              city: businessInfo.city,
              state: businessInfo.state,
              status: "active",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (createError) throw createError;

        // Initialize onboarding progress
        if (newBusiness) {
          await supabase
            .from('onboarding_progress')
            .insert([
              { tenantId: newBusiness.id, step: 'welcome', completed: true, completedAt: new Date().toISOString() },
              { tenantId: newBusiness.id, step: 'business', completed: true, completedAt: new Date().toISOString() }
            ]);
        }

        toast({
          title: "Sucesso",
          description: "Negócio criado com sucesso",
        });
        
        // Navigate to next step
        navigate('/onboarding/services');
      }
    } catch (error: any) {
      console.error('Error saving business info:', error);
      
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar informações do negócio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Negócio</Label>
        <Input
          id="name"
          name="name"
          value={businessInfo.name}
          onChange={handleChange}
          placeholder="Ex: Barbearia do João"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={businessInfo.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={businessInfo.email}
            onChange={handleChange}
            placeholder="contato@seudominio.com"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          value={businessInfo.address}
          onChange={handleChange}
          placeholder="Rua, número, complemento"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={businessInfo.zipCode}
            onChange={handleChange}
            placeholder="00000-000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={businessInfo.city}
            onChange={handleChange}
            placeholder="Sua cidade"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            value={businessInfo.state}
            onChange={handleChange}
            placeholder="UF"
            required
          />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Continuar'}
        </Button>
      </div>
    </form>
  );
}
