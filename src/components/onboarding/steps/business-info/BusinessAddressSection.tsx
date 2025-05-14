
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const BusinessAddressSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateBusinessData({ [name]: value });
  };
  
  const handleCepSearch = async () => {
    const cep = businessData.cep || businessData.zipCode;
    
    if (!cep || cep.length < 8) {
      toast.error("Digite um CEP válido");
      return;
    }
    
    setLoading(true);
    
    try {
      // First try to use viaCep service
      const formattedCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      
      updateBusinessData({
        address: data.logradouro || businessData.address,
        neighborhood: data.bairro || businessData.neighborhood,
        city: data.localidade || businessData.city,
        state: data.uf || businessData.state
      });
      
      toast.success("Endereço encontrado");
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Erro ao buscar o endereço");
    } finally {
      setLoading(false);
    }
  };
  
  const handleBlur = (fieldName: string) => {
    if (fieldName === 'cep' && businessData.cep && businessData.cep.length >= 8) {
      handleCepSearch();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" /> 
          Endereço
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex space-x-2">
            <div className="space-y-2 flex-1">
              <Label htmlFor="cep">
                CEP <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="cep"
                name="cep"
                value={businessData.cep || businessData.zipCode || ''}
                onChange={(e) => {
                  updateBusinessData({ 
                    cep: e.target.value,
                    zipCode: e.target.value
                  });
                }}
                onBlur={() => handleBlur('cep')}
                placeholder="00000-000"
                required
              />
            </div>
            <div className="self-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCepSearch}
                disabled={loading}
              >
                {loading ? 
                  <span className="animate-spin">⏳</span> : 
                  <><Search className="h-4 w-4 mr-1" /> Buscar</>
                }
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">
              Endereço <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="address"
              name="address"
              value={businessData.address || ''}
              onChange={handleChange}
              placeholder="Rua, Avenida, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="number">
              Número <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="number"
              name="number"
              value={businessData.number || businessData.addressNumber || ''}
              onChange={(e) => {
                updateBusinessData({ 
                  number: e.target.value,
                  addressNumber: e.target.value
                });
              }}
              placeholder="123"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input 
              id="complement"
              name="complement"
              value={businessData.complement || businessData.addressComplement || ''}
              onChange={(e) => {
                updateBusinessData({ 
                  complement: e.target.value,
                  addressComplement: e.target.value
                });
              }}
              placeholder="Apto, Sala, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input 
              id="neighborhood"
              name="neighborhood"
              value={businessData.neighborhood || ''}
              onChange={handleChange}
              placeholder="Centro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input 
              id="city"
              name="city"
              value={businessData.city || ''}
              onChange={handleChange}
              placeholder="São Paulo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input 
              id="state"
              name="state"
              value={businessData.state || ''}
              onChange={handleChange}
              placeholder="SP"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
